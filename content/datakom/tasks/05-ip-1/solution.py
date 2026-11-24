def to_int(text):
    a, b, c, d = (int(x) for x in text.split("."))
    return (a << 24) | (b << 16) | (c << 8) | d

def to_text(ip):
    return f"{ip >> 24 & 255}.{ip >> 16 & 255}.{ip >> 8 & 255}.{ip & 255}"


addr, prefix = input().strip().split("/")
prefix = int(prefix)
ip = to_int(addr)

mask = (0xFFFFFFFF << (32 - prefix)) & 0xFFFFFFFF   # Python-heltal växer, så maska till 32 bitar
network = ip & mask                                   # nätverksdelen
broadcast = network | (~mask & 0xFFFFFFFF)            # alla värdbitar satta

print(f"Nätverk: {to_text(network)}/{prefix}")
print(f"Mask: {to_text(mask)}")
print(f"Broadcast: {to_text(broadcast)}")
print(f"Första värd: {to_text(network + 1)}")
print(f"Sista värd: {to_text(broadcast - 1)}")
print(f"Antal värdar: {2 ** (32 - prefix) - 2}")
