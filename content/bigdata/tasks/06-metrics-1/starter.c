#include <stdio.h>

void report(const char *name, const int *yTrue, const int *yPred, int n) {
    int tn = 0, fp = 0, fn = 0, tp = 0;
    // TODO: räkna sant negativa, falskt positiva, falskt negativa och sant positiva
    double accuracy = 0, precision = 0, recall = 0, f1 = 0;   // TODO (0 om nämnaren är 0)
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
