import sys


def reverse_in_place(values):
    # vänd listan på plats med två index, utan reverse() eller [::-1]
    pass


data = sys.stdin.read().split()
n = int(data[0])
a = [int(x) for x in data[1:1 + n]]
reverse_in_place(a)
print(*a)
