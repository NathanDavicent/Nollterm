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
    void put(int key, int value) {
        int start = hash(key);
        for (int step = 0; step < CAP; step++) {
            Entry& e = table[(start + step) % CAP];   // nästa plats, runt till 0 efter sista
            if (e.key == EMPTY_KEY) { e.key = key; e.value = value; return; }   // insert
            if (e.key == key) { e.value = value; return; }                     // update
        }
        cout << "FULL: key=" << key << endl;
    }

    bool get(int key, int& out) const {
        int start = hash(key);
        for (int step = 0; step < CAP; step++) {
            const Entry& e = table[(start + step) % CAP];
            if (e.key == EMPTY_KEY) return false;   // hål: nyckeln kan inte finnas längre fram
            if (e.key == key) { out = e.value; return true; }
        }
        return false;
    }

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
