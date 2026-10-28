class Position:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def move(self, dx, dy):
        pass

    def print(self):
        # skriv Position(x=…, y=…) med :g-format
        pass


x, y, dx, dy = map(float, input().split())
p = Position(x, y)
p.move(dx, dy)
p.print()
