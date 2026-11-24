#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int k = 0; k < n; k++) {
        int lo, hi;
        cin >> lo >> hi;
        cout << "Intervall " << lo << ".." << hi << "\n";
        // TODO: testa lo-1, lo, lo+1, hi-1, hi och hi+1 och skriv om värdet är giltigt
        cout << "  " << lo << ": giltig\n";
        cout << "  " << hi << ": giltig\n";
    }
}
