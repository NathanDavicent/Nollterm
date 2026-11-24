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

    double mae = 0.0;          // TODO: medel av |sant - prediktion|
    double baselineMae = 0.0;  // TODO: samma mått om man alltid gissar medelvärdet
    double r2 = 0.0;           // TODO: 1 - SS_res / SS_tot
    cout << fixed << setprecision(3) << "MAE: " << mae << "\nMAE för medelvärdesbaslinjen: " << baselineMae
         << "\nR2: " << r2 << "\n";
}
