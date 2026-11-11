#include <stdio.h>

typedef enum { STATE_IDLE, STATE_1, STATE_12, STATE_123, STATE_UNLOCKED } SafeState;

const char* stateName(SafeState s) {
    switch (s) {
        case STATE_IDLE: return "IDLE";
        case STATE_1: return "1";
        case STATE_12: return "12";
        case STATE_123: return "123";
        case STATE_UNLOCKED: return "OLÅST";
    }
    return "?";
}

// Koden är 1234. Fel siffra skickar tillbaka till IDLE. 0 låser när skåpet är olåst.
SafeState nextState(SafeState s, char key) {
    // TODO: en switch över s
    return s;
}

int main(void) {
    char keys[256];
    scanf("%255s", keys);
    SafeState state = STATE_IDLE;
    for (int i = 0; keys[i] != '\0'; i++) {
        state = nextState(state, keys[i]);
        printf("%c -> %s\n", keys[i], stateName(state));
    }
    return 0;
}
