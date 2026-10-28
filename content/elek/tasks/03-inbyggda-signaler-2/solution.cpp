#include <iostream>
using namespace std;

int main() {
    int procent;
    cin >> procent;
    // 8 bitars PWM: 0 = alltid av, 255 = alltid på. +50 gör att heltalsdivisionen avrundar.
    int varde = (procent * 255 + 50) / 100;
    cout << "analogWrite: " << varde << endl;
    return 0;
}
