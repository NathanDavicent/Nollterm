def fib_sub(a, b, n):
    """a och b är två fibonaccital i rad, n är hur många steg som är kvar."""
    # TODO: rekursiv, ett anrop per steg
    return 0


def good_fib(n):
    return fib_sub(0, 1, n)


print(good_fib(int(input())))
