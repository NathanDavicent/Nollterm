#include <stdio.h>

int main(void) {
    char fmt[8], text[64];
    scanf("%7s %63s", fmt, text);
    int total = 0;
    for (int i = 0; text[i] != '\0'; i++) {
        int value = text[i];
        printf("%c 0x%02X: 0 ", text[i], value);   // startbit
        // TODO: skriv de 8 databitarna med LSB först, sedan paritetsbit (om fmt[1] är 'E' eller 'O')
        printf(" 1\n");                            // stoppbit
        total += 10;
    }
    printf("Totalt %d bitar\n", total);
    return 0;
}
