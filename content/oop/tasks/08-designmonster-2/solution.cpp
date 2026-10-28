#include <iostream>
#include <vector>
using namespace std;

struct Observer {
    virtual ~Observer() = default;
    virtual void onNotify(int value) = 0;
};

class Sensor {
    vector<Observer*> observers_;
public:
    void addObserver(Observer* o) { observers_.push_back(o); }
    void newReading(int v) { for (auto* o : observers_) o->onNotify(v); }
};

struct Alarm : Observer {
    void onNotify(int v) override {
        if (v > 30) cout << "LARM " << v << endl;
    }
};

struct Counter : Observer {
    int count = 0;
    void onNotify(int) override { count++; }
};

int main() {
    Sensor s;
    Alarm alarm;
    Counter counter;
    s.addObserver(&alarm);
    s.addObserver(&counter);
    int v;
    while (cin >> v) s.newReading(v);
    cout << counter.count << " notifieringar" << endl;
    return 0;
}
