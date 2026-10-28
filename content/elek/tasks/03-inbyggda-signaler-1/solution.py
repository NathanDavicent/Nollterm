raw, bits, vref = input().split()
raw, bits, vref = int(raw), int(bits), float(vref)
steg = 2 ** bits   # 10 bitar ger 1024 steg
volt = raw * vref / steg
# Det högsta värdet (steg - 1) räknas som full referensspänning.
if raw == steg - 1:
    volt = vref
print(f"{volt:.2f} V")
