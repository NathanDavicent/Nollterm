import sys


def count_even(values):
    count = 0
    for v in values:
        if v % 2 == 0:
            count += 1
    return count


data = sys.stdin.read().split()
n = int(data[0])
print(count_even([int(x) for x in data[1:1 + n]]))
