groups = {}     # typ -> lista av (vridmoment, fel)
for _ in range(int(input())):
    t, torque, failure = input().split()
    groups.setdefault(t, []).append((float(torque), int(failure)))

# TODO: för varje typ i bokstavsordning: antal, antal fel, felandel och medelvridmoment
for t, rows in groups.items():
    print(f"{t}: {len(rows)} observationer")
