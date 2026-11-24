def expand(addr):
    """Returnerar en lista med 8 heltal (0..65535)."""
    if "::" in addr:
        head, tail = addr.split("::")
        left = [int(g, 16) for g in head.split(":") if g]
        right = [int(g, 16) for g in tail.split(":") if g]
        return left + [0] * (8 - len(left) - len(right)) + right   # "::" fyller ut till 8 grupper
    return [int(g, 16) for g in addr.split(":")]

def long_form(groups):
    return ":".join(f"{g:04x}" for g in groups)

def short_form(groups):
    # Hitta den längsta serien nollgrupper. Vid lika långa vinner den vänstra.
    best_start, best_len = -1, 0
    i = 0
    while i < 8:
        if groups[i] == 0:
            j = i
            while j < 8 and groups[j] == 0:
                j += 1
            if j - i > best_len:
                best_start, best_len = i, j - i
            i = j
        else:
            i += 1
    parts = [f"{g:x}" for g in groups]          # :x tar bort ledande nollor
    if best_len < 2:                             # en ensam nollgrupp förkortas inte (RFC 5952)
        return ":".join(parts)
    left = ":".join(parts[:best_start])
    right = ":".join(parts[best_start + best_len:])
    return left + "::" + right


for _ in range(int(input())):
    groups = expand(input().strip())
    print(long_form(groups))
    print(short_form(groups))
