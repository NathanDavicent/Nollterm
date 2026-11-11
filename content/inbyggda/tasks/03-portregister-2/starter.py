def light_at(t):
    """Cykeln: röd 5 s, gul 2 s, grön 5 s, gul 2 s, sedan om från början."""
    return "?"   # TODO


input()
for t in (int(x) for x in input().split()):
    print(f"t={t}: {light_at(t)}")
