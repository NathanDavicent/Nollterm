#include <iostream>
#include <set>
#include <string>
using namespace std;

const set<int> FIB = {1, 2, 3, 5, 8};

int main() {
    int k, sum = 0;
    cin >> k;
    for (int i = 0; i < k; i++) { int v; cin >> v; sum += v; }
    int velocity = 0;   // TODO: medelvärdet, avrundat nedåt
    cout << "Velocity: " << velocity << "\n";

    int n, planned = 0;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string story;
        int points;
        cin >> story >> points;
        // TODO: "för stor, bryt ner", "ogiltig estimering", "med" eller "får inte plats"
        cout << story << ": med (" << points << " p)\n";
    }
    cout << "Planerat " << planned << " av " << velocity << " p\n";
}
