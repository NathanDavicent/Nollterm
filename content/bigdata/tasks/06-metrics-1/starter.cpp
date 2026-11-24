#include <iomanip>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

void report(const string& name, const vector<int>& yTrue, const vector<int>& yPred) {
    int tn = 0, fp = 0, fn = 0, tp = 0;
    // TODO: räkna sant negativa, falskt positiva, falskt negativa och sant positiva
    double accuracy = 0, precision = 0, recall = 0, f1 = 0;   // TODO (0 om nämnaren är 0)
    cout << name << ": [[" << tn << ", " << fp << "], [" << fn << ", " << tp << "]]\n";
    cout << fixed << setprecision(3) << "  accuracy " << accuracy << ", precision " << precision
         << ", recall " << recall << ", f1 " << f1 << "\n";
}

int main() {
    int n, ones = 0;
    cin >> n;
    vector<int> yTrue(n), yPred(n);
    for (auto& y : yTrue) { cin >> y; ones += y; }
    for (auto& y : yPred) cin >> y;
    report("Modell", yTrue, yPred);
    report("Baslinje", yTrue, vector<int>(n, ones * 2 > n ? 1 : 0));   // vanligaste klassen
}
