import sys


def total(values):
    s = 0
    for v in values:
        s += v
    return s


data = sys.stdin.read().split()
n = int(data[0])
print(total([int(x) for x in data[1:1 + n]]))
