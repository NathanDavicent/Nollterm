#include <stdio.h>

int main(void) {
    long clock, prescaler;
    int bits;
    scanf("%ld %ld %d", &clock, &prescaler, &bits);
    long steps = 1L << bits;                       // 8 bitar: 256 steg (0-255) innan overflow
    double tickUs = prescaler * 1e6 / clock;       // tid per tick i mikrosekunder
    double overflowMs = prescaler * steps * 1000.0 / clock;
    long ticksPerSecond = clock / prescaler;       // 16 MHz / 1024 = 15625
    long overflows = ticksPerSecond / steps;
    long ticks = ticksPerSecond % steps;
    printf("Tick: %.3f us\n", tickUs);
    printf("Overflow: %.3f ms\n", overflowMs);
    printf("1 s = %ld overflows + %ld ticks\n", overflows, ticks);
    return 0;
}
