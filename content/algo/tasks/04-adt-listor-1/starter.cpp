#include <iostream>
#include <string>
#include <cassert>
using namespace std;

struct Node {
    int d;
    Node* rest;
};

// En enkellänkad lista. Användaren ser bara de publika metoderna (ADT-gränssnittet).
class List {
public:
    ~List() { clear(); }
    bool empty() const { return head == nullptr; }
    // TODO: implementera metoderna
    void addFirst(int d) {}
    void addLast(int d) {}
    void removeFirst() { assert(!empty()); }
    void removeLast() { assert(!empty()); }
    bool removeElement(int d) { return false; }
    bool contains(int d) const { return false; }
    int length() const { return 0; }
    void print() const { cout << "[]" << endl; }
    void clear() {}

private:
    Node* head = nullptr;
};

int main() {
    List l;
    int m;
    cin >> m;
    for (int i = 0; i < m; i++) {
        string cmd;
        int x;
        cin >> cmd;
        if (cmd == "addFirst") { cin >> x; l.addFirst(x); }
        else if (cmd == "addLast") { cin >> x; l.addLast(x); }
        else if (cmd == "removeFirst") l.removeFirst();
        else if (cmd == "removeLast") l.removeLast();
        else if (cmd == "remove") { cin >> x; cout << l.removeElement(x) << endl; }
        else if (cmd == "contains") { cin >> x; cout << l.contains(x) << endl; }
        else if (cmd == "length") cout << l.length() << endl;
        else if (cmd == "print") l.print();
    }
    return 0;
}
