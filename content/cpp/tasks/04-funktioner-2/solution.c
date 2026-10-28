#include <stdio.h>
#include <stdbool.h>

bool isPrime(int n) {
    if (n < 2) return false;
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) return false;
    }
    return true;
}

int main(void) {
    int n;
    scanf("%d", &n);
    if (isPrime(n)) printf("primtal\n");
    else printf("inte primtal\n");
    return 0;
}
