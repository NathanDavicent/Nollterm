#include <iostream>
#include <map>
#include <string>
#include <utility>
using namespace std;

// IDLE --TICK--> MEASURING --DATA_READY--> SENDING --SENT--> IDLE
// MEASURING --SENSOR_ERROR--> ERROR --RESET--> IDLE
// SENDING --WIFI_DOWN--> BUFFERING --WIFI_UP--> SENDING
const map<pair<string, string>, string> TRANSITIONS = {
    {{"IDLE", "TICK"}, "MEASURING"},
    // TODO: resten av övergångarna
};

// Returnerar "" om händelsen ska ignoreras
string processEvent(const string& state, const string& event) {
    return "";   // TODO
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
