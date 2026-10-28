#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double u, r;
    cin >> u >> r;
    double i = 0, p = 0; // TODO: Ohms lag och effekt
    cout << fixed << setprecision(3) << "I = " << i << " A" << endl;
    cout << setprecision(2) << "P = " << p << " W" << endl;
    return 0;
}
