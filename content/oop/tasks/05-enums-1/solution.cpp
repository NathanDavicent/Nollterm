#include <iostream>
#include <string>
using namespace std;

enum class Direction { North, East, South, West };

string toString(Direction d) {
    switch (d) {
        case Direction::North: return "norr";
        case Direction::East:  return "öster";
        case Direction::South: return "söder";
        case Direction::West:  return "väster";
    }
    return "okänd";
}

int main() {
    int n;
    cin >> n;
    cout << toString(static_cast<Direction>(n)) << endl;
    return 0;
}
