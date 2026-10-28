#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double u, r;
    cin >> u >> r;
    double i = u / r;   // Ohms lag: U = R * I
    double p = u * i;   // effekt: P = U * I
    cout << fixed << setprecision(3) << "I = " << i << " A" << endl;
    cout << setprecision(2) << "P = " << p << " W" << endl;
    return 0;
}
