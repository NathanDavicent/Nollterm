#include <stdio.h>
#include <string.h>

int main(void) {
    char grind[8];
    scanf("%7s", grind);
    printf("A B Q\n");
    for (int a = 0; a <= 1; a++) {
        for (int b = 0; b <= 1; b++) {
            int q = 0; // TODO: räkna ut Q beroende på grind (AND, OR, XOR, NAND, NOR)
            printf("%d %d %d\n", a, b, q);
        }
    }
    return 0;
}
