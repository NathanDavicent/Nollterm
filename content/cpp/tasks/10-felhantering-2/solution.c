#include <stdio.h>

int readSensor(int raw, float* val) {
    if (raw < 0 || raw > 1023) return -1;
    *val = raw * 100.0f / 1023;
    return 0;
}

int main(void) {
    int raw;
    scanf("%d", &raw);
    float v = 0;
    if (readSensor(raw, &v) == 0) printf("OK\n");
    else printf("SENSOR_ERROR\n");
    return 0;
}
