#include <stdio.h>

void printIp(unsigned int ip) {
    printf("%u.%u.%u.%u", (ip >> 24) & 255, (ip >> 16) & 255, (ip >> 8) & 255, ip & 255);
}

int main(void) {
    unsigned int a, b, c, d;
    int prefix;
    scanf("%u.%u.%u.%u/%d", &a, &b, &c, &d, &prefix);
    unsigned int ip = (a << 24) | (b << 16) | (c << 8) | d;

    unsigned int mask = 0xFFFFFFFFu << (32 - prefix);   // prefix ettor, resten nollor
    unsigned int network = ip & mask;                    // nätverksdelen
    unsigned int broadcast = network | ~mask;            // alla värdbitar satta

    printf("Nätverk: "); printIp(network); printf("/%d\n", prefix);
    printf("Mask: "); printIp(mask); printf("\n");
    printf("Broadcast: "); printIp(broadcast); printf("\n");
    printf("Första värd: "); printIp(network + 1); printf("\n");
    printf("Sista värd: "); printIp(broadcast - 1); printf("\n");
    printf("Antal värdar: %u\n", (1u << (32 - prefix)) - 2);
    return 0;
}
