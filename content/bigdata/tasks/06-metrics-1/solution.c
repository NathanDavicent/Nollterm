#include <stdio.h>

double safeDiv(double a, double b) { return b != 0 ? a / b : 0.0; }   // zero_division=0

void report(const char *name, const int *yTrue, const int *yPred, int n) {
    int tn = 0, fp = 0, fn = 0, tp = 0;
    for (int i = 0; i < n; i++) {
        if (yTrue[i] == 1 && yPred[i] == 1) tp++;        // hittat fel
        else if (yTrue[i] == 0 && yPred[i] == 1) fp++;   // falskt larm
        else if (yTrue[i] == 1 && yPred[i] == 0) fn++;   // missat fel
        else tn++;                                       // sant normal
    }
    double accuracy = (double)(tp + tn) / n;
    double precision = safeDiv(tp, tp + fp);
    double recall = safeDiv(tp, tp + fn);
    double f1 = safeDiv(2 * precision * recall, precision + recall);
    printf("%s: [[%d, %d], [%d, %d]]\n", name, tn, fp, fn, tp);
    printf("  accuracy %.3f, precision %.3f, recall %.3f, f1 %.3f\n", accuracy, precision, recall, f1);
}

int main(void) {
    int n, yTrue[1000], yPred[1000], base[1000], ones = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) { scanf("%d", &yTrue[i]); ones += yTrue[i]; }
    for (int i = 0; i < n; i++) scanf("%d", &yPred[i]);
    report("Modell", yTrue, yPred, n);
    for (int i = 0; i < n; i++) base[i] = ones * 2 > n ? 1 : 0;   // vanligaste klassen
    report("Baslinje", yTrue, base, n);
    return 0;
}
