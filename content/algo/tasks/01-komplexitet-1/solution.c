#include <stdio.h>

// Returnera index för x i den sorterade arrayen, eller -1.
// Öka *steg med 1 varje gång du jämför med ett mittelement.
int binarySearch(const int* arr, int n, int x, int* steg) {
    int lo = 0, hi = n - 1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        (*steg)++;
        if (arr[mid] == x) return mid;
        if (arr[mid] < x) lo = mid + 1;   // x kan bara finnas till höger
        else hi = mid - 1;                // x kan bara finnas till vänster
    }
    return -1;
}

int main(void) {
    int n;
    scanf("%d", &n);
    int arr[4096];
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    int q;
    scanf("%d", &q);
    for (int i = 0; i < q; i++) {
        int x, steg = 0;
        scanf("%d", &x);
        int idx = binarySearch(arr, n, x, &steg);
        printf("%d: %d (%d steg)\n", x, idx, steg);
    }
    return 0;
}
