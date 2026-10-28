#include <stdio.h>

int readSensor(int raw, float* val) {

}

int main(void) {
    int raw;
    scanf("%d", &raw);
    float v = 0;
    if (readSensor(raw, &v) == 0) printf("OK\n");
    else printf("SENSOR_ERROR\n");
    return 0;
}
