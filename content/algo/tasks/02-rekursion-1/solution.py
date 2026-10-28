def summa(n):
    print(f"sum({n}) anropas")
    if n <= 1:
        result = n                  # basfall: sum(1) = 1 och sum(0) = 0
    else:
        result = n + summa(n - 1)   # rekursivt anrop med ett mindre problem
    print(f"sum({n}) returnerar {result}")
    return result


summa(int(input()))
