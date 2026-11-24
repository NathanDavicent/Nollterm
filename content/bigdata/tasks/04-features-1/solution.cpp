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
        double powerW = torque * rpm * 2 * PI / 60;   // P = M * omega, omega i rad/s
        double diffK = process - air;
        cout << "effekt " << powerW << " W, temperaturskillnad " << diffK << " K\n";
    }
}
