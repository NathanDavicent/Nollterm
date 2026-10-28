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

// skriv Alarm och Counter (Counter har en publik int count)


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
