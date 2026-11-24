#include <iostream>
#include <iomanip>
#include <string>
using namespace std;

int main() {
    string fmt, text;
    cin >> fmt >> text;
    int total = 0;
    for (char ch : text) {
        int value = (unsigned char)ch;
        string frame = "0 ";   // startbit
        // TODO: de 8 databitarna med LSB först, sedan paritetsbit om fmt[1] är 'E' eller 'O'
        frame += " 1";         // stoppbit
        for (char c : frame) if (c != ' ') total++;
        cout << ch << " 0x" << uppercase << hex << setw(2) << setfill('0') << value << dec << ": " << frame << "\n";
    }
    cout << "Totalt " << total << " bitar\n";
}
