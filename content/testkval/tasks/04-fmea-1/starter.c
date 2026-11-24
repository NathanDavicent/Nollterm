#include <stdio.h>

typedef struct {
    char name[32];
    int p, i, d;
} Risk;

int rpn(const Risk *r) {
    return 0;   // TODO: P x I x D
}

int main(void) {
    Risk risks[32];
    int n;
    scanf("%d", &n);
    for (int k = 0; k < n; k++) scanf("%31s %d %d %d", risks[k].name, &risks[k].p, &risks[k].i, &risks[k].d);

    // TODO: sortera med högst RPN först. Lika RPN ska behålla ordningen (insättningssortering är stabil).

    for (int k = 0; k < n; k++)
        printf("%d. %s: %d x %d x %d = %d\n", k + 1, risks[k].name, risks[k].p, risks[k].i, risks[k].d, rpn(&risks[k]));
    printf("Testa först: ");
    for (int k = 0; k < n && k < 3; k++) printf(k ? ", %s" : "%s", risks[k].name);
    printf("\n");
    return 0;
}
