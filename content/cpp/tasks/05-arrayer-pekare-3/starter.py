import sys


def count_even(values):
    pass


data = sys.stdin.read().split()
n = int(data[0])
print(count_even([int(x) for x in data[1:1 + n]]))
