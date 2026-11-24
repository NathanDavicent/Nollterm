#include <iostream>
#include <string>
using namespace std;

const string STEPS[] = {"ping 127.0.0.1", "ping gateway", "ping 8.8.8.8", "ping dns.google", "ping sti.se"};
const string CAUSES[] = {"nätverkskortet", "lokala nätverket eller gatewayen", "internet bortom routern",
                         "DNS", "tjänsten eller dess DNS-server"};

int main() {
    string results[5];
    for (auto& r : results) cin >> r;

    // TODO: sluta vid första "fail" och skriv "Felet ligger i: <orsak>".
    //       Om alla är ok: "Allt fungerar"
    for (int i = 0; i < 5; i++) {
        cout << i + 1 << " " << STEPS[i] << ": " << results[i] << "\n";
    }
}
