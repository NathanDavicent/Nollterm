#include <stdio.h>
#include <string.h>

int main(void) {
    int n;
    char samples[1024];
    scanf("%d %1023s", &n, samples);
    int len = (int)strlen(samples);

    // Utan debouncing: varje 0 -> 1 räknas, även studsarna.
    int raw = 0;
    for (int i = 1; i < len; i++)
        if (samples[i - 1] == '0' && samples[i] == '1') raw++;

    // Med debouncing: tillståndet byts först när den nya nivån hållit i n sampel i rad.
    int stable = 0, count = 0, debounced = 0;
    for (int i = 0; i < len; i++) {
        int level = samples[i] - '0';
        if (level == stable) {
            count = 0;                 // studs tillbaka: börja om
        } else if (++count >= n) {
            stable = level;            // nu litar vi på den nya nivån
            count = 0;
            if (stable == 1) debounced++;
        }
    }
    printf("Rå: %d\n", raw);
    printf("Debouncad: %d\n", debounced);
    return 0;
}
