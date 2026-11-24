#include <stdio.h>

int main(void) {
    long long sensors, perSecond, size, copies;
    scanf("%lld %lld %lld %lld", &sensors, &perSecond, &size, &copies);

    long long bytesPerSecond = 0;   // TODO: sensorer x meddelanden per sekund x byte
    double gbPerDay = 0.0;          // TODO: 1 GB = 1e9 byte, ett dygn = 86400 s
    double tbPerYear = 0.0;         // TODO: 1 TB = 1e12 byte, ett år = 365 dygn

    printf("Byte per sekund: %lld\n", bytesPerSecond);
    printf("GB per dygn: %.2f\n", gbPerDay);
    printf("TB per år: %.2f\n", tbPerYear);
    printf("Med %lld kopior: %.2f TB per år\n", copies, tbPerYear * copies);
    return 0;
}
