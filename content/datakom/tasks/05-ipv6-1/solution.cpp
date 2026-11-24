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
    size_t gap = addr.find("::");
    if (gap == string::npos) return parseGroups(addr);
    vector<int> left = parseGroups(addr.substr(0, gap));
    vector<int> right = parseGroups(addr.substr(gap + 2));
    vector<int> g = left;
    g.resize(8 - right.size(), 0);                // "::" fyller ut med nollor
    g.insert(g.end(), right.begin(), right.end());
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

string join(const vector<int>& g, int from, int to) {
    string s;
    for (int i = from; i < to; i++) s += (i > from ? ":" : "") + hex(g[i], 1);
    return s;
}

string shortForm(const vector<int>& g) {
    int bestStart = -1, bestLen = 0;
    for (int i = 0; i < 8; ) {
        if (g[i] == 0) {
            int j = i;
            while (j < 8 && g[j] == 0) j++;
            if (j - i > bestLen) { bestStart = i; bestLen = j - i; }   // > gör att den vänstra vinner
            i = j;
        } else {
            i++;
        }
    }
    if (bestLen < 2) return join(g, 0, 8);    // en ensam nollgrupp förkortas inte
    return join(g, 0, bestStart) + "::" + join(g, bestStart + bestLen, 8);
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
