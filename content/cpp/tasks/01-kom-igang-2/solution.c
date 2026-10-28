#include <stdio.h>

int main(void) {
    double c;
    scanf("%lf", &c);
    printf("%g\n", c * 9 / 5 + 32);   /* %g skriver som cout: 98.6, 212 */
    return 0;
}
