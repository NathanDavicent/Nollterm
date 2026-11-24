#include <cmath>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n;
    vector<double> normal(n);
    for (auto& x : normal) cin >> x;
    double mean = 0.0;   // TODO: medelvärdet
    double sd = 0.0;     // TODO: stickprovsstandardavvikelse (dela med n - 1)
    cout << fixed << setprecision(2) << "Medel: " << mean << ", std: " << sd << "\n";

    cin >> m;
    for (int i = 0; i < m; i++) {
        double value;
        cin >> value;
        double z = 0.0;            // TODO
        string status = "normal";  // TODO: "LARM" om |z| > 3
        ostringstream v;
        v << defaultfloat << value;   // som %g
        cout << v.str() << ": z = " << z << ", " << status << "\n";
    }
}
