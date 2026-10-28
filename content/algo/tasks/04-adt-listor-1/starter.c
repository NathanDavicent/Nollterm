#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>

typedef struct node {
    int d;
    struct node* rest;
} node;
typedef node* List;   // en tom lista är NULL

static node* createListNode(int d) {
    node* n = malloc(sizeof(node));
    if (n == NULL) return NULL;
    n->d = d;
    n->rest = NULL;
    return n;
}

int isEmpty(List l) { return l == NULL; }

// TODO: implementera funktionerna nedan
int addFirst(List* l, int d) { return 0; }
int addLast(List* l, int d) { return 0; }
void removeFirst(List* l) { assert(!isEmpty(*l)); }
void removeLast(List* l) { assert(!isEmpty(*l)); }
int removeElement(List* l, int d) { return 0; }
int isInList(List l, int d) { return 0; }
int lengthOfList(List l) { return 0; }
void printList(List l, FILE* stream) { fprintf(stream, "[]\n"); }
void clearList(List* l) { *l = NULL; }

int main(void) {
    List l = NULL;
    int m;
    scanf("%d", &m);
    for (int i = 0; i < m; i++) {
        char cmd[32];
        int x;
        scanf("%31s", cmd);
        if (strcmp(cmd, "addFirst") == 0) { scanf("%d", &x); addFirst(&l, x); }
        else if (strcmp(cmd, "addLast") == 0) { scanf("%d", &x); addLast(&l, x); }
        else if (strcmp(cmd, "removeFirst") == 0) removeFirst(&l);
        else if (strcmp(cmd, "removeLast") == 0) removeLast(&l);
        else if (strcmp(cmd, "remove") == 0) { scanf("%d", &x); printf("%d\n", removeElement(&l, x)); }
        else if (strcmp(cmd, "contains") == 0) { scanf("%d", &x); printf("%d\n", isInList(l, x)); }
        else if (strcmp(cmd, "length") == 0) printf("%d\n", lengthOfList(l));
        else if (strcmp(cmd, "print") == 0) printList(l, stdout);
    }
    clearList(&l);
    return 0;
}
