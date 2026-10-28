#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int n;
    cin >> n;
    double serie = 0, inverssumma = 0;
    for (int i = 0; i < n; i++) {
        double r;
        cin >> r;
        serie += r;             // i serie: R = R1 + R2 + ...
        inverssumma += 1.0 / r; // parallellt: 1/R = 1/R1 + 1/R2 + ...
    }
    cout << fixed << setprecision(2);
    cout << "Serie: " << serie << " ohm" << endl;
    cout << "Parallell: " << 1.0 / inverssumma << " ohm" << endl;
    return 0;
}
