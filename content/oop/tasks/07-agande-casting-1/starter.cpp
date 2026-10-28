#include <iostream>
#include <memory>
#include <string>
using namespace std;

struct Effect { virtual ~Effect() = default; virtual void apply() = 0; };
struct Slow : Effect { void apply() override { cout << "Slow" << endl; } };
struct Burn : Effect { void apply() override { cout << "Burn" << endl; } };

unique_ptr<Effect> makeEffect(const string& name) {

}

int main() {
    string name;
    while (cin >> name) {
        auto e = makeEffect(name);
        if (e) e->apply();
        else cout << "okänd" << endl;
    }
    return 0;
}
