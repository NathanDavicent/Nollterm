def bubble_sort(arr):
    """Sortera arr på plats och returnera antalet byten."""
    swaps = 0
    # TODO (använd inte sort())
    return swaps


n = int(input())
arr = [int(v) for v in input().split()]
swaps = bubble_sort(arr)
print(*arr)
print(f"Byten: {swaps}")
