#include <iostream>
#include <string>
using namespace std;

class Sensor {
protected:
    string id_;
public:
    Sensor(const string& id) : id_{id} {}
};

class TemperatureSensor : public Sensor {
public:
    TemperatureSensor(const string& id) : Sensor(id) {}
    void describe() const { cout << "TemperatureSensor " << id_ << endl; }
};

int main() {
    string id;
    cin >> id;
    TemperatureSensor t(id);
    t.describe();
    return 0;
}
