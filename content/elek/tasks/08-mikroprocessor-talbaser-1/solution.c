#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    if (n == 0) { printf("0\n"); return 0; }
    char bitar[32];
    int antal = 0;
    // Dela med 2 upprepade gånger. Resterna är bitarna, minst signifikant först.
    while (n > 0) {
        bitar[antal++] = (char)('0' + n % 2);
        n /= 2;
    }
    for (int i = antal - 1; i >= 0; i--) putchar(bitar[i]);
    putchar('\n');
    return 0;
}
