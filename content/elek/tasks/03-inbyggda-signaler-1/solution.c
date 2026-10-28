#include <stdio.h>

int main(void) {
    int raw, bits;
    double vref;
    scanf("%d %d %lf", &raw, &bits, &vref);
    int steg = 1 << bits;   // 10 bitar ger 2^10 = 1024 steg
    double volt = raw * vref / steg;
    // Det högsta värdet (steg - 1) räknas som full referensspänning.
    if (raw == steg - 1) volt = vref;
    printf("%.2f V\n", volt);
    return 0;
}
