#include <iostream>
using namespace std;

class OldThermo {              // kan inte ändras
    int tenths_;
public:
    OldThermo(int t) : tenths_(t) {}
    int readTenths() const { return tenths_; }
};

class ISensor {
public:
    virtual ~ISensor() = default;
    virtual double read() const = 0;
};

class ThermoAdapter : public ISensor {
    OldThermo old_;
public:
    explicit ThermoAdapter(OldThermo old) : old_(old) {}
    double read() const override { return old_.readTenths() / 10.0; }
};

int main() {
    int t;
    cin >> t;
    ThermoAdapter a{OldThermo(t)};
    const ISensor& s = a;
    cout << s.read() << endl;
    return 0;
}
