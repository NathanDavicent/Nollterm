uin, r1, r2 = (float(x) for x in input().split())
# Samma ström går genom båda, så spänningen delas i proportion till resistansen.
uut = uin * r2 / (r1 + r2)
print(f"Uut = {uut:.2f} V")
