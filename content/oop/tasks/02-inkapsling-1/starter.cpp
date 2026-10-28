#include <iostream>
using namespace std;

class Lamp {

};

int main() {
    Lamp lamp;
    int v;
    while (cin >> v) {
        lamp.setBrightness(v);
        cout << lamp.brightness() << endl;
    }
    return 0;
}
