#include <iostream>
#include <string>
using namespace std;

int grindvarde(const string& grind, int a, int b) {
    if (grind == "AND") return a & b;
    if (grind == "OR") return a | b;
    if (grind == "XOR") return a ^ b;
    if (grind == "NAND") return !(a & b);   // NOT AND
    if (grind == "NOR") return !(a | b);    // NOT OR
    return 0;
}

int main() {
    string grind;
    cin >> grind;
    cout << "A B Q" << endl;
    for (int a = 0; a <= 1; a++) {
        for (int b = 0; b <= 1; b++) {
            cout << a << " " << b << " " << grindvarde(grind, a, b) << endl;
        }
    }
    return 0;
}
