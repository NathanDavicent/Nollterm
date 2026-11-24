fmt = input().strip()      # 8N1, 8E1 eller 8O1
text = input().strip()
total = 0
for ch in text:
    value = ord(ch)
    data = "".join(str((value >> i) & 1) for i in range(8))   # LSB först
    ones = data.count("1")
    if fmt[1] == "E":
        frame = f"0 {data} {ones % 2} 1"          # jämn: totala antalet ettor blir jämnt
    elif fmt[1] == "O":
        frame = f"0 {data} {1 - ones % 2} 1"      # udda: totala antalet ettor blir udda
    else:
        frame = f"0 {data} 1"                     # startbit 0, stoppbit 1
    total += len(frame.replace(" ", ""))
    print(f"{ch} 0x{value:02X}: {frame}")
print(f"Totalt {total} bitar")
