import sys

data = sys.stdin.read().split()
n = int(data[0])
values = [int(x) for x in data[1:1 + n]]
# skriv ut minsta och största, utan att använda min() och max()
