#include <stdio.h>

void printArr(const int* arr, int size) {
    for (int i = 0; i < size; i++) printf("%d%s", arr[i], i + 1 < size ? " " : "\n");
}

void insertionSort(int* arr, int size) {
    for (int i = 1; i < size; i++) {
        int key = arr[i];
        int j = i - 1;
        // Flytta större element i den sorterade delen ett steg åt höger.
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
        printArr(arr, size);
    }
}

int main(void) {
    int n;
    scanf("%d", &n);
    int arr[1000];
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    insertionSort(arr, n);
    return 0;
}
