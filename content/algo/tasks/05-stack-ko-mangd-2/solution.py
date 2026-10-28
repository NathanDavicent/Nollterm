def read_values():
    input()   # antalet
    return [int(v) for v in input().split()]


a = read_values()
b = read_values()
union, snitt, diff = [], [], []
for x in a + b:
    if x not in union:          # en mängd har inga dubbletter
        union.append(x)
for x in a:
    if x in b and x not in snitt:
        snitt.append(x)         # i både a och b
    if x not in b and x not in diff:
        diff.append(x)          # i a men inte i b
print("Union:", *sorted(union))
print("Snitt:", *sorted(snitt))
print("Differens:", *sorted(diff))
