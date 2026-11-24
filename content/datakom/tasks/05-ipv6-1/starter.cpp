#include <iostream>
#include <iomanip>
#include <sstream>
#include <string>
#include <vector>
using namespace std;

vector<int> parseGroups(const string& text) {
    vector<int> out;
    stringstream in(text);
    string part;
    while (getline(in, part, ':')) {
        if (!part.empty()) out.push_back(stoi(part, nullptr, 16));
    }
    return out;
}

vector<int> expand(const string& addr) {
    // TODO: hantera "::" så att det alltid blir 8 grupper
    vector<int> g = parseGroups(addr);
    g.resize(8, 0);
    return g;
}

string hex(int v, int width) {
    ostringstream s;
    s << std::hex << setw(width) << setfill('0') << v;
    return s.str();
}

string longForm(const vector<int>& g) {
    string s;
    for (int i = 0; i < 8; i++) s += (i ? ":" : "") + hex(g[i], 4);
    return s;
}

string shortForm(const vector<int>& g) {
    // TODO: ersätt den längsta serien (minst två) nollgrupper med "::"
    string s;
    for (int i = 0; i < 8; i++) s += (i ? ":" : "") + hex(g[i], 1);
    return s;
}

int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string addr;
        cin >> addr;
        vector<int> g = expand(addr);
        cout << longForm(g) << "\n" << shortForm(g) << "\n";
    }
}
