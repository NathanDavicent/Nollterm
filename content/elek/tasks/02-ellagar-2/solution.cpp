#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double uin, r1, r2;
    cin >> uin >> r1 >> r2;
    // Samma ström går genom båda, så spänningen delas i proportion till resistansen.
    double uut = uin * r2 / (r1 + r2);
    cout << fixed << setprecision(2) << "Uut = " << uut << " V" << endl;
    return 0;
}
