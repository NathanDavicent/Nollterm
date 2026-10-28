#include <stdio.h>

int main(void) {
    int raw, bits;
    double vref;
    scanf("%d %d %lf", &raw, &bits, &vref);
    double volt = 0; // TODO: räkna om ADC-värdet till spänning
    printf("%.2f V\n", volt);
    return 0;
}
