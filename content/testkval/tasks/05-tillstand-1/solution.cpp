#include <iostream>
#include <map>
#include <string>
#include <utility>
using namespace std;

const map<pair<string, string>, string> TRANSITIONS = {
    {{"IDLE", "TICK"}, "MEASURING"},
    {{"MEASURING", "DATA_READY"}, "SENDING"},
    {{"MEASURING", "SENSOR_ERROR"}, "ERROR"},
    {{"SENDING", "SENT"}, "IDLE"},
    {{"SENDING", "WIFI_DOWN"}, "BUFFERING"},
    {{"BUFFERING", "WIFI_UP"}, "SENDING"},
    {{"ERROR", "RESET"}, "IDLE"},
};

// Returnerar "" om händelsen ska ignoreras
string processEvent(const string& state, const string& event) {
    auto it = TRANSITIONS.find({state, event});
    return it == TRANSITIONS.end() ? "" : it->second;
}

int main() {
    int n;
    cin >> n;
    string state = "IDLE";
    for (int i = 0; i < n; i++) {
        string event;
        cin >> event;
        string next = processEvent(state, event);
        if (next.empty()) cout << event << ": " << state << " (ignorerad)\n";
        else { cout << event << ": " << state << " -> " << next << "\n"; state = next; }
    }
}
