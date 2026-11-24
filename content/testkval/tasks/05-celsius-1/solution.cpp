#include <iostream>
#include <iomanip>
using namespace std;

const double SENSOR_ERROR = -999.0;

double convertToCelsius(int rawAdc) {
    if (rawAdc < 0 || rawAdc > 4095) return SENSOR_ERROR;   // 12-bitars ADC: 0..4095
    return rawAdc * (3.3 / 4095.0) * 100.0;
}

int main() {
    int n, count = 0;
    double sum = 0.0;
    cin >> n;
    cout << fixed << setprecision(2);
    for (int i = 0; i < n; i++) {
        int raw;
        cin >> raw;
        double c = convertToCelsius(raw);
        if (c == SENSOR_ERROR) {
            cout << raw << " -> fel\n";
        } else {
            sum += c;
            count++;
            cout << raw << " -> " << c << "\n";
        }
    }
    if (count > 0) cout << "Medel: " << sum / count << "\n";
    else cout << "Medel: -\n";
}
