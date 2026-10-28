import sys


def reverse_in_place(values):
    n = len(values)
    for i in range(n // 2):
        values[i], values[n - 1 - i] = values[n - 1 - i], values[i]


data = sys.stdin.read().split()
n = int(data[0])
a = [int(x) for x in data[1:1 + n]]
reverse_in_place(a)
print(*a)
