import sys


class Config:
    # Singleton: instance() ska alltid ge samma objekt, start_health börjar på 100
    pass


data = sys.stdin.read().split()
if data:
    Config.instance().start_health = int(data[0])
a = Config.instance()
b = Config.instance()
print(a.start_health, "samma" if a is b else "olika")
