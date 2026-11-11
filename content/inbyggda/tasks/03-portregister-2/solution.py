RED_S, YELLOW_S, GREEN_S = 5, 2, 5
CYCLE_S = RED_S + YELLOW_S + GREEN_S + YELLOW_S   # 14 s


def light_at(t):
    """Cykeln: röd 5 s, gul 2 s, grön 5 s, gul 2 s, sedan om från början."""
    p = t % CYCLE_S                               # var i cykeln vi är
    if p < RED_S:
        return "RÖD"
    if p < RED_S + YELLOW_S:
        return "GUL"
    if p < RED_S + YELLOW_S + GREEN_S:
        return "GRÖN"
    return "GUL"


input()
for t in (int(x) for x in input().split()):
    print(f"t={t}: {light_at(t)}")
