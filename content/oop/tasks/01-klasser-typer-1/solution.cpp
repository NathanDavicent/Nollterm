#include <iostream>
using namespace std;

class Counter {
    int count_ = 0;
public:
    void increment() { count_++; }
    int value() const { return count_; }
};

int main() {
    int n;
    cin >> n;
    Counter c;
    for (int i = 0; i < n; i++) c.increment();
    cout << c.value() << endl;
    return 0;
}
