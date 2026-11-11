#include <stdio.h>
#include <string.h>

int main(void) {
    int n;
    char samples[1024];
    scanf("%d %1023s", &n, samples);
    int raw = 0, debounced = 0;
    // TODO: raw = antal gånger signalen går från 0 till 1 direkt i samplen.
    //       debounced = antal tryck när en ändring måste hålla i n sampel i rad.
    printf("Rå: %d\n", raw);
    printf("Debouncad: %d\n", debounced);
    return 0;
}
