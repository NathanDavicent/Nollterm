#include <stdio.h>
#include <string.h>

int grindvarde(const char* grind, int a, int b) {
    if (strcmp(grind, "AND") == 0) return a & b;
    if (strcmp(grind, "OR") == 0) return a | b;
    if (strcmp(grind, "XOR") == 0) return a ^ b;
    if (strcmp(grind, "NAND") == 0) return !(a & b);   // NOT AND
    if (strcmp(grind, "NOR") == 0) return !(a | b);    // NOT OR
    return 0;
}

int main(void) {
    char grind[8];
    scanf("%7s", grind);
    printf("A B Q\n");
    for (int a = 0; a <= 1; a++) {
        for (int b = 0; b <= 1; b++) {
            printf("%d %d %d\n", a, b, grindvarde(grind, a, b));
        }
    }
    return 0;
}
