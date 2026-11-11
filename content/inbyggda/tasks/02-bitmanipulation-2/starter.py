a, b = (int(x) for x in input().split())

def row(label, value):
    print(f"{label} = {value:08b} ({value})")

# TODO: räkna ut rätt värden. Python-heltal har inga 8 bitar, så maska med & 0xFF där det behövs.
row("a & b", 0)
row("a | b", 0)
row("a ^ b", 0)
row("~a", 0)
row("a << 2", 0)
row("a >> 1", 0)
