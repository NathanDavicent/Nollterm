clock, prescaler, bits = (int(v) for v in input().split())
tick_us = 0        # TODO
overflow_ms = 0    # TODO
overflows = 0      # TODO: hur många hela overflows och extra ticks blir 1 sekund?
ticks = 0
print(f"Tick: {tick_us:.3f} us")
print(f"Overflow: {overflow_ms:.3f} ms")
print(f"1 s = {overflows} overflows + {ticks} ticks")
