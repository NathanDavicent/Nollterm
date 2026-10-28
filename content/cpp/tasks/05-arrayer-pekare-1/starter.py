import sys


def total(values):
    # summera med en loop (utan inbyggda sum())
    pass


data = sys.stdin.read().split()
n = int(data[0])
print(total([int(x) for x in data[1:1 + n]]))
