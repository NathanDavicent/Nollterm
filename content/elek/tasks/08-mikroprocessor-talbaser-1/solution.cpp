#include <iostream>
#include <string>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n == 0) { cout << "0" << endl; return 0; }
    string bitar;
    // Dela med 2 upprepade gånger. Resterna är bitarna, minst signifikant först.
    while (n > 0) {
        bitar = char('0' + n % 2) + bitar;
        n /= 2;
    }
    cout << bitar << endl;
    return 0;
}
