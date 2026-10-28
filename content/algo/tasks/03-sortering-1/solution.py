def bubble_sort(arr):
    """Sortera arr på plats och returnera antalet byten."""
    swaps = 0
    for i in range(len(arr)):
        swapped = False
        # Efter varje varv ligger det största kvarvarande elementet sist, så vi går ett steg kortare.
        for j in range(len(arr) - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swaps += 1
                swapped = True
        if not swapped:
            break   # inga byten: redan sorterad
    return swaps


n = int(input())
arr = [int(v) for v in input().split()]
swaps = bubble_sort(arr)
print(*arr)
print(f"Byten: {swaps}")
