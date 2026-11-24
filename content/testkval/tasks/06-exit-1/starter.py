target, coverage = (int(x) for x in input().split())
not_run, blockers, majors = [], [], []
for _ in range(int(input())):
    tid, result, severity = input().split()
    # TODO: samla testfall som inte körts (Skip), och Fail-test med severity Blocker eller Major

def show(ids):
    return f" ({', '.join(ids)})" if ids else ""

all_run = True        # TODO
cov_ok = True         # TODO
print(f"Alla testfall körda: {'ja' if all_run else 'nej'}{show(not_run)}")
print(f"Öppna blockers: {len(blockers)}{show(blockers)}")
print(f"Öppna major: {len(majors)}{show(majors)}")
print(f"Kodtäckning: {coverage} % (mål {target} %): {'ja' if cov_ok else 'nej'}")
print("Release: ja")  # TODO: ja bara om alla körda, inga blockers och täckningen nådd
