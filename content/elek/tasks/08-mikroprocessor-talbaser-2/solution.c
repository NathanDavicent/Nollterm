#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    const char* siffror = "0123456789ABCDEF";
    char hex[16];
    int antal = 0;
    // Samma idé som binärt, men vi delar med 16. Rest 10-15 blir A-F.
    do {
        hex[antal++] = siffror[n % 16];
        n /= 16;
    } while (n > 0);
    printf("0x");
    for (int i = antal - 1; i >= 0; i--) putchar(hex[i]);
    putchar('\n');
    return 0;
}
