#include <iostream>
#include <vector>
using namespace std;

void printArr(const vector<int>& arr) {
    for (size_t i = 0; i < arr.size(); i++) cout << arr[i] << (i + 1 < arr.size() ? " " : "\n");
}

void insertionSort(vector<int>& arr) {
    // TODO: för i = 1 .. size-1, flytta arr[i] bakåt till rätt plats
    //       och skriv ut vektorn efter varje varv med printArr
}

int main() {
    int n;
    cin >> n;
    vector<int> arr(n);
    for (int& v : arr) cin >> v;
    insertionSort(arr);
    return 0;
}
