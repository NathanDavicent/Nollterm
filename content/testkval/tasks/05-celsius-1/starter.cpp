#include <iostream>
#include <iomanip>
using namespace std;

const double SENSOR_ERROR = -999.0;

double convertToCelsius(int rawAdc) {
    // TODO: fel om rawAdc ligger utanför 0..4095, annars raw * (3.3 / 4095) * 100
    return rawAdc;
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
