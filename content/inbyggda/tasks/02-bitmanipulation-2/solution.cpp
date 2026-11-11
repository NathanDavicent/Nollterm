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
    // static_cast<uint8_t> kastar bort allt över 8 bitar, precis som i ett 8-bitars register.
    printRow("a & b", static_cast<uint8_t>(a & b));
    printRow("a | b", static_cast<uint8_t>(a | b));
    printRow("a ^ b", static_cast<uint8_t>(a ^ b));
    printRow("~a", static_cast<uint8_t>(~a));        // ~ på en uint8_t ger ett int
    printRow("a << 2", static_cast<uint8_t>(a << 2)); // bitar som skiftas ut försvinner
    printRow("a >> 1", static_cast<uint8_t>(a >> 1));
    return 0;
}
