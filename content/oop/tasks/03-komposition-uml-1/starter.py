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
        pass

    def print_status(self):
        pass


data = sys.stdin.read().split()
r = Robot(data[0])
nums = [float(v) for v in data[1:]]
for i in range(0, len(nums) - 1, 2):
    r.move(nums[i], nums[i + 1])
r.print_status()
