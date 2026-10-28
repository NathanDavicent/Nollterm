class Position:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def move(self, dx, dy):
        self.x += dx
        self.y += dy

    def print(self):
        print(f"Position(x={self.x:g}, y={self.y:g})")


x, y, dx, dy = map(float, input().split())
p = Position(x, y)
p.move(dx, dy)
p.print()
