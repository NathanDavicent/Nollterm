#include <iostream>
using namespace std;

int readSensor(int raw, float* val) {
    if (raw < 0 || raw > 1023) return -1;
    *val = raw * 100.0 / 1023;
    return 0;
}

int main() {
    int raw;
    cin >> raw;
    float v = 0;
    if (readSensor(raw, &v) == 0) cout << "OK" << endl;
    else cout << "SENSOR_ERROR" << endl;
    return 0;
}
