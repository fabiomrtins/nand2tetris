module.exports = {
    parseInstruction: function(instruction) {
        const parsedInstruction = {
            type: null,
            value: null,
            dest: null,
            comp: null,
            jump: null
        }

        if (instruction.startsWith('@')) {
            parsedInstruction["type"] = 'A';
            parsedInstruction["value"] = instruction.slice(1);
        } else if (instruction.startsWith('(')) {
            const labelName = instruction.replace(/\(|\)/g, "");

            parsedInstruction["type"] = 'L';
            parsedInstruction["value"] = labelName;
        } else {
            parsedInstruction["type"] = 'C';
            parsedInstruction["value"] = instruction;
            
            const cInstructionContainsEquals = instruction.includes('=');

            if (cInstructionContainsEquals) {
                const splittedInstruction = instruction.split('=');

                parsedInstruction["dest"] = splittedInstruction[0];
                parsedInstruction["comp"] = splittedInstruction[1]
            } else {
                const splittedInstruction = instruction.split(';');

                parsedInstruction["comp"] = splittedInstruction[0]
                parsedInstruction["jump"] = splittedInstruction[1]
            }

            if (parsedInstruction["comp"] === undefined) {
                throw new Error("Invalid comp instruction");
            }
        }

        return parsedInstruction;
    }
}