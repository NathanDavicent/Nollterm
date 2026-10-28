#include <iostream>
using namespace std;

// a och b är två fibonaccital i rad, n är hur många steg som är kvar.
long long fibSub(long long a, long long b, int n) {
    // TODO: rekursiv, ett anrop per steg
    return 0;
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
