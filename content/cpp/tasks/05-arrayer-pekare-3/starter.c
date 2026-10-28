#include <stdio.h>

int countEven(int* a, int n) {

}

int main(void) {
    int n;
    scanf("%d", &n);
    int a[100];
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    printf("%d\n", countEven(a, n));
    return 0;
}
