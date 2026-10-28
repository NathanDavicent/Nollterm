#include <stdio.h>

int main(void) {
    char bitar[40];
    scanf("%39s", bitar);
    int varde = 0;
    // Läs från vänster: varje ny bit flyttar de tidigare ett steg upp (gånger 2).
    for (int i = 0; bitar[i] != '\0'; i++) {
        varde = varde * 2 + (bitar[i] - '0');
    }
    printf("%d\n", varde);
    return 0;
}
