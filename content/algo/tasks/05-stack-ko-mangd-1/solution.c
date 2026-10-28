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

char opening(char close) {
    if (close == ')') return '(';
    if (close == ']') return '[';
    return '{';
}

int main(void) {
    char line[MAX];
    if (!fgets(line, sizeof line, stdin)) return 0;
    Stack s = { .top = 0 };
    int ok = 1;
    for (int i = 0; line[i] != '\0' && ok; i++) {
        char c = line[i];
        if (c == '(' || c == '[' || c == '{') {
            push(&s, c);
        } else if (c == ')' || c == ']' || c == '}') {
            // Den senast öppnade måste stängas först: LIFO.
            if (isEmpty(&s) || pop(&s) != opening(c)) ok = 0;
        }
    }
    if (!isEmpty(&s)) ok = 0;   // något öppnades men stängdes aldrig
    printf("%s\n", ok ? "OK" : "FEL");
    return 0;
}
