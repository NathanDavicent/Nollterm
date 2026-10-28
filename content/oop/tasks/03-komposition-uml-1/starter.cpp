#include <iostream>
#include <string>
using namespace std;

struct Position {
    double x, y;
};

class Robot {
    string name_;
    Position pos_;
public:
    Robot(const string& name) : name_{name}, pos_{0.0, 0.0} {}
    void move(double dx, double dy);
    void printStatus() const;
};

// implementera här


int main() {
    string name;
    cin >> name;
    Robot r(name);
    double dx, dy;
    while (cin >> dx >> dy) r.move(dx, dy);
    r.printStatus();
    return 0;
}
