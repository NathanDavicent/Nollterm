class Counter:
    # privat räknare som startar på 0, increment() och value()
    pass


n = int(input())
c = Counter()
for _ in range(n):
    c.increment()
print(c.value())
