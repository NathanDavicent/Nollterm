def binary_search(arr, x):
    """Returnera (index, steg). index är -1 om x saknas.
    steg är antalet jämförelser med ett mittelement."""
    steg = 0
    # TODO: binärsökning
    return -1, steg


n = int(input())
arr = [int(v) for v in input().split()]
q = int(input())
for x in (int(v) for v in input().split()):
    idx, steg = binary_search(arr, x)
    print(f"{x}: {idx} ({steg} steg)")
