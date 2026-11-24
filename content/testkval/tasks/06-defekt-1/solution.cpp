#include <algorithm>
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Module { string name; int bugs, lines; };

double density(int bugs, int lines) {
    return bugs / (lines / 1000.0);   // inte bugs / lines / 1000
}

int main() {
    int n, totalBugs = 0, totalLines = 0;
    cin >> n;
    vector<Module> mods(n);
    for (auto& m : mods) { cin >> m.name >> m.bugs >> m.lines; totalBugs += m.bugs; totalLines += m.lines; }
    double total = density(totalBugs, totalLines);
    stable_sort(mods.begin(), mods.end(), [](const Module& a, const Module& b) {
        return density(a.bugs, a.lines) > density(b.bugs, b.lines);
    });
    cout << fixed << setprecision(1);
    for (const auto& m : mods) {
        double d = density(m.bugs, m.lines);
        cout << m.name << ": " << d << " per KLOC" << (d > total ? "  <- över snittet, extra granskning" : "") << "\n";
    }
    cout << "Totalt: " << total << " per KLOC\n";
}
