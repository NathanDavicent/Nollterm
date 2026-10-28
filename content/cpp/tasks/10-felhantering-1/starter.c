#include <stdio.h>

float average(int arr[], int n) {
    int sum;
    for (int i = 0; i <= n; i++)
        sum += arr[i];
    return sum / n;
}

int main(void) {
    int n;
    scanf("%d", &n);
    int a[100];
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    printf("%g\n", average(a, n));
    return 0;
}
