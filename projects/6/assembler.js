const fs = require("fs");
const path = require("path");
const { instructionToBinary } = require("./code");
const { addSymbol, addVariable } = require("./symbol");
const { parseInstruction } = require("./parser");

const filePath = process.argv[2]

if (!filePath) {
    console.log("Please provide a file path.")
    return
}

const [fileName] = path.basename(filePath).split(".")
const file = fs.readFileSync(filePath, "utf-8")
const lines = file.split('\n');

let lineNumber = 0;
lines.forEach((line) => {
    const trimmedLine = line.trim();
    const [lineWithoutWhiteSpace] = trimmedLine.split(" ");

    if (lineWithoutWhiteSpace.startsWith('//') || lineWithoutWhiteSpace === "") {
        return
    }

    const parsedInstruction = parseInstruction(lineWithoutWhiteSpace)

    if (parsedInstruction.type === 'L') {
        addSymbol(parsedInstruction.value, lineNumber);
        return;
    }

    lineNumber++;
})

for (const line of lines) {
    const trimmedLine = line.trim();
    const [lineWithoutWhiteSpace] = trimmedLine.split(" ");

    if (lineWithoutWhiteSpace.startsWith('//') || lineWithoutWhiteSpace === "") {
        continue;
    }

    const parsedInstruction = parseInstruction(lineWithoutWhiteSpace)

    if (parsedInstruction.type === 'L') {
        continue;
    }

    if (parsedInstruction.type === 'A') {
        const address = addVariable(parsedInstruction);
        parsedInstruction["value"] = address
    }

    const binary = instructionToBinary(parsedInstruction);
    fs.appendFileSync(`./${fileName}.hack`, binary + '\n')
}
