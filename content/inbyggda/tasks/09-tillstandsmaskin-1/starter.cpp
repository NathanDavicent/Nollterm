#include <iostream>
#include <string>
using namespace std;

enum class SafeState { Idle, One, OneTwo, OneTwoThree, Unlocked };

string stateName(SafeState s) {
    switch (s) {
        case SafeState::Idle: return "IDLE";
        case SafeState::One: return "1";
        case SafeState::OneTwo: return "12";
        case SafeState::OneTwoThree: return "123";
        case SafeState::Unlocked: return "OLÅST";
    }
    return "?";
}

// Koden är 1234. Fel siffra skickar tillbaka till IDLE. 0 låser när skåpet är olåst.
SafeState nextState(SafeState s, char key) {
    // TODO: en switch över s
    return s;
}

int main() {
    string keys;
    cin >> keys;
    SafeState state = SafeState::Idle;
    for (char key : keys) {
        state = nextState(state, key);
        cout << key << " -> " << stateName(state) << endl;
    }
    return 0;
}
