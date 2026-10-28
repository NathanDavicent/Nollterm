def fib_sub(a, b, n):
    """a och b är två fibonaccital i rad, n är hur många steg som är kvar."""
    if n == 0:
        return a                      # basfall: inga steg kvar
    return fib_sub(b, a + b, n - 1)   # ta ett steg framåt i följden


def good_fib(n):
    return fib_sub(0, 1, n)


print(good_fib(int(input())))
