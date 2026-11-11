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
    switch (s) {
        case SafeState::Idle:        return key == '1' ? SafeState::One : SafeState::Idle;
        case SafeState::One:         return key == '2' ? SafeState::OneTwo : SafeState::Idle;
        case SafeState::OneTwo:      return key == '3' ? SafeState::OneTwoThree : SafeState::Idle;
        case SafeState::OneTwoThree: return key == '4' ? SafeState::Unlocked : SafeState::Idle;
        case SafeState::Unlocked:    return key == '0' ? SafeState::Idle : SafeState::Unlocked;
    }
    return SafeState::Idle;
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
