#include <stdio.h>

typedef struct {
    char name[32];
    int bugs, lines;
} Module;

double density(int bugs, int lines) {
    return 0.0;   // TODO: defekter per tusen rader, tänk på parenteserna
}

int main(void) {
    Module m[32];
    int n, totalBugs = 0, totalLines = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%31s %d %d", m[i].name, &m[i].bugs, &m[i].lines);
        totalBugs += m[i].bugs;
        totalLines += m[i].lines;
    }
    double total = density(totalBugs, totalLines);
    // TODO: sortera med högst densitet först och markera moduler över totalen
    for (int i = 0; i < n; i++) printf("%s: %.1f per KLOC\n", m[i].name, density(m[i].bugs, m[i].lines));
    printf("Totalt: %.1f per KLOC\n", total);
    return 0;
}
