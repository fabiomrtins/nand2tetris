const values = [
  "C_ARITHMETIC",
  "C_PUSH",
  "C_POP",
  "C_LABEL",
  "C_GOTO",
  "C_IF",
  "C_FUNCTION",
  "C_RETURN",
  "C_CALL",
];

const arithmeticOperations = [
  "add",
  "sub",
  "neg",
  "eq",
  "gt",
  "lt",
  "and",
  "or",
  "not",
];

let lineNumber = 0
module.exports = {
  parseInstruction: function (instruction) {
    const splittedInstruction = instruction.split(" ");

    const parsedInstruction = {
      type: null,
      stack: null,
      value: null,
      raw: instruction,
      instruction_line: lineNumber
    };

    const operation = splittedInstruction[0];
    const stack = splittedInstruction[1];
    const value = splittedInstruction[2];

    if (operation === "push") {
      parsedInstruction["type"] = "C_PUSH";
      parsedInstruction["stack"] = stack
      parsedInstruction["value"] = value
    } else if (operation === "pop") {
      parsedInstruction["type"] = "C_POP";
      parsedInstruction["stack"] = stack
      parsedInstruction["value"] = value
    } else if (arithmeticOperations.includes(operation)) {
      parsedInstruction["type"] = "C_ARITHMETIC";
      parsedInstruction["value"] = operation
    }

    lineNumber++
    return parsedInstruction;
  },
};
