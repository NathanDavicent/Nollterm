n = int(input())
normal = [float(x) for x in input().split()]
mean = sum(normal) / n
std = (sum((x - mean) ** 2 for x in normal) / (n - 1)) ** 0.5   # stickprov, som pandas .std()
print(f"Medel: {mean:.2f}, std: {std:.2f}")

m = int(input())
for value in (float(x) for x in input().split()):
    z = (value - mean) / std
    status = "LARM" if abs(z) > 3 else "normal"
    print(f"{value:g}: z = {z:.2f}, {status}")
