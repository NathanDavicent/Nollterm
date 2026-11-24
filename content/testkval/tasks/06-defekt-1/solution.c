#include <stdio.h>

typedef struct {
    char name[32];
    int bugs, lines;
} Module;

double density(int bugs, int lines) {
    return bugs / (lines / 1000.0);   // inte bugs / lines / 1000
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

    for (int i = 1; i < n; i++) {   // insättningssortering, fallande och stabil
        Module cur = m[i];
        int j = i - 1;
        while (j >= 0 && density(m[j].bugs, m[j].lines) < density(cur.bugs, cur.lines)) {
            m[j + 1] = m[j];
            j--;
        }
        m[j + 1] = cur;
    }
    for (int i = 0; i < n; i++) {
        double d = density(m[i].bugs, m[i].lines);
        printf("%s: %.1f per KLOC%s\n", m[i].name, d, d > total ? "  <- över snittet, extra granskning" : "");
    }
    printf("Totalt: %.1f per KLOC\n", total);
    return 0;
}
