def is_prime(n):
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d += 1
    return True


n = int(input())
print("primtal" if is_prime(n) else "inte primtal")
