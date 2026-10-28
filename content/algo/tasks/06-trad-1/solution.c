#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node* left;
    struct Node* right;
} Node;

Node* node_create(int value) {
    Node* n = malloc(sizeof(Node));
    n->value = value;
    n->left = n->right = NULL;
    return n;
}

// Returnerar (ev. ny) rot, så att anroparen kan koppla in den nya noden.
Node* bst_insert(Node* root, int x) {
    if (root == NULL) return node_create(x);
    if (x < root->value) root->left = bst_insert(root->left, x);
    else if (x > root->value) root->right = bst_insert(root->right, x);
    return root;   // lika: inga dubbletter
}

void print_inorder(Node* root) {       // vänster, nod, höger: sorterat i ett BST
    if (root == NULL) return;
    print_inorder(root->left);
    printf(" %d", root->value);
    print_inorder(root->right);
}

void print_preorder(Node* root) {      // nod, vänster, höger: roten först
    if (root == NULL) return;
    printf(" %d", root->value);
    print_preorder(root->left);
    print_preorder(root->right);
}

void print_postorder(Node* root) {     // vänster, höger, nod: roten sist
    if (root == NULL) return;
    print_postorder(root->left);
    print_postorder(root->right);
    printf(" %d", root->value);
}

int tree_height(Node* root) {          // i kanter, tomt träd = -1
    if (root == NULL) return -1;
    int l = tree_height(root->left), r = tree_height(root->right);
    return 1 + (l > r ? l : r);
}

int tree_count_leaves(Node* root) {
    if (root == NULL) return 0;
    if (root->left == NULL && root->right == NULL) return 1;
    return tree_count_leaves(root->left) + tree_count_leaves(root->right);
}

void tree_destroy(Node* root) {        // postorder: barnen först, annars tappar vi dem
    if (root == NULL) return;
    tree_destroy(root->left);
    tree_destroy(root->right);
    free(root);
}

int main(void) {
    int n, x;
    Node* root = NULL;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) { scanf("%d", &x); root = bst_insert(root, x); }
    printf("Inorder:"); print_inorder(root); printf("\n");
    printf("Preorder:"); print_preorder(root); printf("\n");
    printf("Postorder:"); print_postorder(root); printf("\n");
    printf("Höjd: %d\n", tree_height(root));
    printf("Löv: %d\n", tree_count_leaves(root));
    tree_destroy(root);
    return 0;
}
