#include <iomanip>
#include <iostream>
#include <set>
#include <sstream>
#include <string>
#include <vector>
using namespace std;

const string NAMES[] = {"air_temperature_k", "process_temperature_k", "rotational_speed_rpm",
                        "torque_nm", "tool_wear_min", "machine_failure"};

// Läser ett tal. Returnerar false om texten inte är ett tal.
bool toNumber(const string& text, double& out) {
    try {
        size_t used;
        out = stod(text, &used);
        return used == text.size();
    } catch (...) {
        return false;
    }
}

// Index för första kolumnen som inte klarar kontrollen, eller -1
int firstProblem(const vector<double>& v, const vector<bool>& ok) {
    if (!ok[0] || v[0] < 250 || v[0] > 350) return 0;
    if (!ok[1] || v[1] < 250 || v[1] > 400) return 1;
    if (!ok[2] || v[2] <= 0) return 2;
    if (!ok[3] || v[3] < 0) return 3;
    if (!ok[4] || v[4] < 0) return 4;
    if (!ok[5] || (v[5] != 0 && v[5] != 1)) return 5;
    return -1;
}

int main() {
    int n;
    cin >> n;
    int duplicates = 0, invalid = 0, clean = 0, failures = 0;
    set<string> seen;
    for (int i = 0; i < n; i++) {
        string line;
        cin >> line;
        if (!seen.insert(line).second) { duplicates++; continue; }   // insert misslyckas för dubbletter

        stringstream in(line);
        string udi, type, field;
        getline(in, udi, ',');
        getline(in, type, ',');
        vector<double> v(6);
        vector<bool> ok(6);
        for (int k = 0; k < 6; k++) { getline(in, field, ','); ok[k] = toNumber(field, v[k]); }

        int p = firstProblem(v, ok);
        if (p >= 0) { invalid++; cout << "Ogiltig rad " << udi << ": " << NAMES[p] << "\n"; }
        else { clean++; failures += (int)v[5]; }
    }
    cout << "Rader: " << n << "\nDubbletter: " << duplicates << "\nOgiltiga: " << invalid
         << "\nRena rader: " << clean << "\nMaskinfel: " << failures << "\n";
    cout << fixed << setprecision(2) << "Felandel: " << 100.0 * failures / clean << " %\n";
}
