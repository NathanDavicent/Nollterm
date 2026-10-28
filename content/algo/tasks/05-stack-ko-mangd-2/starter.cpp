#include <iostream>
#include <vector>
#include <string>
using namespace std;

// En mängd byggd på en vektor. Invariant: inga dubbletter, och elementen ligger sorterade.
class Set {
public:
    bool contains(int x) const {
        // TODO
        return false;
    }
    bool add(int x) {
        // TODO: lägg till om x inte finns och returnera true, annars false
        return false;
    }
    const vector<int>& items() const { return data; }

private:
    vector<int> data;
};

Set setUnion(const Set& a, const Set& b) { return Set(); }          // TODO
Set setIntersection(const Set& a, const Set& b) { return Set(); }   // TODO
Set setDifference(const Set& a, const Set& b) { return Set(); }     // TODO

void printSet(const string& label, const Set& s) {
    cout << label << ":";
    for (int x : s.items()) cout << " " << x;
    cout << endl;
}

Set readSet() {
    int n, x;
    cin >> n;
    Set s;
    for (int i = 0; i < n; i++) { cin >> x; s.add(x); }
    return s;
}

int main() {
    Set a = readSet();
    Set b = readSet();
    printSet("Union", setUnion(a, b));
    printSet("Snitt", setIntersection(a, b));
    printSet("Differens", setDifference(a, b));
    return 0;
}
