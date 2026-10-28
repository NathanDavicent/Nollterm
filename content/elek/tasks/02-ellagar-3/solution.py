u, r = (float(x) for x in input().split())
i = u / r   # Ohms lag: U = R * I
p = u * i   # effekt: P = U * I
print(f"I = {i:.3f} A")
print(f"P = {p:.2f} W")
