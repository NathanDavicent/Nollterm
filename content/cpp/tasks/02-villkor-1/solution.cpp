#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n > 0) {
        cout << "positivt" << endl;
    } else if (n < 0) {
        cout << "negativt" << endl;
    } else {
        cout << "noll" << endl;
    }
    return 0;
}
