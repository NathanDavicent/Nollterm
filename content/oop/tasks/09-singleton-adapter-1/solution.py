import sys


class Config:
    _instance = None                 # klassvariabel, delas av alla

    def __init__(self):
        self.start_health = 100

    @classmethod
    def instance(cls):
        if cls._instance is None:    # skapas första gången (lazy)
            cls._instance = cls()
        return cls._instance


data = sys.stdin.read().split()
if data:
    Config.instance().start_health = int(data[0])
a = Config.instance()
b = Config.instance()
print(a.start_health, "samma" if a is b else "olika")
