import sys


class Effect:
    def apply(self):
        raise NotImplementedError


class Slow(Effect):
    def apply(self):
        print("Slow")


class Burn(Effect):
    def apply(self):
        print("Burn")


EFFECTS = {"slow": Slow, "burn": Burn}      # tabell istället för if-kedja


def make_effect(name):
    cls = EFFECTS.get(name)
    return cls() if cls else None


for name in sys.stdin.read().split():
    e = make_effect(name)
    if e:
        e.apply()
    else:
        print("okänd")
