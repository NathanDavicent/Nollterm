#include <stdio.h>
#include <stdint.h>

static uint8_t parseBits(const char* s) {
    uint8_t v = 0;
    for (int i = 0; s[i] != '\0'; i++) v = (uint8_t)((v << 1) | (s[i] - '0'));
    return v;
}

// Körs "varje gång PCINT0 triggar", med nya värdet på PINB.
void onPinChange(uint8_t currState) {
    static uint8_t prevState = 0;                  // static: behåller värdet mellan anropen
    uint8_t changedPins = currState ^ prevState;   // XOR: 1 där pinnarna skiljer sig
    if (changedPins == 0) printf("ingen ändring\n");
    for (int bit = 0; bit < 8; bit++) {
        uint8_t mask = (uint8_t)(1U << bit);
        if (changedPins & mask) {
            printf("PB%d %s\n", bit, (currState & mask) ? "HIGH" : "LOW");
        }
    }
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
