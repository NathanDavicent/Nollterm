#include <stdio.h>

#define SENSOR_ERROR (-999.0)

double convert_to_celsius(int raw_adc) {
    // TODO: fel om raw_adc ligger utanför 0..4095, annars raw * (3.3 / 4095) * 100
    return raw_adc;
}

int main(void) {
    int n, count = 0;
    double sum = 0.0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        int raw;
        scanf("%d", &raw);
        double c = convert_to_celsius(raw);
        if (c == SENSOR_ERROR) {
            printf("%d -> fel\n", raw);
        } else {
            sum += c;
            count++;
            printf("%d -> %.2f\n", raw, c);
        }
    }
    if (count > 0) printf("Medel: %.2f\n", sum / count);
    else printf("Medel: -\n");
    return 0;
}
