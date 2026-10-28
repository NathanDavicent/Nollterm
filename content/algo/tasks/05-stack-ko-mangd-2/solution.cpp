#include <iostream>
#include <vector>
#include <string>
using namespace std;

// En mängd byggd på en vektor. Invariant: inga dubbletter, och elementen ligger sorterade.
class Set {
public:
    bool contains(int x) const {
        for (int v : data)
            if (v == x) return true;
        return false;
    }
    bool add(int x) {
        if (contains(x)) return false;
        size_t i = 0;
        while (i < data.size() && data[i] < x) i++;
        data.insert(data.begin() + i, x);   // behåll sorteringen
        return true;
    }
    const vector<int>& items() const { return data; }

private:
    vector<int> data;
};

Set setUnion(const Set& a, const Set& b) {
    Set r;
    for (int x : a.items()) r.add(x);
    for (int x : b.items()) r.add(x);   // add hoppar över dubbletter
    return r;
}

Set setIntersection(const Set& a, const Set& b) {
    Set r;
    for (int x : a.items())
        if (b.contains(x)) r.add(x);
    return r;
}

Set setDifference(const Set& a, const Set& b) {
    Set r;
    for (int x : a.items())
        if (!b.contains(x)) r.add(x);
    return r;
}

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
