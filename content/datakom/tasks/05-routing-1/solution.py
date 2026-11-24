def to_int(text):
    a, b, c, d = (int(x) for x in text.split("."))
    return (a << 24) | (b << 16) | (c << 8) | d

def mask_of(prefix):
    return (0xFFFFFFFF << (32 - prefix)) & 0xFFFFFFFF


routes = []   # (nätverk, prefix, next hop, texten)
for _ in range(int(input())):
    net, hop = input().split()
    addr, prefix = net.split("/")
    routes.append((to_int(addr), int(prefix), hop, net))

for _ in range(int(input())):
    dest_text = input().strip()
    dest = to_int(dest_text)
    best = None
    for route in routes:
        network, prefix = route[0], route[1]
        if dest & mask_of(prefix) == network:           # adressen ligger i det här nätet
            if best is None or prefix > best[1]:          # längre prefix = mer specifik route
                best = route
    if best is None:
        print(f"{dest_text} -> droppas")
    else:
        print(f"{dest_text} -> {best[2]} (via {best[3]})")
