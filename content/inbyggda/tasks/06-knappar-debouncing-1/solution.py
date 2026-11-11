n = int(input())
samples = input().strip()

# Utan debouncing: varje 0 -> 1 räknas, även studsarna.
raw = sum(1 for a, b in zip(samples, samples[1:]) if a == "0" and b == "1")

# Med debouncing: tillståndet byts först när den nya nivån hållit i n sampel i rad.
stable, count, debounced = 0, 0, 0
for c in samples:
    level = int(c)
    if level == stable:
        count = 0                  # studs tillbaka: börja om
    else:
        count += 1
        if count >= n:
            stable, count = level, 0   # nu litar vi på den nya nivån
            if stable == 1:
                debounced += 1
print(f"Rå: {raw}")
print(f"Debouncad: {debounced}")
