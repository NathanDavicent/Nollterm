#include <stdio.h>

// Som Arduinos map(): flytta x från intervallet [in_min, in_max] till [out_min, out_max].
// Multiplicera först och dela sist, annars blir heltalsdivisionen 0 för det mesta.
long map_range(long x, long in_min, long in_max, long out_min, long out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

int main(void) {
    int q;
    scanf("%d", &q);
    for (int i = 0; i < q; i++) {
        long x, a, b, c, d;
        scanf("%ld %ld %ld %ld %ld", &x, &a, &b, &c, &d);
        printf("%ld\n", map_range(x, a, b, c, d));
    }
    return 0;
}
