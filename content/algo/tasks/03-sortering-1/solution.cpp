#include <iostream>
#include <vector>
using namespace std;

// Bubbelsortera arr och returnera hur många byten som gjordes.
int bubbleSort(vector<int>& arr) {
    int swaps = 0;
    int size = (int)arr.size();
    for (int i = 0; i < size; i++) {
        bool swapped = false;
        // Efter varje varv ligger det största kvarvarande elementet sist, så vi går ett steg kortare.
        for (int j = 0; j < size - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
                swaps++;
                swapped = true;
            }
        }
        if (!swapped) break;   // inga byten: redan sorterad
    }
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
