#include <stdio.h>

int main(void) {
    char fmt[8], text[64];
    scanf("%7s %63s", fmt, text);
    int total = 0;
    for (int i = 0; text[i] != '\0'; i++) {
        int value = text[i];
        int ones = 0;
        printf("%c 0x%02X: 0 ", text[i], value);   // startbit
        for (int bit = 0; bit < 8; bit++) {         // LSB först
            int b = (value >> bit) & 1;
            ones += b;
            printf("%d", b);
        }
        total += 10;
        if (fmt[1] == 'E') { printf(" %d", ones % 2); total++; }        // jämn paritet
        else if (fmt[1] == 'O') { printf(" %d", 1 - ones % 2); total++; } // udda paritet
        printf(" 1\n");                            // stoppbit
    }
    printf("Totalt %d bitar\n", total);
    return 0;
}
