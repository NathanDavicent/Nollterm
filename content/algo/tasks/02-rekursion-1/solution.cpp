#include <iostream>
using namespace std;

int sum(int n) {
    cout << "sum(" << n << ") anropas" << endl;
    int result;
    if (n <= 1) {
        result = n;                 // basfall: sum(1) = 1 och sum(0) = 0
    } else {
        result = n + sum(n - 1);    // rekursivt anrop med ett mindre problem
    }
    cout << "sum(" << n << ") returnerar " << result << endl;
    return result;
}

int main() {
    int n;
    cin >> n;
    sum(n);
    return 0;
}
