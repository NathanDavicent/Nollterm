#include <iostream>
#include <cstdint>
#include <string>
using namespace std;

string toText(uint32_t ip) {
    return to_string(ip >> 24 & 255) + "." + to_string(ip >> 16 & 255) + "." + to_string(ip >> 8 & 255) + "." + to_string(ip & 255);
}

int main() {
    uint32_t a, b, c, d;
    int prefix, newPrefix;
    char dot;
    cin >> a >> dot >> b >> dot >> c >> dot >> d >> dot >> prefix >> newPrefix;
    uint32_t start = (a << 24) | (b << 16) | (c << 8) | d;

    uint32_t count = 1u << (newPrefix - prefix);   // varje lånad bit dubblar antalet
    uint32_t size = 1u << (32 - newPrefix);        // adresser per subnät
    cout << count << " subnät med " << size - 2 << " värdar var\n";
    for (uint32_t i = 0; i < count; i++) {
        uint32_t first = start + i * size;
        uint32_t last = first + size - 1;          // broadcast
        cout << toText(first) << "/" << newPrefix << ": värdar " << toText(first + 1) << " - "
             << toText(last - 1) << ", broadcast " << toText(last) << "\n";
    }
}
