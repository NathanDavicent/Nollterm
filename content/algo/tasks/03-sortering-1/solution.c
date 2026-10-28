#include <stdio.h>

void swap(int* a, int* b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

// Bubbelsortera arr och returnera hur många byten som gjordes.
int bubbleSort(int* arr, int size) {
    int swaps = 0;
    for (int i = 0; i < size; i++) {
        int swapped = 0;
        // Efter varje varv ligger det största kvarvarande elementet sist, så vi går ett steg kortare.
        for (int j = 0; j < size - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(&arr[j], &arr[j + 1]);
                swaps++;
                swapped = 1;
            }
        }
        if (!swapped) break;   // inga byten: redan sorterad
    }
    return swaps;
}

int main(void) {
    int n;
    scanf("%d", &n);
    int arr[1000];
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    int swaps = bubbleSort(arr, n);
    for (int i = 0; i < n; i++) printf("%d%s", arr[i], i + 1 < n ? " " : "\n");
    printf("Byten: %d\n", swaps);
    return 0;
}
