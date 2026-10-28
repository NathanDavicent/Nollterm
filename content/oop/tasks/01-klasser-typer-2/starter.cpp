#include <iostream>
using namespace std;

struct Position {
    double x;
    double y;
    void move(double dx, double dy);
    void print() const;
};

// implementera move och print här


int main() {
    double x, y, dx, dy;
    cin >> x >> y >> dx >> dy;
    Position p{x, y};
    p.move(dx, dy);
    p.print();
    return 0;
}
