fmt = input().strip()      # 8N1, 8E1 eller 8O1
text = input().strip()
total = 0
for ch in text:
    value = ord(ch)
    data = ""              # TODO: de 8 databitarna, LSB först
    frame = f"0 {data} 1"  # TODO: lägg till paritetsbit före stoppbiten om fmt är 8E1 eller 8O1
    total += len(frame.replace(" ", ""))
    print(f"{ch} 0x{value:02X}: {frame}")
print(f"Totalt {total} bitar")
