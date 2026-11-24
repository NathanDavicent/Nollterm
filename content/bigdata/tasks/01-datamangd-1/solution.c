#include <stdio.h>

int main(void) {
    long long sensors, perSecond, size, copies;
    scanf("%lld %lld %lld %lld", &sensors, &perSecond, &size, &copies);

    long long bytesPerSecond = sensors * perSecond * size;
    double gbPerDay = bytesPerSecond * 86400.0 / 1e9;          // sekunder per dygn
    double tbPerYear = bytesPerSecond * 86400.0 * 365 / 1e12;

    printf("Byte per sekund: %lld\n", bytesPerSecond);
    printf("GB per dygn: %.2f\n", gbPerDay);
    printf("TB per år: %.2f\n", tbPerYear);
    printf("Med %lld kopior: %.2f TB per år\n", copies, tbPerYear * copies);
    return 0;
}
