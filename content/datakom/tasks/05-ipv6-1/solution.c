#include <stdio.h>
#include <string.h>

// Läser grupper separerade med ':' från text till out. Returnerar antalet grupper.
int parseGroups(const char *text, unsigned int out[8]) {
    int count = 0;
    unsigned int value = 0;
    int digits = 0;
    for (int i = 0; ; i++) {
        char ch = text[i];
        if (ch == ':' || ch == '\0') {
            if (digits > 0) out[count++] = value;
            value = 0;
            digits = 0;
            if (ch == '\0') break;
        } else {
            int v = (ch >= '0' && ch <= '9') ? ch - '0' : (ch | 32) - 'a' + 10;   // | 32 gör A-F till a-f
            value = value * 16 + v;
            digits++;
        }
    }
    return count;
}

void expand(const char *addr, unsigned int groups[8]) {
    char head[64], tail[64];
    const char *gap = strstr(addr, "::");
    for (int i = 0; i < 8; i++) groups[i] = 0;
    if (gap == NULL) {
        parseGroups(addr, groups);
        return;
    }
    int headLen = (int)(gap - addr);
    strncpy(head, addr, headLen);
    head[headLen] = '\0';
    strcpy(tail, gap + 2);

    unsigned int left[8], right[8];
    int nl = parseGroups(head, left);
    int nr = parseGroups(tail, right);
    for (int i = 0; i < nl; i++) groups[i] = left[i];
    for (int i = 0; i < nr; i++) groups[8 - nr + i] = right[i];   // resten är redan nollor
}

void printLong(const unsigned int g[8]) {
    for (int i = 0; i < 8; i++) printf(i ? ":%04x" : "%04x", g[i]);
    printf("\n");
}

void printShort(const unsigned int g[8]) {
    int bestStart = -1, bestLen = 0;
    for (int i = 0; i < 8; ) {
        if (g[i] == 0) {
            int j = i;
            while (j < 8 && g[j] == 0) j++;
            if (j - i > bestLen) { bestStart = i; bestLen = j - i; }   // > gör att den vänstra vinner
            i = j;
        } else {
            i++;
        }
    }
    if (bestLen < 2) {                     // en ensam nollgrupp förkortas inte
        for (int i = 0; i < 8; i++) printf(i ? ":%x" : "%x", g[i]);
        printf("\n");
        return;
    }
    for (int i = 0; i < bestStart; i++) printf(i ? ":%x" : "%x", g[i]);
    printf("::");
    for (int i = bestStart + bestLen; i < 8; i++) printf(i > bestStart + bestLen ? ":%x" : "%x", g[i]);
    printf("\n");
}

int main(void) {
    int n;
    scanf("%d", &n);
    for (int k = 0; k < n; k++) {
        char addr[64];
        unsigned int groups[8];
        scanf("%63s", addr);
        expand(addr, groups);
        printLong(groups);
        printShort(groups);
    }
    return 0;
}
