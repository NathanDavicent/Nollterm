#include <stdio.h>

void printIp(unsigned int ip) {
    printf("%u.%u.%u.%u", (ip >> 24) & 255, (ip >> 16) & 255, (ip >> 8) & 255, ip & 255);
}

int main(void) {
    unsigned int a, b, c, d;
    int prefix, newPrefix;
    scanf("%u.%u.%u.%u/%d %d", &a, &b, &c, &d, &prefix, &newPrefix);
    unsigned int start = (a << 24) | (b << 16) | (c << 8) | d;

    unsigned int count = 1u << (newPrefix - prefix);   // varje lånad bit dubblar antalet
    unsigned int size = 1u << (32 - newPrefix);        // adresser per subnät
    printf("%u subnät med %u värdar var\n", count, size - 2);
    for (unsigned int i = 0; i < count; i++) {
        unsigned int first = start + i * size;
        unsigned int last = first + size - 1;          // broadcast
        printIp(first); printf("/%d: värdar ", newPrefix);
        printIp(first + 1); printf(" - "); printIp(last - 1);
        printf(", broadcast "); printIp(last); printf("\n");
    }
    return 0;
}
