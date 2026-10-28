#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    double serie = 0, inverssumma = 0;
    for (int i = 0; i < n; i++) {
        double r;
        scanf("%lf", &r);
        serie += r;             // i serie: R = R1 + R2 + ...
        inverssumma += 1.0 / r; // parallellt: 1/R = 1/R1 + 1/R2 + ...
    }
    printf("Serie: %.2f ohm\n", serie);
    printf("Parallell: %.2f ohm\n", 1.0 / inverssumma);
    return 0;
}
