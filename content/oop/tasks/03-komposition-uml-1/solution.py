import sys


class Position:
    def __init__(self, x=0.0, y=0.0):
        self.x = x
        self.y = y


class Robot:
    def __init__(self, name):
        self._name = name
        self._pos = Position()       # Robot HAR EN Position

    def move(self, dx, dy):
        self._pos.x += dx
        self._pos.y += dy

    def print_status(self):
        print(f"{self._name} at ({self._pos.x:g}, {self._pos.y:g})")


data = sys.stdin.read().split()
r = Robot(data[0])
nums = [float(v) for v in data[1:]]
for i in range(0, len(nums) - 1, 2):
    r.move(nums[i], nums[i + 1])
r.print_status()
