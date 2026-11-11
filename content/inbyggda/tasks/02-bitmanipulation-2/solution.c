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
    // Castningen till uint8_t kastar bort allt över 8 bitar, precis som i ett 8-bitars register.
    printRow("a & b", (uint8_t)(a & b));
    printRow("a | b", (uint8_t)(a | b));
    printRow("a ^ b", (uint8_t)(a ^ b));
    printRow("~a", (uint8_t)~a);         // ~ på en uint8_t ger ett int, så castningen behövs
    printRow("a << 2", (uint8_t)(a << 2)); // bitar som skiftas ut till vänster försvinner
    printRow("a >> 1", (uint8_t)(a >> 1));
    return 0;
}
