def bit_set(reg, bit):
    return reg      # TODO

def bit_clear(reg, bit):
    return reg      # TODO (tänk på att resultatet ska rymmas i 8 bitar)

def bit_flip(reg, bit):
    return reg      # TODO

def bit_check(reg, bit):
    return False    # TODO


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
