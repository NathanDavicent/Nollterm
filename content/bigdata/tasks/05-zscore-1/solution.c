#include <math.h>
#include <stdio.h>

int main(void) {
    int n, m;
    double normal[100];
    scanf("%d", &n);
    double sum = 0.0;
    for (int i = 0; i < n; i++) { scanf("%lf", &normal[i]); sum += normal[i]; }
    double mean = sum / n;
    double sq = 0.0;
    for (int i = 0; i < n; i++) sq += (normal[i] - mean) * (normal[i] - mean);
    double std = sqrt(sq / (n - 1));   // stickprov, som pandas .std()
    printf("Medel: %.2f, std: %.2f\n", mean, std);

    scanf("%d", &m);
    for (int i = 0; i < m; i++) {
        double value;
        scanf("%lf", &value);
        double z = (value - mean) / std;
        printf("%g: z = %.2f, %s\n", value, z, fabs(z) > 3 ? "LARM" : "normal");
    }
    return 0;
}
