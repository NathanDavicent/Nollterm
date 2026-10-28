#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;   // c är carry in
    int sum = a ^ b ^ c;                      // två XOR-grindar
    int carry = (a & b) | (c & (a ^ b));      // två AND och en OR
    cout << "Sum=" << sum << " Cout=" << carry << endl;
    return 0;
}
