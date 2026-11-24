#include <iomanip>
#include <iostream>
#include <map>
#include <string>
using namespace std;

struct Group { int count = 0, failures = 0; double torqueSum = 0; };

int main() {
    int n;
    cin >> n;
    map<string, Group> groups;   // map är sorterad på nyckeln, som groupby
    for (int i = 0; i < n; i++) {
        string t;
        double torque;
        int failure;
        cin >> t >> torque >> failure;
        Group& g = groups[t];
        g.count++;
        g.failures += failure;
        g.torqueSum += torque;
    }
    cout << fixed << setprecision(2);
    for (const auto& [t, g] : groups) {
        cout << t << ": " << g.count << " observationer, " << g.failures << " fel ("
             << 100.0 * g.failures / g.count << " %), medelvridmoment " << g.torqueSum / g.count << " Nm\n";
    }
}
