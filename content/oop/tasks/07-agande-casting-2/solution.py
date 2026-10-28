import sys


class Device:
    def tick(self):
        pass


class TempSensor(Device):
    pass


class LedActuator(Device):
    pass


def count_leds(devices):
    return sum(1 for d in devices if isinstance(d, LedActuator))


devices = [LedActuator() if k == "led" else TempSensor() for k in sys.stdin.read().split()]
print(count_leds(devices))
