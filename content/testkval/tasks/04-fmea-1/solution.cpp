#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Risk {
    string name;
    int p, i, d;
    int rpn() const { return p * i * d; }
};

int main() {
    int n;
    cin >> n;
    vector<Risk> risks(n);
    for (auto& r : risks) cin >> r.name >> r.p >> r.i >> r.d;

    // stable_sort behåller ordningen mellan risker med samma RPN
    stable_sort(risks.begin(), risks.end(), [](const Risk& a, const Risk& b) { return a.rpn() > b.rpn(); });

    for (int k = 0; k < n; k++)
        cout << k + 1 << ". " << risks[k].name << ": " << risks[k].p << " x " << risks[k].i << " x " << risks[k].d << " = " << risks[k].rpn() << "\n";
    cout << "Testa först: ";
    for (int k = 0; k < n && k < 3; k++) cout << (k ? ", " : "") << risks[k].name;
    cout << "\n";
}
