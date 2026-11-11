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
        char port = '?';
        int bit = 0;
        // TODO: "0"-"7" -> port D, "8"-"13" -> port B (bit = pin - 8), "A0"-"A5" -> port C.
        //       Sätt rätt bit i rätt DDR-register så att pinnen blir en utgång.
        cout << pin << " -> P" << port << bit << endl;
    }
    printReg("DDRB", DDRB);
    printReg("DDRC", DDRC);
    printReg("DDRD", DDRD);
    return 0;
}
