#include <algorithm>
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Module { string name; int bugs, lines; };

double density(int bugs, int lines) {
    return 0.0;   // TODO: defekter per tusen rader, tänk på parenteserna
}

int main() {
    int n, totalBugs = 0, totalLines = 0;
    cin >> n;
    vector<Module> mods(n);
    for (auto& m : mods) { cin >> m.name >> m.bugs >> m.lines; totalBugs += m.bugs; totalLines += m.lines; }
    double total = density(totalBugs, totalLines);
    cout << fixed << setprecision(1);
    // TODO: sortera med högst densitet först och markera moduler över totalen
    for (const auto& m : mods) cout << m.name << ": " << density(m.bugs, m.lines) << " per KLOC\n";
    cout << "Totalt: " << total << " per KLOC\n";
}
