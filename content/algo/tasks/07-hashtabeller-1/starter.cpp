#include <iostream>
#include <string>
using namespace std;

const int CAP = 11;
const int EMPTY_KEY = 0;   // nyckeln 0 betyder tom plats

struct Entry {
    int key = EMPTY_KEY;
    int value = 0;
};

class HashMap {
public:
    // TODO: linjär sondering. Tom plats: lägg in. Samma nyckel: uppdatera.
    //       Hittas ingen plats: cout << "FULL: key=" << key << endl;
    void put(int key, int value) {}
    // TODO: samma sondering. Stoppa på tom plats. Returnera true och sätt out om nyckeln finns.
    bool get(int key, int& out) const { return false; }

    void print() const {
        for (int i = 0; i < CAP; i++) {
            if (table[i].key == EMPTY_KEY) cout << "[" << i << "] EMPTY" << endl;
            else cout << "[" << i << "] key=" << table[i].key << " value=" << table[i].value << endl;
        }
    }

private:
    static int hash(int key) { return key % CAP; }
    Entry table[CAP];
};

int main() {
    HashMap map;
    int m;
    cin >> m;
    for (int i = 0; i < m; i++) {
        string cmd;
        int k, v;
        cin >> cmd;
        if (cmd == "put") { cin >> k >> v; map.put(k, v); }
        else if (cmd == "get") {
            cin >> k;
            if (map.get(k, v)) cout << "get(" << k << ") -> " << v << endl;
            else cout << "get(" << k << ") -> NOT FOUND" << endl;
        } else if (cmd == "print") map.print();
    }
    return 0;
}
