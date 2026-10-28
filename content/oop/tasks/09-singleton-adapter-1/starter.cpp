#include <iostream>
using namespace std;

class Config {
    // Singleton här

};

int main() {
    int v;
    if (cin >> v) Config::instance().setStartHealth(v);
    Config& a = Config::instance();
    Config& b = Config::instance();
    cout << a.startHealth() << " " << (&a == &b ? "samma" : "olika") << endl;
    return 0;
}
