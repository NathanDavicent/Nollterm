#include <iostream>
using namespace std;

int readSensor(int raw, float* val) {

}

int main() {
    int raw;
    cin >> raw;
    float v = 0;
    if (readSensor(raw, &v) == 0) cout << "OK" << endl;
    else cout << "SENSOR_ERROR" << endl;
    return 0;
}
