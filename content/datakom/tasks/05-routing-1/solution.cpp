#include <iostream>
#include <cstdint>
#include <sstream>
#include <string>
#include <vector>
using namespace std;

struct Route { uint32_t net; int prefix; string hop, text; };

uint32_t toInt(const string& s) {
    uint32_t a, b, c, d; char dot;
    istringstream in(s);
    in >> a >> dot >> b >> dot >> c >> dot >> d;
    return (a << 24) | (b << 16) | (c << 8) | d;
}

uint32_t maskOf(int prefix) { return prefix == 0 ? 0u : 0xFFFFFFFFu << (32 - prefix); }

int main() {
    int m, k;
    cin >> m;
    vector<Route> routes;
    for (int i = 0; i < m; i++) {
        string net, hop;
        cin >> net >> hop;
        size_t slash = net.find('/');
        routes.push_back({toInt(net.substr(0, slash)), stoi(net.substr(slash + 1)), hop, net});
    }
    cin >> k;
    for (int j = 0; j < k; j++) {
        string destText;
        cin >> destText;
        uint32_t dest = toInt(destText);
        const Route* best = nullptr;
        for (const Route& r : routes) {
            if ((dest & maskOf(r.prefix)) == r.net && (!best || r.prefix > best->prefix)) best = &r;
        }
        if (!best) cout << destText << " -> droppas\n";
        else cout << destText << " -> " << best->hop << " (via " << best->text << ")\n";
    }
}
