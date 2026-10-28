import sys


class Lamp:
    pass


lamp = Lamp()
for v in sys.stdin.read().split():
    lamp.set_brightness(int(v))
    print(lamp.brightness)
