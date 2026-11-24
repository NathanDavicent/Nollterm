for _ in range(int(input())):
    addr_text, rw = input().split()
    addr = int(addr_text, 16)
    if addr < 0x08 or addr > 0x77:          # 0x00-0x07 och 0x78-0x7F är reserverade
        print(f"0x{addr:02X}: reserverad adress")
        continue
    byte = (addr << 1) | (1 if rw == "R" else 0)   # adressen i bit 7-1, R/W i bit 0
    print(f"0x{addr:02X} {rw} -> 0x{byte:02X} ({byte:08b})")
