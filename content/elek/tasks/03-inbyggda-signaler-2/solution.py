procent = int(input())
# 8 bitars PWM: 0 = alltid av, 255 = alltid på. +50 gör att heltalsdivisionen avrundar.
varde = (procent * 255 + 50) // 100
print(f"analogWrite: {varde}")
