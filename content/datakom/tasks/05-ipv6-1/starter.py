def expand(addr):
    """Returnerar en lista med 8 heltal (0..65535)."""
    # TODO: dela vid "::" och fyll på med nollgrupper så att det blir 8 grupper
    return [int(g, 16) for g in addr.split(":") if g]

def long_form(groups):
    return ":".join(f"{g:04x}" for g in groups)

def short_form(groups):
    # TODO: ta bort ledande nollor och ersätt den längsta serien (minst två) nollgrupper med "::"
    return ":".join(f"{g:x}" for g in groups)


for _ in range(int(input())):
    groups = expand(input().strip())
    print(long_form(groups))
    print(short_form(groups))
