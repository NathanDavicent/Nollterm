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
        int ones = 0;
        for (int bit = 0; bit < 8; bit++) {          // LSB först
            int b = (value >> bit) & 1;
            ones += b;
            frame += char('0' + b);
        }
        if (fmt[1] == 'E') frame += " " + to_string(ones % 2);        // jämn paritet
        else if (fmt[1] == 'O') frame += " " + to_string(1 - ones % 2); // udda paritet
        frame += " 1";         // stoppbit
        for (char c : frame) if (c != ' ') total++;
        cout << ch << " 0x" << uppercase << hex << setw(2) << setfill('0') << value << dec << ": " << frame << "\n";
    }
    cout << "Totalt " << total << " bitar\n";
}
