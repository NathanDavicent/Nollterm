#include <iostream>
#include <iomanip>
#include <bitset>
#include <string>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string addrText, rw;
        cin >> addrText >> rw;
        unsigned addr = stoul(addrText, nullptr, 16);
        cout << uppercase << hex << setfill('0');
        if (addr < 0x08 || addr > 0x77) {
            cout << "0x" << setw(2) << addr << ": reserverad adress\n";
            continue;
        }
        unsigned byte = 0;   // TODO: adressen ett steg vänster, bit 0 = 1 för R och 0 för W
        cout << "0x" << setw(2) << addr << " " << rw << " -> 0x" << setw(2) << byte
             << " (" << bitset<8>(byte) << ")\n";
    }
}
