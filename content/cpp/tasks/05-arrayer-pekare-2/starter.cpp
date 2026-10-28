#include <iostream>
using namespace std;

void reverseArray(int* arr, int size) {

}

int main() {
    int n;
    cin >> n;
    int a[100];
    for (int i = 0; i < n; i++) cin >> a[i];
    reverseArray(a, n);
    for (int i = 0; i < n; i++) {
        cout << a[i];
        if (i < n - 1) cout << " ";
    }
    cout << endl;
    return 0;
}
