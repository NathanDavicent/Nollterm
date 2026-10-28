import sys


def average(values):
    total = 0
    for i in range(len(values) + 1):
        total += values[i]
    return total // len(values)


data = sys.stdin.read().split()
n = int(data[0])
print(f"{average([int(x) for x in data[1:1 + n]]):g}")
