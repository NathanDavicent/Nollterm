n = int(input())
siffror = "0123456789ABCDEF"
hexstr = ""
# Samma idé som binärt, men vi delar med 16. Rest 10-15 blir A-F.
while True:
    hexstr = siffror[n % 16] + hexstr
    n //= 16
    if n == 0:
        break
print("0x" + hexstr)
