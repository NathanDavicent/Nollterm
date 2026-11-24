#include <math.h>
#include <stdio.h>

int main(void) {
    int n;
    double t[1000], p[1000], sum = 0.0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) { scanf("%lf %lf", &t[i], &p[i]); sum += t[i]; }
    double mean = sum / n;

    double mae = 0.0;          // TODO: medel av |sant - prediktion|
    double baselineMae = 0.0;  // TODO: samma mått om man alltid gissar medelvärdet
    double r2 = 0.0;           // TODO: 1 - SS_res / SS_tot
    printf("MAE: %.3f\nMAE för medelvärdesbaslinjen: %.3f\nR2: %.3f\n", mae, baselineMae, r2);
    return 0;
}
