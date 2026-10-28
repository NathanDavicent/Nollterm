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

    void addFirst(int d) { head = new Node{d, head}; }   // O(1)

    void addLast(int d) {                                  // O(n)
        Node** p = &head;              // pekare till pekaren som ska ändras
        while (*p != nullptr) p = &(*p)->rest;
        *p = new Node{d, nullptr};
    }

    void removeFirst() {                                   // O(1)
        assert(!empty());
        Node* toRemove = head;
        head = head->rest;
        delete toRemove;
    }

    void removeLast() {                                    // O(n)
        assert(!empty());
        Node** p = &head;
        while ((*p)->rest != nullptr) p = &(*p)->rest;
        delete *p;
        *p = nullptr;
    }

    bool removeElement(int d) {                            // O(n)
        for (Node** p = &head; *p != nullptr; p = &(*p)->rest) {
            if ((*p)->d == d) {
                Node* toRemove = *p;
                *p = toRemove->rest;
                delete toRemove;
                return true;
            }
        }
        return false;
    }

    bool contains(int d) const {                           // O(n)
        for (Node* n = head; n != nullptr; n = n->rest)
            if (n->d == d) return true;
        return false;
    }

    int length() const {                                   // O(n)
        int count = 0;
        for (Node* n = head; n != nullptr; n = n->rest) count++;
        return count;
    }

    void print() const {
        cout << "[";
        for (Node* n = head; n != nullptr; n = n->rest) cout << n->d << (n->rest ? ", " : "");
        cout << "]" << endl;
    }

    void clear() {
        while (!empty()) removeFirst();
    }

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
