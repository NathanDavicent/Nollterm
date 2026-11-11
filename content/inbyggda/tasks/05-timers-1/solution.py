clock, prescaler, bits = (int(v) for v in input().split())
steps = 2 ** bits                                  # 8 bitar: 256 steg innan overflow
tick_us = prescaler * 1e6 / clock                  # tid per tick i mikrosekunder
overflow_ms = prescaler * steps * 1000.0 / clock
ticks_per_second = clock // prescaler              # 16 MHz / 1024 = 15625
overflows, ticks = divmod(ticks_per_second, steps)
print(f"Tick: {tick_us:.3f} us")
print(f"Overflow: {overflow_ms:.3f} ms")
print(f"1 s = {overflows} overflows + {ticks} ticks")
