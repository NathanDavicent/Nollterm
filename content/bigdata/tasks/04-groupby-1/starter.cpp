#include <iomanip>
#include <iostream>
#include <map>
#include <string>
using namespace std;

struct Group { int count = 0, failures = 0; double torqueSum = 0; };

int main() {
    int n;
    cin >> n;
    map<string, Group> groups;   // map är sorterad på nyckeln
    for (int i = 0; i < n; i++) {
        string t;
        double torque;
        int failure;
        cin >> t >> torque >> failure;
        groups[t].count++;
        // TODO: uppdatera failures och torqueSum
    }
    cout << fixed << setprecision(2);
    for (const auto& [t, g] : groups) {
        // TODO: skriv även fel, felandel och medelvridmoment
        cout << t << ": " << g.count << " observationer\n";
    }
}
