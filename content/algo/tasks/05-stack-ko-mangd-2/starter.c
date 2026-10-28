#include <stdio.h>

#define MAX 1000

// En mängd som en array utan dubbletter, sorterad så att utskriften blir i ordning.
typedef struct {
    int data[MAX];
    int size;
} Set;

int contains(const Set* s, int x) {
    // TODO
    return 0;
}

void add(Set* s, int x) {
    // TODO: lägg till om x inte redan finns, och håll mängden sorterad
}

void printSet(const char* label, const Set* s) {
    printf("%s:", label);
    for (int i = 0; i < s->size; i++) printf(" %d", s->data[i]);
    printf("\n");
}

int main(void) {
    Set a = { .size = 0 }, b = { .size = 0 }, u = { .size = 0 }, snitt = { .size = 0 }, diff = { .size = 0 };
    int n, x;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) { scanf("%d", &x); add(&a, x); }
    scanf("%d", &n);
    for (int i = 0; i < n; i++) { scanf("%d", &x); add(&b, x); }
    // TODO: fyll u (union), snitt (intersection) och diff (a minus b)
    printSet("Union", &u);
    printSet("Snitt", &snitt);
    printSet("Differens", &diff);
    return 0;
}
