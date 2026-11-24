#include <stdio.h>

unsigned int maskOf(int prefix) {
    return prefix == 0 ? 0u : 0xFFFFFFFFu << (32 - prefix);   // << 32 är odefinierat i C
}

int main(void) {
    unsigned int nets[16];
    int prefixes[16];
    char hops[16][16];
    char texts[16][24];
    int m, k;
    scanf("%d", &m);
    for (int i = 0; i < m; i++) {
        unsigned int a, b, c, d;
        scanf("%u.%u.%u.%u/%d %15s", &a, &b, &c, &d, &prefixes[i], hops[i]);
        nets[i] = (a << 24) | (b << 16) | (c << 8) | d;
        sprintf(texts[i], "%u.%u.%u.%u/%d", a, b, c, d, prefixes[i]);
    }
    scanf("%d", &k);
    for (int j = 0; j < k; j++) {
        unsigned int a, b, c, d;
        scanf("%u.%u.%u.%u", &a, &b, &c, &d);
        unsigned int dest = (a << 24) | (b << 16) | (c << 8) | d;
        int best = -1;
        // TODO: hitta den route som matchar (dest & mask == nät) och har längst prefix
        printf("%u.%u.%u.%u -> ", a, b, c, d);
        if (best < 0) printf("droppas\n");
        else printf("%s (via %s)\n", hops[best], texts[best]);
    }
    return 0;
}
