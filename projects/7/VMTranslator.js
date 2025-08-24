const fs = require("fs");
const path = require("path");
const { parseInstruction } = require("./parser");
const { instructionToAssembly } = require("./CodeWriter");

const filePath = process.argv[2]

if (!filePath) {
    console.log("Please provide a file path.")
    return
}

const [fileName] = path.basename(filePath).split(".")
const file = fs.readFileSync(filePath, "utf-8")
const lines = file.split('\n');

for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('//') || trimmedLine === "") {
        continue;
    }

    const parsedInstruction = parseInstruction(trimmedLine)

    const assemblyInstruction = instructionToAssembly(parsedInstruction, fileName)

    fs.appendFileSync(`./asm_files/${fileName}.asm`, assemblyInstruction)
}
