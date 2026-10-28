#include <iostream>
using namespace std;

int square(int x) {
    return x * x;
}

int main() {
    int n;
    cin >> n;
    cout << square(n) << endl;
    return 0;
}
