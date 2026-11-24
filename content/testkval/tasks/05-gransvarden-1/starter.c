#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    for (int k = 0; k < n; k++) {
        int lo, hi;
        scanf("%d %d", &lo, &hi);
        printf("Intervall %d..%d\n", lo, hi);
        // TODO: testa lo-1, lo, lo+1, hi-1, hi och hi+1 och skriv om värdet är giltigt
        printf("  %d: giltig\n", lo);
        printf("  %d: giltig\n", hi);
    }
    return 0;
}
