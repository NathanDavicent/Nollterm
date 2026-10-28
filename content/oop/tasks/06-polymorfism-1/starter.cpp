#include <iostream>
#include <memory>
#include <string>
#include <vector>
using namespace std;

struct Shape {
    virtual ~Shape() = default;
    virtual double area() const = 0;
};

// skriv Rect och Circle


int main() {
    vector<unique_ptr<Shape>> shapes;
    string kind;
    while (cin >> kind) {
        if (kind == "rect") { double b, h; cin >> b >> h; shapes.push_back(make_unique<Rect>(b, h)); }
        else if (kind == "circle") { double r; cin >> r; shapes.push_back(make_unique<Circle>(r)); }
    }
    double total = 0;
    for (const auto& s : shapes) total += s->area();
    cout << total << endl;
    return 0;
}
