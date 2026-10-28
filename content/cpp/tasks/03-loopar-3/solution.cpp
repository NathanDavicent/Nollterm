#include <iostream>
using namespace std;

int main() {
    int n, x;
    cin >> n >> x;
    int minV = x, maxV = x;          // starta med första värdet, inte 0
    for (int i = 1; i < n; i++) {
        cin >> x;
        if (x < minV) minV = x;
        if (x > maxV) maxV = x;
    }
    cout << minV << " " << maxV << endl;
    return 0;
}
