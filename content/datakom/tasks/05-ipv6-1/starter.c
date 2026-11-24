#include <stdio.h>
#include <string.h>

// Läser en IPv6-adress till 8 grupper.
void expand(const char *addr, unsigned int groups[8]) {
    // TODO: hantera "::". Nu läses bara adresser som redan har 8 grupper.
    for (int i = 0; i < 8; i++) groups[i] = 0;
    sscanf(addr, "%x:%x:%x:%x:%x:%x:%x:%x", &groups[0], &groups[1], &groups[2], &groups[3],
           &groups[4], &groups[5], &groups[6], &groups[7]);
}

void printLong(const unsigned int g[8]) {
    for (int i = 0; i < 8; i++) printf(i ? ":%04x" : "%04x", g[i]);
    printf("\n");
}

void printShort(const unsigned int g[8]) {
    // TODO: ersätt den längsta serien (minst två) nollgrupper med "::"
    for (int i = 0; i < 8; i++) printf(i ? ":%x" : "%x", g[i]);
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
