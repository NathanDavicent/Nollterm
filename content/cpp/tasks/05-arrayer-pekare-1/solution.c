#include <stdio.h>

int sum(int* arr, int size) {
    int total = 0;
    for (int i = 0; i < size; i++) {
        total += *(arr + i);
    }
    return total;
}

int main(void) {
    int n;
    scanf("%d", &n);
    int data[100];
    for (int i = 0; i < n; i++) scanf("%d", &data[i]);
    printf("%d\n", sum(data, n));
    return 0;
}
