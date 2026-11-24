#include <iostream>
#include <sstream>
#include <string>
#include <vector>
using namespace std;

vector<string> split(const string& topic) {
    vector<string> levels;
    stringstream in(topic);
    string level;
    while (getline(in, level, '/')) levels.push_back(level);
    return levels;
}

bool matches(const string& filter, const string& topic) {
    vector<string> f = split(filter), t = split(topic);
    for (size_t i = 0; i < f.size(); i++) {
        if (f[i] == "#") return true;                     // resten matchar, även noll nivåer
        if (i >= t.size()) return false;                  // topicen tog slut
        if (f[i] != "+" && f[i] != t[i]) return false;    // "+" matchar en valfri nivå
    }
    return f.size() == t.size();
}

int main() {
    string filter;
    int n;
    cin >> filter >> n;
    for (int i = 0; i < n; i++) {
        string topic;
        cin >> topic;
        cout << topic << ": " << (matches(filter, topic) ? "ja" : "nej") << "\n";
    }
}
