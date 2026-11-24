#include <iostream>
#include <map>
#include <string>
using namespace std;

const map<string, int> LAYERS = {
    {"Bitar", 1}, {"Kabel", 1}, {"Radio", 1}, {"Ramar", 2}, {"MAC", 2}, {"Switch", 2},
    {"Paket", 3}, {"IP", 3}, {"Router", 3}, {"ICMP", 3}, {"Segment", 4}, {"TCP", 4}, {"UDP", 4},
    {"Inloggning", 5}, {"JSON", 6}, {"XML", 6}, {"JPG", 6}, {"TLS", 6},
    {"HTTP", 7}, {"HTTPS", 7}, {"MQTT", 7}, {"FTP", 7}, {"DNS", 7}, {"CoAP", 7}};
const string NAMES[] = {"", "Fysiska", "Datalänk", "Nätverk", "Transport", "Session", "Presentation", "Applikation"};

int layerOf(const string& term) {
    auto it = LAYERS.find(term);           // find ger end() om nyckeln saknas
    return it == LAYERS.end() ? 0 : it->second;
}

int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string term;
        cin >> term;
        int layer = layerOf(term);
        if (layer == 0) cout << term << ": okänt\n";
        else cout << term << ": lager " << layer << " (" << NAMES[layer] << ")\n";
    }
}
