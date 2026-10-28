#include <iostream>
using namespace std;

// a och b är två fibonaccital i rad, n är hur många steg som är kvar.
long long fibSub(long long a, long long b, int n) {
    if (n == 0) return a;               // basfall: inga steg kvar
    return fibSub(b, a + b, n - 1);     // ta ett steg framåt i följden
}

long long goodFib(int n) {
    return fibSub(0, 1, n);
}

int main() {
    int n;
    cin >> n;
    cout << goodFib(n) << endl;
    return 0;
}
