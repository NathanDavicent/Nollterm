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
    // konstruktor och describe()

};

int main() {
    string id;
    cin >> id;
    TemperatureSensor t(id);
    t.describe();
    return 0;
}
