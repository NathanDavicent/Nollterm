#include <iostream>
#include <string>
using namespace std;

int main() {
    string grind;
    cin >> grind;
    cout << "A B Q" << endl;
    for (int a = 0; a <= 1; a++) {
        for (int b = 0; b <= 1; b++) {
            int q = 0; // TODO: räkna ut Q beroende på grind (AND, OR, XOR, NAND, NOR)
            cout << a << " " << b << " " << q << endl;
        }
    }
    return 0;
}
