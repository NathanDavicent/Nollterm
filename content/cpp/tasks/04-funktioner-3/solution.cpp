#include <iostream>
using namespace std;

void swap(int* a, int* b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int main() {
    int x, y;
    cin >> x >> y;
    swap(&x, &y);
    cout << x << " " << y << endl;
    return 0;
}
