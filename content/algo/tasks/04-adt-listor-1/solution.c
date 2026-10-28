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

// O(1): ny nod först, och huvudet pekar på den. Därför List* (dubbelpekare).
int addFirst(List* l, int d) {
    node* n = createListNode(d);
    if (n == NULL) return 0;
    n->rest = *l;
    *l = n;
    return 1;
}

// O(n): gå till sista noden. Rekursivt: är listan tom läggs noden först, annars i resten.
int addLast(List* l, int d) {
    if (isEmpty(*l)) return addFirst(l, d);
    return addLast(&(*l)->rest, d);
}

// O(1)
void removeFirst(List* l) {
    assert(!isEmpty(*l));   // precondition
    node* toRemove = *l;
    *l = (*l)->rest;
    free(toRemove);
}

// O(n)
void removeLast(List* l) {
    assert(!isEmpty(*l));
    if ((*l)->rest == NULL) removeFirst(l);
    else removeLast(&(*l)->rest);
}

// O(n): första förekomsten. Med dubbelpekare blir första, mitten och sista samma fall.
int removeElement(List* l, int d) {
    if (isEmpty(*l)) return 0;
    if ((*l)->d == d) {
        removeFirst(l);
        return 1;
    }
    return removeElement(&(*l)->rest, d);
}

// O(n)
int isInList(List l, int d) {
    for (; l != NULL; l = l->rest)
        if (l->d == d) return 1;
    return 0;
}

// O(n)
int lengthOfList(List l) {
    int n = 0;
    for (; l != NULL; l = l->rest) n++;
    return n;
}

void printList(List l, FILE* stream) {
    fprintf(stream, "[");
    for (node* n = l; n != NULL; n = n->rest)
        fprintf(stream, "%d%s", n->d, n->rest ? ", " : "");
    fprintf(stream, "]\n");
}

void clearList(List* l) {
    while (!isEmpty(*l)) removeFirst(l);
    assert(isEmpty(*l));   // postcondition
}

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
