risks = []
for _ in range(int(input())):
    name, p, i, d = input().split()
    risks.append((name, int(p), int(i), int(d)))

# sorted är stabil, så risker med samma RPN behåller sin ordning
risks = sorted(risks, key=lambda r: r[1] * r[2] * r[3], reverse=True)
for rank, (name, p, i, d) in enumerate(risks, 1):
    rpn = p * i * d
    print(f"{rank}. {name}: {p} x {i} x {d} = {rpn}")
print("Testa först: " + ", ".join(r[0] for r in risks[:3]))
