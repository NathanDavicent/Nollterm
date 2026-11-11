#include <iostream>
#include <string>
#include <cstdint>
using namespace std;

uint8_t DDRB = 0, DDRC = 0, DDRD = 0;   // låtsasregister, på riktigt kommer de från <avr/io.h>

void printReg(const string& name, uint8_t value) {
    cout << name << " = 0b";
    for (int bit = 7; bit >= 0; bit--) cout << ((value >> bit) & 1);
    cout << endl;
}

int main() {
    int m;
    cin >> m;
    for (int i = 0; i < m; i++) {
        string pin;
        cin >> pin;
        char port;
        int bit;
        uint8_t* ddr;
        if (pin[0] == 'A') {                    // A0-A5: port C
            port = 'C'; bit = stoi(pin.substr(1)); ddr = &DDRC;
        } else if (stoi(pin) < 8) {             // digital 0-7: port D
            port = 'D'; bit = stoi(pin); ddr = &DDRD;
        } else {                                // digital 8-13: port B, bit 0-5
            port = 'B'; bit = stoi(pin) - 8; ddr = &DDRB;
        }
        *ddr |= static_cast<uint8_t>(1U << bit);   // 1 i DDR = utgång
        cout << pin << " -> P" << port << bit << endl;
    }
    printReg("DDRB", DDRB);
    printReg("DDRC", DDRC);
    printReg("DDRD", DDRD);
    return 0;
}
