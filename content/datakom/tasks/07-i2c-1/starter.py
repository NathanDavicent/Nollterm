for _ in range(int(input())):
    addr_text, rw = input().split()
    addr = int(addr_text, 16)
    if addr < 0x08 or addr > 0x77:
        print(f"0x{addr:02X}: reserverad adress")
        continue
    byte = 0   # TODO: 7-bitarsadressen flyttad ett steg vänster, sista biten 1 för R och 0 för W
    print(f"0x{addr:02X} {rw} -> 0x{byte:02X} ({byte:08b})")
