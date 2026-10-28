#include <iostream>
using namespace std;

class Counter {
    // privat räknare

public:
    // increment() och value()

};

int main() {
    int n;
    cin >> n;
    Counter c;
    for (int i = 0; i < n; i++) c.increment();
    cout << c.value() << endl;
    return 0;
}
