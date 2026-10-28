#include <iostream>
using namespace std;

struct Position {
    double x;
    double y;
    void move(double dx, double dy);
    void print() const;
};

void Position::move(double dx, double dy) {
    x += dx;
    y += dy;
}

void Position::print() const {
    cout << "Position(x=" << x << ", y=" << y << ")" << endl;
}

int main() {
    double x, y, dx, dy;
    cin >> x >> y >> dx >> dy;
    Position p{x, y};
    p.move(dx, dy);
    p.print();
    return 0;
}
