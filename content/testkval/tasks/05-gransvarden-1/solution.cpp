#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int k = 0; k < n; k++) {
        int lo, hi;
        cin >> lo >> hi;
        cout << "Intervall " << lo << ".." << hi << "\n";
        for (int v : {lo - 1, lo, lo + 1, hi - 1, hi, hi + 1}) {   // strax under, på, strax över
            cout << "  " << v << ": " << (v >= lo && v <= hi ? "giltig" : "ogiltig") << "\n";
        }
    }
}
