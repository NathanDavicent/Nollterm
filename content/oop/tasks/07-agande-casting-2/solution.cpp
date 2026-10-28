#include <iostream>
#include <memory>
#include <string>
#include <vector>
using namespace std;

struct Device { virtual ~Device() = default; virtual void tick() = 0; };
struct TempSensor : Device { void tick() override {} };
struct LedActuator : Device { void tick() override {} };

int countLeds(const vector<unique_ptr<Device>>& ds) {
    int n = 0;
    for (const auto& d : ds) {
        if (dynamic_cast<LedActuator*>(d.get())) n++;
    }
    return n;
}

int main() {
    vector<unique_ptr<Device>> ds;
    string k;
    while (cin >> k) {
        if (k == "led") ds.push_back(make_unique<LedActuator>());
        else ds.push_back(make_unique<TempSensor>());
    }
    cout << countLeds(ds) << endl;
    return 0;
}
