risks = []
for _ in range(int(input())):
    name, p, i, d = input().split()
    risks.append((name, int(p), int(i), int(d)))

# TODO: räkna RPN = P x I x D och sortera med högst RPN först (lika: behåll ordningen)
for rank, (name, p, i, d) in enumerate(risks, 1):
    rpn = 0
    print(f"{rank}. {name}: {p} x {i} x {d} = {rpn}")
print("Testa först: " + ", ".join(r[0] for r in risks[:3]))
