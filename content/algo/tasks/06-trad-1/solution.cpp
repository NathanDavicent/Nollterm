#include <iostream>
using namespace std;

struct Node {
    int value;
    Node* left = nullptr;
    Node* right = nullptr;
    explicit Node(int v) : value(v) {}
};

// Returnerar (ev. ny) rot, så att anroparen kan koppla in den nya noden.
Node* insert(Node* root, int x) {
    if (root == nullptr) return new Node(x);
    if (x < root->value) root->left = insert(root->left, x);
    else if (x > root->value) root->right = insert(root->right, x);
    return root;   // lika: inga dubbletter
}

void inorder(Node* root) {        // vänster, nod, höger: sorterat i ett BST
    if (!root) return;
    inorder(root->left);
    cout << " " << root->value;
    inorder(root->right);
}

void preorder(Node* root) {       // nod, vänster, höger: roten först
    if (!root) return;
    cout << " " << root->value;
    preorder(root->left);
    preorder(root->right);
}

void postorder(Node* root) {      // vänster, höger, nod: roten sist
    if (!root) return;
    postorder(root->left);
    postorder(root->right);
    cout << " " << root->value;
}

int height(Node* root) {          // i kanter, tomt träd = -1
    if (!root) return -1;
    int l = height(root->left), r = height(root->right);
    return 1 + (l > r ? l : r);
}

int leaves(Node* root) {
    if (!root) return 0;
    if (!root->left && !root->right) return 1;
    return leaves(root->left) + leaves(root->right);
}

void destroy(Node* root) {        // postorder: barnen först, annars tappar vi dem
    if (!root) return;
    destroy(root->left);
    destroy(root->right);
    delete root;
}

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
