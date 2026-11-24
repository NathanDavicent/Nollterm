n = int(input())
normal = [float(x) for x in input().split()]
mean = 0.0     # TODO: medelvärdet av normal drift
std = 0.0      # TODO: stickprovsstandardavvikelse (dela med n - 1, som pandas .std())
print(f"Medel: {mean:.2f}, std: {std:.2f}")

m = int(input())
for value in (float(x) for x in input().split()):
    z = 0.0    # TODO: hur många standardavvikelser från medel
    status = "normal"   # TODO: "LARM" om |z| > 3
    print(f"{value:g}: z = {z:.2f}, {status}")
