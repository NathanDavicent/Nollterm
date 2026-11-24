for _ in range(int(input())):
    lo, hi = (int(x) for x in input().split())
    print(f"Intervall {lo}..{hi}")
    # TODO: testa lo-1, lo, lo+1, hi-1, hi och hi+1 och skriv om värdet är giltigt
    for v in [lo, hi]:
        print(f"  {v}: giltig")
