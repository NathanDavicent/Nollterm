ddr = {"B": 0, "C": 0, "D": 0}   # låtsasregister

for _ in range(int(input())):
    pin = input().strip()
    port, bit = "?", 0
    # TODO: "0"-"7" -> port D, "8"-"13" -> port B (bit = pin - 8), "A0"-"A5" -> port C.
    #       Sätt rätt bit i rätt DDR-register så att pinnen blir en utgång.
    print(f"{pin} -> P{port}{bit}")

for name in "BCD":
    print(f"DDR{name} = 0b{ddr[name]:08b}")
