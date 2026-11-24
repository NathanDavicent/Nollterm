#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Risk {
    string name;
    int p, i, d;
    int rpn() const { return 0; }   // TODO: P x I x D
};

int main() {
    int n;
    cin >> n;
    vector<Risk> risks(n);
    for (auto& r : risks) cin >> r.name >> r.p >> r.i >> r.d;

    // TODO: sortera med högst RPN först, lika ska behålla ordningen (stable_sort)

    for (int k = 0; k < n; k++)
        cout << k + 1 << ". " << risks[k].name << ": " << risks[k].p << " x " << risks[k].i << " x " << risks[k].d << " = " << risks[k].rpn() << "\n";
    cout << "Testa först: ";
    for (int k = 0; k < n && k < 3; k++) cout << (k ? ", " : "") << risks[k].name;
    cout << "\n";
}
