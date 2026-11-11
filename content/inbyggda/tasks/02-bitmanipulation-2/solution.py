a, b = (int(x) for x in input().split())

def row(label, value):
    print(f"{label} = {value:08b} ({value})")

# Python-heltal är obegränsade, så & 0xFF behövs för att låtsas att det är ett 8-bitars register.
row("a & b", a & b)
row("a | b", a | b)
row("a ^ b", a ^ b)
row("~a", ~a & 0xFF)          # ~204 är -205 i Python, maskat blir det 51
row("a << 2", (a << 2) & 0xFF)
row("a >> 1", a >> 1)
