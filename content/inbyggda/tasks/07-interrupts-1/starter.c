#include <stdio.h>
#include <stdint.h>

static uint8_t parseBits(const char* s) {
    uint8_t v = 0;
    for (int i = 0; s[i] != '\0'; i++) v = (uint8_t)((v << 1) | (s[i] - '0'));
    return v;
}

// Körs "varje gång PCINT0 triggar", med nya värdet på PINB.
void onPinChange(uint8_t currState) {
    static uint8_t prevState = 0;   // static: behåller värdet mellan anropen
    // TODO: vilka bitar har ändrats? Skriv "PBn HIGH" eller "PBn LOW" för varje,
    //       i ordning från bit 0, eller "ingen ändring".
    prevState = currState;
}

int main(void) {
    int m;
    scanf("%d", &m);
    for (int i = 0; i < m; i++) {
        char s[16];
        scanf("%15s", s);
        onPinChange(parseBits(s));
    }
    return 0;
}
