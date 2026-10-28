#include <iostream>
using namespace std;

int sum(int* arr, int size) {
    int total = 0;
    for (int i = 0; i < size; i++) {
        total += *(arr + i);
    }
    return total;
}

int main() {
    int n;
    cin >> n;
    int data[100];
    for (int i = 0; i < n; i++) cin >> data[i];
    cout << sum(data, n) << endl;
    return 0;
}
