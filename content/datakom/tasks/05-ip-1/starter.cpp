#include <iostream>
#include <cstdint>
#include <string>
using namespace std;

string toText(uint32_t ip) {
    return to_string(ip >> 24 & 255) + "." + to_string(ip >> 16 & 255) + "." + to_string(ip >> 8 & 255) + "." + to_string(ip & 255);
}

int main() {
    uint32_t a, b, c, d;
    int prefix;
    char dot;
    cin >> a >> dot >> b >> dot >> c >> dot >> d >> dot >> prefix;   // dot läser '.' och '/'
    uint32_t ip = (a << 24) | (b << 16) | (c << 8) | d;

    uint32_t mask = 0;        // TODO: prefix ettor följda av nollor
    uint32_t network = 0;     // TODO: ip AND mask
    uint32_t broadcast = 0;   // TODO: nätverket med alla värdbitar satta

    cout << "Nätverk: " << toText(network) << "/" << prefix << "\n";
    cout << "Mask: " << toText(mask) << "\n";
    cout << "Broadcast: " << toText(broadcast) << "\n";
    cout << "Första värd: " << toText(network + 1) << "\n";
    cout << "Sista värd: " << toText(broadcast - 1) << "\n";
    cout << "Antal värdar: " << (1u << (32 - prefix)) - 2 << "\n";
}
