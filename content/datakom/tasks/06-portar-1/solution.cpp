#include <iostream>
#include <map>
#include <string>
using namespace std;

const map<int, string> SERVICES = {
    {22, "SSH"}, {53, "DNS"}, {80, "HTTP"}, {443, "HTTPS"}, {1883, "MQTT"}, {8883, "MQTT över TLS"},
    {8884, "MQTT över WebSocket och TLS"}, {5683, "CoAP"}, {5684, "CoAP över DTLS"}};

string portType(int port) {
    if (port < 0 || port > 65535) return "ogiltig";   // porten är ett 16-bitarstal
    if (port <= 1023) return "well-known";
    if (port <= 49151) return "registered";
    return "dynamic";
}

int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int port;
        cin >> port;
        cout << port << ": " << portType(port);
        auto it = SERVICES.find(port);
        if (it != SERVICES.end()) cout << ", " << it->second;
        cout << "\n";
    }
}
