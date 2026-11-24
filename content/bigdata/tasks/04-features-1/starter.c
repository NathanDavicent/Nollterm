#include <stdio.h>

#define PI 3.141592653589793

int main(void) {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        double air, process, rpm, torque;
        scanf("%lf %lf %lf %lf", &air, &process, &rpm, &torque);
        double powerW = 0.0;   // TODO: vridmoment x rpm x 2 pi / 60
        double diffK = 0.0;    // TODO: process minus luft
        printf("effekt %.1f W, temperaturskillnad %.1f K\n", powerW, diffK);
    }
    return 0;
}
