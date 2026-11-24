#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    long long sensors, perSecond, size, copies;
    cin >> sensors >> perSecond >> size >> copies;

    long long bytesPerSecond = sensors * perSecond * size;
    double gbPerDay = bytesPerSecond * 86400.0 / 1e9;          // sekunder per dygn
    double tbPerYear = bytesPerSecond * 86400.0 * 365 / 1e12;

    cout << "Byte per sekund: " << bytesPerSecond << "\n" << fixed << setprecision(2);
    cout << "GB per dygn: " << gbPerDay << "\n";
    cout << "TB per år: " << tbPerYear << "\n";
    cout << "Med " << copies << " kopior: " << tbPerYear * copies << " TB per år\n";
}
