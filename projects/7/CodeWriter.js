const STACK_POINTER = "@SP";

const stackMapper = {
  local: "@LCL",
  argument: "@ARG",
  this: "@THIS",
  that: "@THAT",
  temp: "@5", // Temp base address on the HACK architecture
};

function conditionalJumpOperation(jumpOperation, lineNumber) {
  return `${STACK_POINTER}
AM=M-1
D=M
${STACK_POINTER}
AM=M-1
D=M-D
@TRUE_${lineNumber}
D;${jumpOperation}
${STACK_POINTER}
A=M
M=0
@END_${lineNumber}
0;JMP
(TRUE_${lineNumber})
${STACK_POINTER}
A=M
M=-1
@END_${lineNumber}
0;JMP
(END_${lineNumber})
${STACK_POINTER}
M=M+1\n`;
}

//TODO Como resolver a questão dos LOOPS em repetitivos comandos EQ, LT ou GT? Ao definir o (TRUE) label, ele ira para o endereço do loop, executará feito esperado, mas não voltará para o endereço do proximo comando.
const arithmeticMapper = {
  add: `${STACK_POINTER}
AM=M-1
D=M
${STACK_POINTER}
A=M-1
M=D+M\n`,
  sub: `${STACK_POINTER}
AM=M-1
D=M
${STACK_POINTER}
A=M-1
M=M-D\n`,
  neg: `${STACK_POINTER}
A=M-1
M=-M\n`,
  eq: (instructionCounter) =>
    conditionalJumpOperation("JEQ", instructionCounter),
  gt: (instructionCounter) =>
    conditionalJumpOperation("JGT", instructionCounter),
  lt: (instructionCounter) =>
    conditionalJumpOperation("JLT", instructionCounter),
  and: `${STACK_POINTER}
AM=M-1
D=M
${STACK_POINTER}
A=M-1
M=D&M\n`,
  or: `${STACK_POINTER}
AM=M-1
D=M
${STACK_POINTER}
A=M-1
M=D|M\n`,
  not: `${STACK_POINTER}
A=M-1
M=!M\n`,
};

let instructionCounter = 0;
module.exports = {
  instructionToAssembly(parsedInstruction, filename, debug = true) {
    let assembly = "";

    if (debug) {
      assembly = `// ${parsedInstruction.raw}\n`;
    }

    const baseStackPointerSymbol = stackMapper[parsedInstruction.stack];

    if (parsedInstruction.type === "C_PUSH") {
      const stacksThatBehavesTheSameWay = ["local", "argument", "this", "that"];

      if (parsedInstruction.stack === "constant") {
        const accessConstantAddress = `@${parsedInstruction.value}\n`;

        assembly += accessConstantAddress;
        assembly += "D=A\n";
        assembly += `${STACK_POINTER}\n`;
        assembly += "A=M\n"; // *SP
        assembly += "M=D\n"; // *SP = constant
        assembly += `${STACK_POINTER}\n`;
        assembly += "M=M+1\n"; // SP++
      } else if (
        stacksThatBehavesTheSameWay.includes(parsedInstruction.stack)
      ) {
        assembly += `${baseStackPointerSymbol}\n`;
        assembly += `A=M\n`;

        for (let i = 0; i < parsedInstruction.value; i++) {
          assembly += "A=A+1\n";
        }

        assembly += "D=M\n"; // D = *baseStackPointerSymbol
        assembly += `${STACK_POINTER}\n`;
        assembly += "A=M\n"; // *SP
        assembly += "M=D\n"; // *SP = *baseStackPointerSymbol
        assembly += `${STACK_POINTER}\n`;
        assembly += "M=M+1\n"; // SP++
      } else if (parsedInstruction.stack === "temp") {
        assembly += `${baseStackPointerSymbol}\n`; // @5

        for (let i = 0; i < parsedInstruction.value; i++) {
          assembly += "A=A+1\n";
        }

        assembly += "D=M\n"; // D = *baseStackPointerSymbol
        assembly += `${STACK_POINTER}\n`;
        assembly += "A=M\n"; // *SP
        assembly += "M=D\n"; // *SP = *baseStackPointerSymbol
        assembly += `${STACK_POINTER}\n`;
        assembly += "M=M+1\n"; // SP++
      } else if (parsedInstruction.stack === "pointer") {
        const thisOrThatBaseAddress =
          parsedInstruction.value === "0"
            ? stackMapper["this"]
            : stackMapper["that"];

        assembly += `${thisOrThatBaseAddress}\n`;
        assembly += "D=M\n"; // D = THIS or THAT
        assembly += `${STACK_POINTER}\n`;
        assembly += "A=M\n"; // *SP
        assembly += "M=D\n"; // *SP = THIS or THAT
        assembly += `${STACK_POINTER}\n`;
        assembly += "M=M+1\n";
      } else if (parsedInstruction.stack === "static") {
        assembly += `@${filename}.${parsedInstruction.value}\n`;
        assembly += `D=M\n`;
        assembly += `${STACK_POINTER}\n`;
        assembly += `A=M\n`;
        assembly += "M=D\n";
        assembly += `${STACK_POINTER}\n`;
        assembly += `M=M+1\n`;
      }
    } else if (parsedInstruction.type === "C_POP") {
      assembly += `${STACK_POINTER}\n`;
      assembly += "AM=M-1\n"; // *SP
      assembly += "D=M\n"; // D = *SP

      if (parsedInstruction.stack === "temp") {
        assembly += `${baseStackPointerSymbol}\n`;
      } else if (parsedInstruction.stack === "pointer") {
        const thisOrThatBaseAddress =
          parsedInstruction.value === "0"
            ? stackMapper["this"]
            : stackMapper["that"];

        assembly += `${thisOrThatBaseAddress}\n`;
      } else if (parsedInstruction.stack === "static") {
        assembly += `@${filename}.${parsedInstruction.value}\n`;
      } else {
        assembly += `${baseStackPointerSymbol}\n`;
        assembly += `A=M\n`; // A = *baseStackPointerAddress
      }

      if (parsedInstruction.stack !== "pointer" && parsedInstruction.stack !== "static") {
        for (let i = 0; i < parsedInstruction.value; i++) {
          assembly += "A=A+1\n";
        }
      }

      assembly += "M=D\n"; // *baseStackPointerAddress = *SP
    } else if (parsedInstruction.type === "C_ARITHMETIC") {
      const conditionalEvaluationOperations = ["eq", "gt", "lt"];

      if (conditionalEvaluationOperations.includes(parsedInstruction.value)) {
        assembly +=
          arithmeticMapper[parsedInstruction.value](instructionCounter);
      } else {
        assembly += arithmeticMapper[parsedInstruction.value];
      }
    }

    instructionCounter++;
    return assembly;
  },
};
