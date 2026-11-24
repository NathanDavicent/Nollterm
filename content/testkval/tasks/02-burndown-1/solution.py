total, days = (int(x) for x in input().split())
done = [int(x) for x in input().split()]

left = total
for day in range(1, days + 1):
    left -= done[day - 1]
    ideal = total - total * day / days        # rak linje från total till 0
    note = " (efter)" if left > ideal else ""
    print(f"Dag {day}: kvar {left}, ideal {ideal:.1f}{note}")
if left == 0:
    print("Sprintmålet nått")
else:
    print(f"Kvar vid sprintslut: {left} p")
