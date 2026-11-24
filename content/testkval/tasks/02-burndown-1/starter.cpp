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
        double ideal = 0.0;   // TODO: rak linje från total till 0
        cout << "Dag " << day << ": kvar " << left << ", ideal " << ideal << "\n";
        // TODO: " (efter)" i slutet av raden om left > ideal
    }
    // TODO: "Sprintmålet nått" eller "Kvar vid sprintslut: X p"
}
