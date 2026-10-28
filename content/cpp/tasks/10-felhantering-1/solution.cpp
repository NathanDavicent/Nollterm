#include <iostream>
using namespace std;

float average(int arr[], int n) {
    if (n <= 0) return 0;
    int sum = 0;
    for (int i = 0; i < n; i++)
        sum += arr[i];
    return (float)sum / n;
}

int main() {
    int n;
    cin >> n;
    int a[100];
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << average(a, n) << endl;
    return 0;
}
