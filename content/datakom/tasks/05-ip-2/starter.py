def to_int(text):
    a, b, c, d = (int(x) for x in text.split("."))
    return (a << 24) | (b << 16) | (c << 8) | d

def to_text(ip):
    return f"{ip >> 24 & 255}.{ip >> 16 & 255}.{ip >> 8 & 255}.{ip & 255}"


net, new_prefix = input().split()
addr, prefix = net.split("/")
prefix, new_prefix = int(prefix), int(new_prefix)
start = to_int(addr)

count = 0   # TODO: hur många subnät blir det? (2 upphöjt till antalet lånade bitar)
size = 0    # TODO: hur många adresser har varje subnät?
print(f"{count} subnät med {size - 2} värdar var")
for i in range(count):
    first = start + i * size
    # TODO: skriv "<nät>/<nytt prefix>: värdar <första> - <sista>, broadcast <broadcast>"
