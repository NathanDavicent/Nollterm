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

// TODO: implementera funktionerna
Node* bst_insert(Node* root, int x) { return root; }   // returnerar (ev. ny) rot
void print_inorder(Node* root) {}
void print_preorder(Node* root) {}
void print_postorder(Node* root) {}
int tree_height(Node* root) { return 0; }              // i kanter, tomt träd = -1
int tree_count_leaves(Node* root) { return 0; }
void tree_destroy(Node* root) {}

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
