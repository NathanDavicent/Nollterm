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
    double sum = 0.0;
    for (auto& x : normal) { cin >> x; sum += x; }
    double mean = sum / n;
    double sq = 0.0;
    for (double x : normal) sq += (x - mean) * (x - mean);
    double sd = sqrt(sq / (n - 1));   // stickprov, som pandas .std()
    cout << fixed << setprecision(2) << "Medel: " << mean << ", std: " << sd << "\n";

    cin >> m;
    for (int i = 0; i < m; i++) {
        double value;
        cin >> value;
        double z = (value - mean) / sd;
        ostringstream v;
        v << defaultfloat << value;   // som %g
        cout << v.str() << ": z = " << z << ", " << (fabs(z) > 3 ? "LARM" : "normal") << "\n";
    }
}
