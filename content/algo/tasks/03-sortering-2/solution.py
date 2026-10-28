def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        # Flytta större element i den sorterade delen ett steg åt höger.
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
        print(*arr)


n = int(input())
insertion_sort([int(v) for v in input().split()])
