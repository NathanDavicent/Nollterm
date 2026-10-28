#include <iostream>
#include <vector>
using namespace std;

// Bubbelsortera arr och returnera hur många byten som gjordes.
int bubbleSort(vector<int>& arr) {
    int swaps = 0;
    // TODO
    return swaps;
}

int main() {
    int n;
    cin >> n;
    vector<int> arr(n);
    for (int& v : arr) cin >> v;
    int swaps = bubbleSort(arr);
    for (int i = 0; i < n; i++) cout << arr[i] << (i + 1 < n ? " " : "\n");
    cout << "Byten: " << swaps << endl;
    return 0;
}
