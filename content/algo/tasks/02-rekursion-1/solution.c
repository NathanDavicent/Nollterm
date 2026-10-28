#include <stdio.h>

int sum(int n) {
    printf("sum(%d) anropas\n", n);
    int result;
    if (n <= 1) {
        result = n;                 // basfall: sum(1) = 1 och sum(0) = 0
    } else {
        result = n + sum(n - 1);    // rekursivt anrop med ett mindre problem
    }
    printf("sum(%d) returnerar %d\n", n, result);
    return result;
}

int main(void) {
    int n;
    scanf("%d", &n);
    sum(n);
    return 0;
}
