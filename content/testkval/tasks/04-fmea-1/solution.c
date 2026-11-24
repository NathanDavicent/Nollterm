#include <stdio.h>

typedef struct {
    char name[32];
    int p, i, d;
} Risk;

int rpn(const Risk *r) {
    return r->p * r->i * r->d;
}

int main(void) {
    Risk risks[32];
    int n;
    scanf("%d", &n);
    for (int k = 0; k < n; k++) scanf("%31s %d %d %d", risks[k].name, &risks[k].p, &risks[k].i, &risks[k].d);

    // Insättningssortering, fallande. Strikt < gör att lika RPN behåller ordningen.
    for (int k = 1; k < n; k++) {
        Risk cur = risks[k];
        int j = k - 1;
        while (j >= 0 && rpn(&risks[j]) < rpn(&cur)) {
            risks[j + 1] = risks[j];
            j--;
        }
        risks[j + 1] = cur;
    }

    for (int k = 0; k < n; k++)
        printf("%d. %s: %d x %d x %d = %d\n", k + 1, risks[k].name, risks[k].p, risks[k].i, risks[k].d, rpn(&risks[k]));
    printf("Testa först: ");
    for (int k = 0; k < n && k < 3; k++) printf(k ? ", %s" : "%s", risks[k].name);
    printf("\n");
    return 0;
}
