#include <stdio.h>

int main(void) {
    long clock, prescaler;
    int bits;
    scanf("%ld %ld %d", &clock, &prescaler, &bits);
    double tickUs = 0, overflowMs = 0;   // TODO
    long overflows = 0, ticks = 0;       // TODO: hur många hela overflows och extra ticks blir 1 sekund?
    printf("Tick: %.3f us\n", tickUs);
    printf("Overflow: %.3f ms\n", overflowMs);
    printf("1 s = %ld overflows + %ld ticks\n", overflows, ticks);
    return 0;
}
