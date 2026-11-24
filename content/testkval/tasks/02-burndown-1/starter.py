total, days = (int(x) for x in input().split())
done = [int(x) for x in input().split()]

left = total
for day in range(1, days + 1):
    left -= done[day - 1]
    ideal = 0.0     # TODO: den ideala linjen går rakt från total till 0
    note = ""       # TODO: " (efter)" om det är mer kvar än den ideala linjen
    print(f"Dag {day}: kvar {left}, ideal {ideal:.1f}{note}")
# TODO: "Sprintmålet nått" om inget är kvar, annars "Kvar vid sprintslut: X p"
