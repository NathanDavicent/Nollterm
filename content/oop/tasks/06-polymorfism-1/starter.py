import sys
from abc import ABC, abstractmethod


class Shape(ABC):
    @abstractmethod
    def area(self):
        ...


# skriv Rect och Circle (pi = 3.14)


shapes = []
data = sys.stdin.read().split()
i = 0
while i < len(data):
    if data[i] == "rect":
        shapes.append(Rect(float(data[i + 1]), float(data[i + 2])))
        i += 3
    else:
        shapes.append(Circle(float(data[i + 1])))
        i += 2
print(f"{sum(s.area() for s in shapes):g}")
