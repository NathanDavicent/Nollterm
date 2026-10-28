from enum import Enum


class Direction(Enum):
    NORTH = 0
    EAST = 1
    SOUTH = 2
    WEST = 3


def to_string(d):
    pass


print(to_string(Direction(int(input()))))
