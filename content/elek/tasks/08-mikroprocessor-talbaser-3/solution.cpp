#include <iostream>
#include <string>
using namespace std;

int main() {
    string bitar;
    cin >> bitar;
    int varde = 0;
    // Läs från vänster: varje ny bit flyttar de tidigare ett steg upp (gånger 2).
    for (char b : bitar) {
        varde = varde * 2 + (b - '0');
    }
    cout << varde << endl;
    return 0;
}
