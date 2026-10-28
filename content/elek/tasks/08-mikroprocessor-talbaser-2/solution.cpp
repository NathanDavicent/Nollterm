#include <iostream>
#include <string>
using namespace std;

int main() {
    int n;
    cin >> n;
    const string siffror = "0123456789ABCDEF";
    string hex;
    // Samma idé som binärt, men vi delar med 16. Rest 10-15 blir A-F.
    do {
        hex = siffror[n % 16] + hex;
        n /= 16;
    } while (n > 0);
    cout << "0x" << hex << endl;
    return 0;
}
