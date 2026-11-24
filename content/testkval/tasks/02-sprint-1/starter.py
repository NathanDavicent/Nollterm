FIB = [1, 2, 3, 5, 8]          # 13 och uppåt är en epic som ska brytas ner

k = int(input())
history = [int(x) for x in input().split()]
velocity = 0                   # TODO: medelvärdet av historiken, avrundat nedåt
print(f"Velocity: {velocity}")

planned = 0
for _ in range(int(input())):
    story, points = input().split()
    points = int(points)
    # TODO: skriv "för stor, bryt ner", "ogiltig estimering", "med" eller "får inte plats"
    print(f"{story}: med ({points} p)")
print(f"Planerat {planned} av {velocity} p")
