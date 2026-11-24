for _ in range(int(input())):
    lo, hi = (int(x) for x in input().split())
    print(f"Intervall {lo}..{hi}")
    # De flesta buggar sitter vid gränserna, så vi testar strax under, på och strax över.
    for v in [lo - 1, lo, lo + 1, hi - 1, hi, hi + 1]:
        status = "giltig" if lo <= v <= hi else "ogiltig"
        print(f"  {v}: {status}")
