#include <stdio.h>

int main(void) {
    int n, x;
    scanf("%d %d", &n, &x);
    int minV = x, maxV = x;          /* starta med första värdet, inte 0 */
    for (int i = 1; i < n; i++) {
        scanf("%d", &x);
        if (x < minV) minV = x;
        if (x > maxV) maxV = x;
    }
    printf("%d %d\n", minV, maxV);
    return 0;
}
