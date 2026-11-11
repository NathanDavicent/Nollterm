#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>

uint8_t DDRB = 0, DDRC = 0, DDRD = 0;   // låtsasregister, på riktigt kommer de från <avr/io.h>

void printReg(const char* name, uint8_t value) {
    printf("%s = 0b", name);
    for (int bit = 7; bit >= 0; bit--) putchar((value >> bit) & 1 ? '1' : '0');
    putchar('\n');
}

int main(void) {
    int m;
    scanf("%d", &m);
    for (int i = 0; i < m; i++) {
        char pin[8];
        scanf("%7s", pin);
        char port = '?';
        int bit = 0;
        // TODO: "0"-"7" -> port D, "8"-"13" -> port B (bit = pin - 8), "A0"-"A5" -> port C.
        //       Sätt rätt bit i rätt DDR-register så att pinnen blir en utgång.
        printf("%s -> P%c%d\n", pin, port, bit);
    }
    printReg("DDRB", DDRB);
    printReg("DDRC", DDRC);
    printReg("DDRD", DDRD);
    return 0;
}
