@sum
M=0
@i
M=0
@R2
M=0
D=0

(IS_I_LESSER_THAN_R1)
    @R1
    D=M-D // R1 - @i
    @LOOP
    D;JGT // if (R1 > @i) go again

    @FINISH
    0;JMP

(LOOP)
    @R0
    D=M
    @sum
    M=D+M // sum = R0 + sum

    @i
    M=M+1 // i++
    D=M
    @IS_I_LESSER_THAN_R1
    0;JMP

(FINISH)
    @sum
    D=M
    @R2
    M=D // R2 = sum

    (END)
    @END
    0;JMP