#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    long long sensors, perSecond, size, copies;
    cin >> sensors >> perSecond >> size >> copies;

    long long bytesPerSecond = 0;   // TODO: sensorer x meddelanden per sekund x byte
    double gbPerDay = 0.0;          // TODO: 1 GB = 1e9 byte, ett dygn = 86400 s
    double tbPerYear = 0.0;         // TODO: 1 TB = 1e12 byte, ett år = 365 dygn

    cout << "Byte per sekund: " << bytesPerSecond << "\n" << fixed << setprecision(2);
    cout << "GB per dygn: " << gbPerDay << "\n";
    cout << "TB per år: " << tbPerYear << "\n";
    cout << "Med " << copies << " kopior: " << tbPerYear * copies << " TB per år\n";
}
