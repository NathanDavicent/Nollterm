def binary_search(arr, x):
    """Returnera (index, steg). index är -1 om x saknas.
    steg är antalet jämförelser med ett mittelement."""
    lo, hi, steg = 0, len(arr) - 1, 0
    while lo <= hi:
        mid = (lo + hi) // 2
        steg += 1
        if arr[mid] == x:
            return mid, steg
        if arr[mid] < x:
            lo = mid + 1   # x kan bara finnas till höger
        else:
            hi = mid - 1   # x kan bara finnas till vänster
    return -1, steg


n = int(input())
arr = [int(v) for v in input().split()]
q = int(input())
for x in (int(v) for v in input().split()):
    idx, steg = binary_search(arr, x)
    print(f"{x}: {idx} ({steg} steg)")
