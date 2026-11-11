ddr = {"B": 0, "C": 0, "D": 0}   # låtsasregister

for _ in range(int(input())):
    pin = input().strip()
    if pin.startswith("A"):          # A0-A5: port C
        port, bit = "C", int(pin[1:])
    elif int(pin) < 8:               # digital 0-7: port D
        port, bit = "D", int(pin)
    else:                            # digital 8-13: port B, bit 0-5
        port, bit = "B", int(pin) - 8
    ddr[port] |= 1 << bit            # 1 i DDR = utgång
    print(f"{pin} -> P{port}{bit}")

for name in "BCD":
    print(f"DDR{name} = 0b{ddr[name]:08b}")
