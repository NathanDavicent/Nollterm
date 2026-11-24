#include <stdio.h>

#define PI 3.141592653589793

int main(void) {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        double air, process, rpm, torque;
        scanf("%lf %lf %lf %lf", &air, &process, &rpm, &torque);
        double powerW = torque * rpm * 2 * PI / 60;   // P = M * omega, omega i rad/s
        double diffK = process - air;
        printf("effekt %.1f W, temperaturskillnad %.1f K\n", powerW, diffK);
    }
    return 0;
}
