import sys

data = sys.stdin.read().split()
n = int(data[0])
values = [int(x) for x in data[1:1 + n]]

min_v = max_v = values[0]        # starta med första värdet, inte 0
for x in values[1:]:
    if x < min_v:
        min_v = x
    if x > max_v:
        max_v = x
print(min_v, max_v)
