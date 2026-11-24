def to_int(text):
    a, b, c, d = (int(x) for x in text.split("."))
    return (a << 24) | (b << 16) | (c << 8) | d

def to_text(ip):
    return f"{ip >> 24 & 255}.{ip >> 16 & 255}.{ip >> 8 & 255}.{ip & 255}"


net, new_prefix = input().split()
addr, prefix = net.split("/")
prefix, new_prefix = int(prefix), int(new_prefix)
start = to_int(addr)

count = 2 ** (new_prefix - prefix)   # varje lånad bit dubblar antalet subnät
size = 2 ** (32 - new_prefix)        # adresser per subnät
print(f"{count} subnät med {size - 2} värdar var")
for i in range(count):
    first = start + i * size
    last = first + size - 1           # broadcast är sista adressen
    print(f"{to_text(first)}/{new_prefix}: värdar {to_text(first + 1)} - {to_text(last - 1)}, broadcast {to_text(last)}")
