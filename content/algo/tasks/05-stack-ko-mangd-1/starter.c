#include <stdio.h>
#include <string.h>

#define MAX 1000

// En enkel stack i en array.
typedef struct {
    char data[MAX];
    int top;   // antal element
} Stack;

void push(Stack* s, char c) { s->data[s->top++] = c; }
char pop(Stack* s) { return s->data[--s->top]; }
int isEmpty(const Stack* s) { return s->top == 0; }

int main(void) {
    char line[MAX];
    if (!fgets(line, sizeof line, stdin)) return 0;
    Stack s = { .top = 0 };
    int ok = 1;
    // TODO: gå igenom raden. Öppnande parentes: push. Stängande: pop och kontrollera att de matchar.
    printf("%s\n", ok ? "OK" : "FEL");
    return 0;
}
