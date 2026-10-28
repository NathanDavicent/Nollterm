#include <stdio.h>

void printArr(const int* arr, int size) {
    for (int i = 0; i < size; i++) printf("%d%s", arr[i], i + 1 < size ? " " : "\n");
}

void insertionSort(int* arr, int size) {
    // TODO: för i = 1 .. size-1, flytta arr[i] bakåt till rätt plats
    //       och skriv ut arrayen efter varje varv med printArr
}

int main(void) {
    int n;
    scanf("%d", &n);
    int arr[1000];
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    insertionSort(arr, n);
    return 0;
}
