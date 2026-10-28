#include <iostream>
#include <vector>
using namespace std;

// Returnera index för x i den sorterade vektorn, eller -1.
// Öka steg med 1 varje gång du jämför med ett mittelement.
int binarySearch(const vector<int>& arr, int x, int& steg) {
    int lo = 0, hi = (int)arr.size() - 1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        steg++;
        if (arr[mid] == x) return mid;
        if (arr[mid] < x) lo = mid + 1;   // x kan bara finnas till höger
        else hi = mid - 1;                // x kan bara finnas till vänster
    }
    return -1;
}

int main() {
    int n;
    cin >> n;
    vector<int> arr(n);
    for (int& v : arr) cin >> v;
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int x, steg = 0;
        cin >> x;
        int idx = binarySearch(arr, x, steg);
        cout << x << ": " << idx << " (" << steg << " steg)" << endl;
    }
    return 0;
}
