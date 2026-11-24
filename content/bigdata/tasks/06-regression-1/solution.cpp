#include <cmath>
#include <iomanip>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<double> t(n), p(n);
    double sum = 0.0;
    for (int i = 0; i < n; i++) { cin >> t[i] >> p[i]; sum += t[i]; }
    double mean = sum / n;

    double absErr = 0, absBase = 0, ssRes = 0, ssTot = 0;
    for (int i = 0; i < n; i++) {
        absErr += fabs(t[i] - p[i]);
        absBase += fabs(t[i] - mean);
        ssRes += (t[i] - p[i]) * (t[i] - p[i]);   // modellens fel
        ssTot += (t[i] - mean) * (t[i] - mean);   // felet med medelvärdet som gissning
    }
    double mae = absErr / n;
    double baselineMae = absBase / n;
    double r2 = 1 - ssRes / ssTot;
    cout << fixed << setprecision(3) << "MAE: " << mae << "\nMAE för medelvärdesbaslinjen: " << baselineMae
         << "\nR2: " << r2 << "\n";
}
