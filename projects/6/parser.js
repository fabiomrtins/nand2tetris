module.exports = {
    parse: function(string) {
        const cInstructionContainsEquals = string.includes('=');
        let comp = null;
        let jump = null;
        let dest = null

        // AM=M-1
        // 0;JMP
        

        if (cInstructionContainsEquals) {
            const splittedInstruction = string.split('=');

            dest = splittedInstruction[0];
            comp = splittedInstruction[1]

            return [dest, comp, jump];
        } else {
            const splittedInstruction = string.split(';');

            comp = splittedInstruction[0]
            jump = splittedInstruction[1]
        }


        return [dest, comp, jump];
    }
}