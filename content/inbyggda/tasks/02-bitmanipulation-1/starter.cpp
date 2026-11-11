#include <iostream>
#include <string>
#include <cstdint>
using namespace std;

// TODO: implementera funktionerna med bitoperatorer
void bitSet(uint8_t& reg, int bit) {}
void bitClear(uint8_t& reg, int bit) {}
void bitFlip(uint8_t& reg, int bit) {}
bool bitCheck(uint8_t reg, int bit) { return false; }

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
