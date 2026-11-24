#include <stdio.h>

void printBits(unsigned int v) {
    for (int bit = 7; bit >= 0; bit--) putchar((v >> bit) & 1 ? '1' : '0');
}

int main(void) {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        unsigned int addr;
        char rw[4];
        scanf("%x %3s", &addr, rw);
        if (addr < 0x08 || addr > 0x77) {          // 0x00-0x07 och 0x78-0x7F är reserverade
            printf("0x%02X: reserverad adress\n", addr);
            continue;
        }
        unsigned int byte = (addr << 1) | (rw[0] == 'R' ? 1u : 0u);   // R/W i bit 0
        printf("0x%02X %s -> 0x%02X (", addr, rw, byte);
        printBits(byte);
        printf(")\n");
    }
    return 0;
}
