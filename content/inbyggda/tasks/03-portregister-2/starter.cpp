#include <iostream>
#include <string>
using namespace std;

// Cykeln: röd 5 s, gul 2 s, grön 5 s, gul 2 s, sedan om från början.
string lightAt(int t) {
    // TODO
    return "?";
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
