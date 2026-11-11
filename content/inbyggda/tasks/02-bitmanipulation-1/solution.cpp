#include <iostream>
#include <string>
#include <cstdint>
using namespace std;

// 1U << bit är en mask med en enda etta på plats bit, till exempel 1U << 3 = 0b00001000.
void bitSet(uint8_t& reg, int bit)   { reg |= static_cast<uint8_t>(1U << bit); }    // OR med 1 tänder
void bitClear(uint8_t& reg, int bit) { reg &= static_cast<uint8_t>(~(1U << bit)); } // AND med 0 släcker
void bitFlip(uint8_t& reg, int bit)  { reg ^= static_cast<uint8_t>(1U << bit); }    // XOR med 1 flippar
bool bitCheck(uint8_t reg, int bit)  { return (reg & (1U << bit)) != 0; }

string bits(uint8_t value) {
    string s;
    for (int bit = 7; bit >= 0; bit--) s += ((value >> bit) & 1) ? '1' : '0';
    return s;
}

int main() {
    unsigned start;
    int m;
    cin >> start >> m;
    uint8_t reg = static_cast<uint8_t>(start);
    for (int i = 0; i < m; i++) {
        string cmd;
        int bit;
        cin >> cmd >> bit;
        if (cmd == "set") bitSet(reg, bit);
        else if (cmd == "clear") bitClear(reg, bit);
        else if (cmd == "toggle") bitFlip(reg, bit);

        if (cmd == "check") cout << "check " << bit << ": " << (bitCheck(reg, bit) ? 1 : 0) << endl;
        else cout << cmd << " " << bit << ": " << bits(reg) << endl;
    }
    return 0;
}
