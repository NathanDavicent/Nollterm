ERROR = -999.0

def convert_to_celsius(raw_adc):
    if raw_adc < 0 or raw_adc > 4095:      # 12-bitars ADC: 0..4095
        return ERROR
    return raw_adc * (3.3 / 4095.0) * 100.0


valid = []
for _ in range(int(input())):
    raw = int(input())
    c = convert_to_celsius(raw)
    if c == ERROR:
        print(f"{raw} -> fel")
    else:
        valid.append(c)
        print(f"{raw} -> {c:.2f}")
print(f"Medel: {sum(valid) / len(valid):.2f}" if valid else "Medel: -")
