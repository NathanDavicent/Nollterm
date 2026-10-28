#include <stdio.h>

#define MAX 1000

// En mängd som en array utan dubbletter, sorterad så att utskriften blir i ordning.
typedef struct {
    int data[MAX];
    int size;
} Set;

int contains(const Set* s, int x) {
    for (int i = 0; i < s->size; i++)
        if (s->data[i] == x) return 1;
    return 0;
}

void add(Set* s, int x) {
    if (contains(s, x)) return;          // invarianten: inga dubbletter
    int i = s->size - 1;
    while (i >= 0 && s->data[i] > x) {   // som ett steg i insertion sort
        s->data[i + 1] = s->data[i];
        i--;
    }
    s->data[i + 1] = x;
    s->size++;
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
    for (int i = 0; i < a.size; i++) {
        add(&u, a.data[i]);
        if (contains(&b, a.data[i])) add(&snitt, a.data[i]);   // i både a och b
        else add(&diff, a.data[i]);                           // i a men inte b
    }
    for (int i = 0; i < b.size; i++) add(&u, b.data[i]);
    printSet("Union", &u);
    printSet("Snitt", &snitt);
    printSet("Differens", &diff);
    return 0;
}
