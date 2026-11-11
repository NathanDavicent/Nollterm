#include <iostream>
#include <string>
using namespace std;

int main() {
    int n;
    string samples;
    cin >> n >> samples;

    // Utan debouncing: varje 0 -> 1 räknas, även studsarna.
    int raw = 0;
    for (size_t i = 1; i < samples.size(); i++)
        if (samples[i - 1] == '0' && samples[i] == '1') raw++;

    // Med debouncing: tillståndet byts först när den nya nivån hållit i n sampel i rad.
    int stable = 0, count = 0, debounced = 0;
    for (char c : samples) {
        int level = c - '0';
        if (level == stable) {
            count = 0;                 // studs tillbaka: börja om
        } else if (++count >= n) {
            stable = level;            // nu litar vi på den nya nivån
            count = 0;
            if (stable == 1) debounced++;
        }
    }
    cout << "Rå: " << raw << endl;
    cout << "Debouncad: " << debounced << endl;
    return 0;
}
