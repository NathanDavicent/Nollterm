ERROR = -999.0

def convert_to_celsius(raw_adc):
    # TODO: fel om raw_adc ligger utanför 0..4095, annars raw * (3.3 / 4095) * 100
    return raw_adc


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
