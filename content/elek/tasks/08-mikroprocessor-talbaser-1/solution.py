n = int(input())
if n == 0:
    print(0)
else:
    bitar = ""
    # Dela med 2 upprepade gånger. Resterna är bitarna, minst signifikant först.
    while n > 0:
        bitar = str(n % 2) + bitar
        n //= 2
    print(bitar)
