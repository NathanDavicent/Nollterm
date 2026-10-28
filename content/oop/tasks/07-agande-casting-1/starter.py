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


def make_effect(name):
    # returnera Slow() eller Burn(), annars None
    pass


for name in sys.stdin.read().split():
    e = make_effect(name)
    if e:
        e.apply()
    else:
        print("okänd")
