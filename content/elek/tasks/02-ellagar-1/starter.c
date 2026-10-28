#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    double serie = 0, parallell = 0;
    for (int i = 0; i < n; i++) {
        double r;
        scanf("%lf", &r);
        // TODO: räkna ut serie- och parallellresistansen
    }
    printf("Serie: %.2f ohm\n", serie);
    printf("Parallell: %.2f ohm\n", parallell);
    return 0;
}
