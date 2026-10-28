#include <stdio.h>

// a och b är två fibonaccital i rad, n är hur många steg som är kvar.
long long fibSub(long long a, long long b, int n) {
    if (n == 0) return a;               // basfall: inga steg kvar
    return fibSub(b, a + b, n - 1);     // ta ett steg framåt i följden
}

long long goodFib(int n) {
    return fibSub(0, 1, n);
}

int main(void) {
    int n;
    scanf("%d", &n);
    printf("%lld\n", goodFib(n));
    return 0;
}
