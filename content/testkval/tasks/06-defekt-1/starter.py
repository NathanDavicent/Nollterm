mods = []
for _ in range(int(input())):
    name, bugs, lines = input().split()
    mods.append((name, int(bugs), int(lines)))

def density(bugs, lines):
    return 0.0      # TODO: defekter per tusen rader, tänk på parenteserna

total = density(sum(m[1] for m in mods), sum(m[2] for m in mods))
# TODO: sortera med högst densitet först och markera moduler över totalen
for name, bugs, lines in mods:
    print(f"{name}: {density(bugs, lines):.1f} per KLOC")
print(f"Totalt: {total:.1f} per KLOC")
