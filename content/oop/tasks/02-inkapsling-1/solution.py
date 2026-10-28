import sys


class Lamp:
    def __init__(self):
        self._brightness = 0

    @property                        # läses som lamp.brightness
    def brightness(self):
        return self._brightness

    def set_brightness(self, b):
        self._brightness = max(0, min(100, b))   # invariant: 0–100


lamp = Lamp()
for v in sys.stdin.read().split():
    lamp.set_brightness(int(v))
    print(lamp.brightness)
