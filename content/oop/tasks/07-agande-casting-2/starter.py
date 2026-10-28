import sys


class Device:
    def tick(self):
        pass


class TempSensor(Device):
    pass


class LedActuator(Device):
    pass


def count_leds(devices):
    # räkna LedActuator-objekt med isinstance (Pythons motsvarighet till dynamic_cast)
    pass


devices = [LedActuator() if k == "led" else TempSensor() for k in sys.stdin.read().split()]
print(count_leds(devices))
