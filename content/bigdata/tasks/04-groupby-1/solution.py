groups = {}     # typ -> lista av (vridmoment, fel)
for _ in range(int(input())):
    t, torque, failure = input().split()
    groups.setdefault(t, []).append((float(torque), int(failure)))

for t in sorted(groups):                     # groupby sorterar nycklarna
    rows = groups[t]
    n = len(rows)
    failures = sum(f for _, f in rows)
    mean_torque = sum(m for m, _ in rows) / n
    print(f"{t}: {n} observationer, {failures} fel ({100 * failures / n:.2f} %), medelvridmoment {mean_torque:.2f} Nm")
