def bit_set(reg, bit):
    return reg | (1 << bit)              # OR med 1 tänder biten

def bit_clear(reg, bit):
    return reg & ~(1 << bit) & 0xFF      # AND med 0 släcker, & 0xFF håller det till 8 bitar

def bit_flip(reg, bit):
    return reg ^ (1 << bit)              # XOR med 1 flippar biten

def bit_check(reg, bit):
    return (reg >> bit) & 1 == 1


reg = int(input())
for _ in range(int(input())):
    cmd, bit = input().split()
    bit = int(bit)
    if cmd == "set": reg = bit_set(reg, bit)
    elif cmd == "clear": reg = bit_clear(reg, bit)
    elif cmd == "toggle": reg = bit_flip(reg, bit)
    if cmd == "check":
        print(f"check {bit}: {1 if bit_check(reg, bit) else 0}")
    else:
        print(f"{cmd} {bit}: {reg:08b}")
