#include <iostream>
#include <string>
using namespace std;

int main() {
    int n;
    string samples;
    cin >> n >> samples;
    int raw = 0, debounced = 0;
    // TODO: raw = antal gånger signalen går från 0 till 1 direkt i samplen.
    //       debounced = antal tryck när en ändring måste hålla i n sampel i rad.
    cout << "Rå: " << raw << endl;
    cout << "Debouncad: " << debounced << endl;
    return 0;
}
