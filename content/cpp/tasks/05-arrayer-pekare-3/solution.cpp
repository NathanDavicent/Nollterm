#include <iostream>
using namespace std;

int countEven(int* a, int n) {
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (a[i] % 2 == 0) count++;
    }
    return count;
}

int main() {
    int n;
    cin >> n;
    int a[100];
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << countEven(a, n) << endl;
    return 0;
}
