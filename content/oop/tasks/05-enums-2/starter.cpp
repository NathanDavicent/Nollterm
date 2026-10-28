#include <iostream>
#include <string>
using namespace std;

enum class MachineState { Idle, Running, Error };

class Machine {
    MachineState state_ = MachineState::Idle;
public:
    void start() { state_ = MachineState::Running; }
    void fail()  { state_ = MachineState::Error; }
    void printStatus() const {
        // skriv ut statusen
    }
};

int main() {
    Machine m;
    string cmd;
    while (cin >> cmd) {
        if (cmd == "start") m.start();
        else if (cmd == "fail") m.fail();
    }
    m.printStatus();
    return 0;
}
