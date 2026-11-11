#include <iostream>
#include <string>
#include <cstdint>
using namespace std;

void printRow(const string& label, uint8_t value) {
    cout << label << " = ";
    for (int bit = 7; bit >= 0; bit--) cout << ((value >> bit) & 1);
    cout << " (" << static_cast<unsigned>(value) << ")" << endl;
}

int main() {
    unsigned x, y;
    cin >> x >> y;
    uint8_t a = static_cast<uint8_t>(x), b = static_cast<uint8_t>(y);
    // TODO: räkna ut rätt värden. Resultatet ska vara uint8_t, precis som ett register.
    printRow("a & b", 0);
    printRow("a | b", 0);
    printRow("a ^ b", 0);
    printRow("~a", 0);
    printRow("a << 2", 0);
    printRow("a >> 1", 0);
    return 0;
}
