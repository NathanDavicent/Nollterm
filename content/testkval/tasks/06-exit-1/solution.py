target, coverage = (int(x) for x in input().split())
not_run, blockers, majors = [], [], []
for _ in range(int(input())):
    tid, result, severity = input().split()
    if result == "Skip":
        not_run.append(tid)
    elif result == "Fail" and severity == "Blocker":
        blockers.append(tid)          # P1: stoppar releasen
    elif result == "Fail" and severity == "Major":
        majors.append(tid)            # P2: ska fixas, men stoppar inte automatiskt

def show(ids):
    return f" ({', '.join(ids)})" if ids else ""

all_run = not not_run
cov_ok = coverage >= target
print(f"Alla testfall körda: {'ja' if all_run else 'nej'}{show(not_run)}")
print(f"Öppna blockers: {len(blockers)}{show(blockers)}")
print(f"Öppna major: {len(majors)}{show(majors)}")
print(f"Kodtäckning: {coverage} % (mål {target} %): {'ja' if cov_ok else 'nej'}")
print("Release: " + ("ja" if all_run and not blockers and cov_ok else "nej"))
