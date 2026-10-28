class Counter:
    def __init__(self):
        self._count = 0          # _ betyder "privat" enligt konvention

    def increment(self):
        self._count += 1

    def value(self):
        return self._count


n = int(input())
c = Counter()
for _ in range(n):
    c.increment()
print(c.value())
