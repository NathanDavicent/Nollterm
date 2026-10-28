#include <iostream>
#include <string>
using namespace std;

enum class Direction { North, East, South, West };

string toString(Direction d) {

}

int main() {
    int n;
    cin >> n;
    cout << toString(static_cast<Direction>(n)) << endl;
    return 0;
}
