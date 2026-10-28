import sys


class Observer:
    def on_notify(self, value):
        raise NotImplementedError


class Sensor:
    def __init__(self):
        self._observers = []

    def add_observer(self, o):
        self._observers.append(o)

    def new_reading(self, v):
        for o in self._observers:
            o.on_notify(v)


class Alarm(Observer):
    def on_notify(self, value):
        if value > 30:
            print(f"LARM {value}")


class Counter(Observer):
    def __init__(self):
        self.count = 0

    def on_notify(self, value):
        self.count += 1


s = Sensor()
alarm = Alarm()
counter = Counter()
s.add_observer(alarm)
s.add_observer(counter)
for v in sys.stdin.read().split():
    s.new_reading(int(v))
print(f"{counter.count} notifieringar")
