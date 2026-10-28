#include <stdio.h>

int main(void) {
    double u, r;
    scanf("%lf %lf", &u, &r);
    double i = u / r;   // Ohms lag: U = R * I
    double p = u * i;   // effekt: P = U * I
    printf("I = %.3f A\n", i);
    printf("P = %.2f W\n", p);
    return 0;
}
