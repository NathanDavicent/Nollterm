#include <iostream>
#include <string>
#include <cstdint>
using namespace std;

// Körs "varje gång PCINT0 triggar", med nya värdet på PINB.
void onPinChange(uint8_t currState) {
    static uint8_t prevState = 0;                  // static: behåller värdet mellan anropen
    const uint8_t changedPins = currState ^ prevState;   // XOR: 1 där pinnarna skiljer sig
    if (changedPins == 0) cout << "ingen ändring" << endl;
    for (int bit = 0; bit < 8; bit++) {
        const uint8_t mask = static_cast<uint8_t>(1U << bit);
        if (changedPins & mask) {
            cout << "PB" << bit << ((currState & mask) ? " HIGH" : " LOW") << endl;
        }
    }
    prevState = currState;
}

int main() {
    int m;
    cin >> m;
    for (int i = 0; i < m; i++) {
        string s;
        cin >> s;
        onPinChange(static_cast<uint8_t>(stoi(s, nullptr, 2)));
    }
    return 0;
}
