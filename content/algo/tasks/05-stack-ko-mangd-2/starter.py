def read_values():
    input()   # antalet
    return [int(v) for v in input().split()]


a = read_values()
b = read_values()
# TODO: räkna ut union, snitt och differens (a minus b) utan dubbletter.
#       Gör det själv med loopar, eller med Pythons set när du förstått idén.
union, snitt, diff = [], [], []
print("Union:", *sorted(union))
print("Snitt:", *sorted(snitt))
print("Differens:", *sorted(diff))
