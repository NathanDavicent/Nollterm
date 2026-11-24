#include <iostream>
#include <set>
#include <string>
using namespace std;

const set<int> FIB = {1, 2, 3, 5, 8};

int main() {
    int k, sum = 0;
    cin >> k;
    for (int i = 0; i < k; i++) { int v; cin >> v; sum += v; }
    int velocity = sum / k;   // heltalsdivision avrundar nedåt
    cout << "Velocity: " << velocity << "\n";

    int n, planned = 0;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string story;
        int points;
        cin >> story >> points;
        cout << story << ": ";
        if (points >= 13) cout << "för stor, bryt ner";
        else if (!FIB.count(points)) cout << "ogiltig estimering";
        else if (planned + points <= velocity) { planned += points; cout << "med"; }
        else cout << "får inte plats";
        cout << " (" << points << " p)\n";
    }
    cout << "Planerat " << planned << " av " << velocity << " p\n";
}
