const fs = require("fs");
const { instructionToBinary } = require("./code");

const symbols = {
    'R0': 0,
    'R1': 1,
    'R2': 2,
    'R3': 3,
    'R4': 4,
    'R5': 5,
    'R6': 6,
    'R7': 7,
    'R8': 8,
    'R9': 9,
    'R10': 10,
    'R11': 11,
    'R12': 12,
    'R13': 13,
    'R14': 14,
    'R15': 15,
    'SCREEN': 16384,
    'KBD': 24576,
    'SP': 0,
    'LCL': 1,
    'ARG': 2,
    'THIS': 3,
    'THAT': 4
}

const file = fs.readFileSync("./input.asm", "utf-8")
const lines = file.split('\n');

let lineNumber = 0;
let n = 0;
let instruction = null;

for (let i = 0; i < 3; i++) {
    for (const line of lines) {
        const trimmedLine = line.trim();
        const [lineWithoutWhiteSpace] = trimmedLine.split(" ");
        instruction = null

        if (lineWithoutWhiteSpace.startsWith('//') || lineWithoutWhiteSpace === "") {
            continue;
        }

        if (i === 0) {
            if(lineWithoutWhiteSpace.startsWith('(')) {
                const labelName = lineWithoutWhiteSpace.replace(/\(|\)/g, "");
    
                if(!symbols[labelName]) {
                    symbols[labelName] = lineNumber

                    instruction = `@${symbols[labelName]}`;
                    continue
                }
                
                instruction = symbols[labelName];
                continue
            }

            lineNumber++;
        }

        if (i === 1) {
            if (n < 16) {
                n = 16
            }
            
            const addressAsNumber = +lineWithoutWhiteSpace.slice(1);
            if(lineWithoutWhiteSpace.startsWith('@') && isNaN(addressAsNumber)) {
                const varName = lineWithoutWhiteSpace.slice(1);
                if (!symbols.hasOwnProperty(varName)) {
                    symbols[varName] = n;

                    n++
                }

                instruction = symbols[varName];
                continue
            }
        }

        if (i === 2) {
            if (lineWithoutWhiteSpace.startsWith('(')) {
                continue
            }
            

            const addressAsNumber = +lineWithoutWhiteSpace.slice(1);
            if(lineWithoutWhiteSpace.startsWith('@') && isNaN(addressAsNumber)) {
                const varName = lineWithoutWhiteSpace.slice(1);

                instruction = `@${symbols[varName]}`;
            } else {
                instruction = lineWithoutWhiteSpace
            }

            const binary = instructionToBinary(instruction);
            fs.appendFileSync("./output.hack", binary + '\n')
        }
    }
}