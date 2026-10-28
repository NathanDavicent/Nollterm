#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int raw, bits;
    double vref;
    cin >> raw >> bits >> vref;
    double volt = 0; // TODO: räkna om ADC-värdet till spänning
    cout << fixed << setprecision(2) << volt << " V" << endl;
    return 0;
}
