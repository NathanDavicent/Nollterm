#include <iostream>
#include <string>
using namespace std;

constexpr int RED_S = 5, YELLOW_S = 2, GREEN_S = 5;
constexpr int CYCLE_S = RED_S + YELLOW_S + GREEN_S + YELLOW_S;   // 14 s

// Cykeln: röd 5 s, gul 2 s, grön 5 s, gul 2 s, sedan om från början.
string lightAt(int t) {
    int p = t % CYCLE_S;                       // var i cykeln vi är
    if (p < RED_S) return "RÖD";
    if (p < RED_S + YELLOW_S) return "GUL";
    if (p < RED_S + YELLOW_S + GREEN_S) return "GRÖN";
    return "GUL";
}

int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int t;
        cin >> t;
        cout << "t=" << t << ": " << lightAt(t) << endl;
    }
    return 0;
}
