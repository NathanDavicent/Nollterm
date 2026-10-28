#include <iostream>
using namespace std;

struct Node {
    int value;
    Node* left = nullptr;
    Node* right = nullptr;
    explicit Node(int v) : value(v) {}
};

// TODO: implementera funktionerna
Node* insert(Node* root, int x) { return root; }   // returnerar (ev. ny) rot
void inorder(Node* root) {}
void preorder(Node* root) {}
void postorder(Node* root) {}
int height(Node* root) { return 0; }               // i kanter, tomt träd = -1
int leaves(Node* root) { return 0; }
void destroy(Node* root) {}

int main() {
    int n, x;
    Node* root = nullptr;
    cin >> n;
    for (int i = 0; i < n; i++) { cin >> x; root = insert(root, x); }
    cout << "Inorder:"; inorder(root); cout << endl;
    cout << "Preorder:"; preorder(root); cout << endl;
    cout << "Postorder:"; postorder(root); cout << endl;
    cout << "Höjd: " << height(root) << endl;
    cout << "Löv: " << leaves(root) << endl;
    destroy(root);
    return 0;
}
