#include <iomanip>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

double safeDiv(double a, double b) { return b != 0 ? a / b : 0.0; }   // zero_division=0

void report(const string& name, const vector<int>& yTrue, const vector<int>& yPred) {
    int tn = 0, fp = 0, fn = 0, tp = 0;
    for (size_t i = 0; i < yTrue.size(); i++) {
        if (yTrue[i] == 1 && yPred[i] == 1) tp++;        // hittat fel
        else if (yTrue[i] == 0 && yPred[i] == 1) fp++;   // falskt larm
        else if (yTrue[i] == 1 && yPred[i] == 0) fn++;   // missat fel
        else tn++;                                       // sant normal
    }
    double accuracy = (double)(tp + tn) / yTrue.size();
    double precision = safeDiv(tp, tp + fp);
    double recall = safeDiv(tp, tp + fn);
    double f1 = safeDiv(2 * precision * recall, precision + recall);
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
