#include <iostream>
#include <vector>
using namespace std;

void printArr(const vector<int>& arr) {
    for (size_t i = 0; i < arr.size(); i++) cout << arr[i] << (i + 1 < arr.size() ? " " : "\n");
}

void insertionSort(vector<int>& arr) {
    for (int i = 1; i < (int)arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        // Flytta större element i den sorterade delen ett steg åt höger.
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
        printArr(arr);
    }
}

int main() {
    int n;
    cin >> n;
    vector<int> arr(n);
    for (int& v : arr) cin >> v;
    insertionSort(arr);
    return 0;
}
