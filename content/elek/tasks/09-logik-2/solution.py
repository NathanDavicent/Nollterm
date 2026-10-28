grind = input().strip()

def grindvarde(grind, a, b):
    if grind == "AND":
        return a & b
    if grind == "OR":
        return a | b
    if grind == "XOR":
        return a ^ b
    if grind == "NAND":
        return 1 - (a & b)   # NOT AND
    if grind == "NOR":
        return 1 - (a | b)   # NOT OR
    return 0

print("A B Q")
for a in (0, 1):
    for b in (0, 1):
        print(a, b, grindvarde(grind, a, b))
