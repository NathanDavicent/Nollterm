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
    // TODO: "+" matchar exakt en nivå, "#" (sist) matchar resten, även noll nivåer.
    return f == t;
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
