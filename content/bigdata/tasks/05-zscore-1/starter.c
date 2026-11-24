#include <math.h>
#include <stdio.h>

int main(void) {
    int n, m;
    double normal[100];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%lf", &normal[i]);
    double mean = 0.0;   // TODO: medelvärdet
    double std = 0.0;    // TODO: stickprovsstandardavvikelse (dela med n - 1)
    printf("Medel: %.2f, std: %.2f\n", mean, std);

    scanf("%d", &m);
    for (int i = 0; i < m; i++) {
        double value;
        scanf("%lf", &value);
        double z = 0.0;              // TODO
        const char *status = "normal";  // TODO: "LARM" om |z| > 3
        printf("%g: z = %.2f, %s\n", value, z, status);
    }
    return 0;
}
