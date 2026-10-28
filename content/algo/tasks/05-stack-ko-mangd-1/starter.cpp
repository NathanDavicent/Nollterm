#include <iostream>
#include <string>
#include <stack>
using namespace std;

int main() {
    string line;
    getline(cin, line);
    stack<char> s;
    bool ok = true;
    // TODO: gå igenom raden. Öppnande parentes: push. Stängande: pop och kontrollera att de matchar.
    cout << (ok ? "OK" : "FEL") << endl;
    return 0;
}
