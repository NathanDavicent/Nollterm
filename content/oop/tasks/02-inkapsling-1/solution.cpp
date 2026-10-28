#include <iostream>
using namespace std;

class Lamp {
    int brightness_ = 0;
public:
    void setBrightness(int b) {
        if (b < 0) b = 0;
        if (b > 100) b = 100;
        brightness_ = b;
    }
    int brightness() const { return brightness_; }
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
