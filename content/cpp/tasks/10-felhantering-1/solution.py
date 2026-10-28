import sys


def average(values):
    if not values:                    # tom lista → ingen division med noll
        return 0
    total = 0
    for i in range(len(values)):      # range(len) räcker, +1 går utanför
        total += values[i]
    return total / len(values)        # / ger decimaltal, // kapar


data = sys.stdin.read().split()
n = int(data[0])
print(f"{average([int(x) for x in data[1:1 + n]]):g}")
