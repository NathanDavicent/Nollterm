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
    switch (s) {
        case STATE_IDLE:     return key == '1' ? STATE_1 : STATE_IDLE;
        case STATE_1:        return key == '2' ? STATE_12 : STATE_IDLE;
        case STATE_12:       return key == '3' ? STATE_123 : STATE_IDLE;
        case STATE_123:      return key == '4' ? STATE_UNLOCKED : STATE_IDLE;   // här skickas signalen som låser upp
        case STATE_UNLOCKED: return key == '0' ? STATE_IDLE : STATE_UNLOCKED;   // 0 låser dörren igen
    }
    return STATE_IDLE;
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
