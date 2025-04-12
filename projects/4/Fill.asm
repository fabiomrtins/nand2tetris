(RESET_SCREEN)
    @SCREEN
    D=A
    @current_screen_address
    M=D

(CHECK_KEYBOARD_INPUT)
    @24576 // screen's memory map last address.
    D=A

    @current_screen_address
    D=D-M // if (current_screen_address === 24576) -> RESET_SCREEN
    @RESET_SCREEN
    D;JEQ

    @KBD
    D=M

    @TURN_SCREEN_BLACK
    D;JNE

    @TURN_SCREEN_WHITE
    0;JMP

(TURN_SCREEN_BLACK)
    @current_screen_address
    D=M

    A=D
    M=-1 // Screen[A] = 1111111111111111 ( BLACK )

    @current_screen_address
    M=M+1 // screen_address++

    @CHECK_KEYBOARD_INPUT
    0;JMP

(TURN_SCREEN_WHITE)
    @current_screen_address
    D=M

    A=D
    M=0 // Screen[A] = 0000000000000000 ( WHITE )

    @current_screen_address
    M=M+1 // screen_address++

    @CHECK_KEYBOARD_INPUT
    0;JMP

(END)
    @END
    0;JMP