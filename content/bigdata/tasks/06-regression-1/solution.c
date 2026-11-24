#include <math.h>
#include <stdio.h>

int main(void) {
    int n;
    double t[1000], p[1000], sum = 0.0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) { scanf("%lf %lf", &t[i], &p[i]); sum += t[i]; }
    double mean = sum / n;

    double absErr = 0, absBase = 0, ssRes = 0, ssTot = 0;
    for (int i = 0; i < n; i++) {
        absErr += fabs(t[i] - p[i]);
        absBase += fabs(t[i] - mean);
        ssRes += (t[i] - p[i]) * (t[i] - p[i]);   // modellens fel
        ssTot += (t[i] - mean) * (t[i] - mean);   // felet med medelvärdet som gissning
    }
    double mae = absErr / n;
    double baselineMae = absBase / n;
    double r2 = 1 - ssRes / ssTot;
    printf("MAE: %.3f\nMAE för medelvärdesbaslinjen: %.3f\nR2: %.3f\n", mae, baselineMae, r2);
    return 0;
}
