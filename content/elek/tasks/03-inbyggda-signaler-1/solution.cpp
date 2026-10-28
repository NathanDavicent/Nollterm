#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int raw, bits;
    double vref;
    cin >> raw >> bits >> vref;
    int steg = 1 << bits;   // 10 bitar ger 2^10 = 1024 steg
    double volt = raw * vref / steg;
    // Det högsta värdet (steg - 1) räknas som full referensspänning.
    if (raw == steg - 1) volt = vref;
    cout << fixed << setprecision(2) << volt << " V" << endl;
    return 0;
}
