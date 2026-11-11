#include <cstdio>

int main() {
    long clock, prescaler;
    int bits;
    std::scanf("%ld %ld %d", &clock, &prescaler, &bits);
    const long steps = 1L << bits;                       // 8 bitar: 256 steg innan overflow
    const double tickUs = prescaler * 1e6 / clock;       // tid per tick i mikrosekunder
    const double overflowMs = prescaler * steps * 1000.0 / clock;
    const long ticksPerSecond = clock / prescaler;       // 16 MHz / 1024 = 15625
    std::printf("Tick: %.3f us\n", tickUs);
    std::printf("Overflow: %.3f ms\n", overflowMs);
    std::printf("1 s = %ld overflows + %ld ticks\n", ticksPerSecond / steps, ticksPerSecond % steps);
    return 0;
}
