#include <iostream>
#include <string>
#include <stack>
using namespace std;

char opening(char close) {
    if (close == ')') return '(';
    if (close == ']') return '[';
    return '{';
}

int main() {
    string line;
    getline(cin, line);
    stack<char> s;
    bool ok = true;
    for (char c : line) {
        if (c == '(' || c == '[' || c == '{') {
            s.push(c);
        } else if (c == ')' || c == ']' || c == '}') {
            // Den senast öppnade måste stängas först: LIFO.
            if (s.empty() || s.top() != opening(c)) { ok = false; break; }
            s.pop();
        }
    }
    if (!s.empty()) ok = false;   // något öppnades men stängdes aldrig
    cout << (ok ? "OK" : "FEL") << endl;
    return 0;
}
