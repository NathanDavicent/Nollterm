#include <stdio.h>
#include <stdint.h>

void printRow(const char* label, uint8_t value) {
    printf("%s = ", label);
    for (int bit = 7; bit >= 0; bit--) putchar((value >> bit) & 1 ? '1' : '0');
    printf(" (%u)\n", value);
}

int main(void) {
    unsigned x, y;
    scanf("%u %u", &x, &y);
    uint8_t a = (uint8_t)x, b = (uint8_t)y;
    // TODO: räkna ut rätt värden. Resultatet ska vara uint8_t, precis som ett register.
    printRow("a & b", 0);
    printRow("a | b", 0);
    printRow("a ^ b", 0);
    printRow("~a", 0);
    printRow("a << 2", 0);
    printRow("a >> 1", 0);
    return 0;
}
