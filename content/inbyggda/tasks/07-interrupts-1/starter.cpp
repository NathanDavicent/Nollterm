#include <iostream>
#include <string>
#include <cstdint>
using namespace std;

// Körs "varje gång PCINT0 triggar", med nya värdet på PINB.
void onPinChange(uint8_t currState) {
    static uint8_t prevState = 0;   // static: behåller värdet mellan anropen
    // TODO: vilka bitar har ändrats? Skriv "PBn HIGH" eller "PBn LOW" för varje,
    //       i ordning från bit 0, eller "ingen ändring".
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
