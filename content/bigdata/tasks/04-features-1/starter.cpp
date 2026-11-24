#include <iostream>
#include <iomanip>
using namespace std;

const double PI = 3.141592653589793;

int main() {
    int n;
    cin >> n;
    cout << fixed << setprecision(1);
    for (int i = 0; i < n; i++) {
        double air, process, rpm, torque;
        cin >> air >> process >> rpm >> torque;
        double powerW = 0.0;   // TODO: vridmoment x rpm x 2 pi / 60
        double diffK = 0.0;    // TODO: process minus luft
        cout << "effekt " << powerW << " W, temperaturskillnad " << diffK << " K\n";
    }
}
