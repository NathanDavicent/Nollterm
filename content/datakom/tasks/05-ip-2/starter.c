#include <stdio.h>

void printIp(unsigned int ip) {
    printf("%u.%u.%u.%u", (ip >> 24) & 255, (ip >> 16) & 255, (ip >> 8) & 255, ip & 255);
}

int main(void) {
    unsigned int a, b, c, d;
    int prefix, newPrefix;
    scanf("%u.%u.%u.%u/%d %d", &a, &b, &c, &d, &prefix, &newPrefix);
    unsigned int start = (a << 24) | (b << 16) | (c << 8) | d;

    unsigned int count = 0;   // TODO: antal subnät
    unsigned int size = 0;    // TODO: adresser per subnät
    printf("%u subnät med %u värdar var\n", count, size - 2);
    for (unsigned int i = 0; i < count; i++) {
        unsigned int first = start + i * size;
        // TODO: skriv "<nät>/<nytt prefix>: värdar <första> - <sista>, broadcast <broadcast>"
    }
    return 0;
}
