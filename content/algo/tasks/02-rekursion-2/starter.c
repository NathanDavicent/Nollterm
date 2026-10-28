#include <stdio.h>

// a och b är två fibonaccital i rad, n är hur många steg som är kvar.
long long fibSub(long long a, long long b, int n) {
    // TODO: rekursiv, ett anrop per steg
    return 0;
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
