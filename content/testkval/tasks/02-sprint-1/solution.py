FIB = [1, 2, 3, 5, 8]          # 13 och uppåt är en epic som ska brytas ner

k = int(input())
history = [int(x) for x in input().split()]
velocity = sum(history) // k   # historisk velocity = kapaciteten för nästa sprint
print(f"Velocity: {velocity}")

planned = 0
for _ in range(int(input())):
    story, points = input().split()
    points = int(points)
    if points >= 13:
        print(f"{story}: för stor, bryt ner ({points} p)")
    elif points not in FIB:
        print(f"{story}: ogiltig estimering ({points} p)")
    elif planned + points <= velocity:
        planned += points
        print(f"{story}: med ({points} p)")
    else:
        print(f"{story}: får inte plats ({points} p)")   # en mindre story längre ner kan få plats
print(f"Planerat {planned} av {velocity} p")
