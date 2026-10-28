#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int n;
    cin >> n;
    double serie = 0, parallell = 0;
    for (int i = 0; i < n; i++) {
        double r;
        cin >> r;
        // TODO: räkna ut serie- och parallellresistansen
    }
    cout << fixed << setprecision(2);
    cout << "Serie: " << serie << " ohm" << endl;
    cout << "Parallell: " << parallell << " ohm" << endl;
    return 0;
}
