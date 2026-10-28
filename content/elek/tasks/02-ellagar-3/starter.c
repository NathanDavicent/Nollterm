#include <stdio.h>

int main(void) {
    double u, r;
    scanf("%lf %lf", &u, &r);
    double i = 0, p = 0; // TODO: Ohms lag och effekt
    printf("I = %.3f A\n", i);
    printf("P = %.2f W\n", p);
    return 0;
}
