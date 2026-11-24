#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int total, days;
    cin >> total >> days;
    int left = total;
    cout << fixed << setprecision(1);
    for (int day = 1; day <= days; day++) {
        int done;
        cin >> done;
        left -= done;
        double ideal = total - (double)total * day / days;   // rak linje från total till 0
        cout << "Dag " << day << ": kvar " << left << ", ideal " << ideal << (left > ideal ? " (efter)" : "") << "\n";
    }
    if (left == 0) cout << "Sprintmålet nått\n";
    else cout << "Kvar vid sprintslut: " << left << " p\n";
}
