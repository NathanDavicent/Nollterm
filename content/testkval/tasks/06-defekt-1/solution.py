mods = []
for _ in range(int(input())):
    name, bugs, lines = input().split()
    mods.append((name, int(bugs), int(lines)))

def density(bugs, lines):
    return bugs / (lines / 1000)   # inte bugs / lines / 1000

total = density(sum(m[1] for m in mods), sum(m[2] for m in mods))
for name, bugs, lines in sorted(mods, key=lambda m: density(m[1], m[2]), reverse=True):
    d = density(bugs, lines)
    flag = "  <- över snittet, extra granskning" if d > total else ""
    print(f"{name}: {d:.1f} per KLOC{flag}")
print(f"Totalt: {total:.1f} per KLOC")
