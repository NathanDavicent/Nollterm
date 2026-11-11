#include <stdio.h>
#include <stdint.h>
#include <string.h>

// TODO: skriv makron som sätter, nollställer, flippar och läser bit b i a
#define BIT_SET(a, b)    (a)
#define BIT_CLEAR(a, b)  (a)
#define BIT_FLIP(a, b)   (a)
#define BIT_CHECK(a, b)  (0)

void printBits(uint8_t value) {
    for (int bit = 7; bit >= 0; bit--) putchar((value >> bit) & 1 ? '1' : '0');
}

int main(void) {
    unsigned start;
    int m;
    scanf("%u %d", &start, &m);
    uint8_t reg = (uint8_t)start;
    for (int i = 0; i < m; i++) {
        char cmd[16];
        int bit;
        scanf("%15s %d", cmd, &bit);
        if (strcmp(cmd, "set") == 0) BIT_SET(reg, bit);
        else if (strcmp(cmd, "clear") == 0) BIT_CLEAR(reg, bit);
        else if (strcmp(cmd, "toggle") == 0) BIT_FLIP(reg, bit);

        if (strcmp(cmd, "check") == 0) {
            printf("check %d: %d\n", bit, BIT_CHECK(reg, bit) ? 1 : 0);
        } else {
            printf("%s %d: ", cmd, bit);
            printBits(reg);
            printf("\n");
        }
    }
    return 0;
}
