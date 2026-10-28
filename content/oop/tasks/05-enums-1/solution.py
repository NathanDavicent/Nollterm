from enum import Enum


class Direction(Enum):
    NORTH = 0
    EAST = 1
    SOUTH = 2
    WEST = 3


def to_string(d):
    match d:                         # Pythons motsvarighet till switch (3.10+)
        case Direction.NORTH:
            return "norr"
        case Direction.EAST:
            return "öster"
        case Direction.SOUTH:
            return "söder"
        case Direction.WEST:
            return "väster"


print(to_string(Direction(int(input()))))
