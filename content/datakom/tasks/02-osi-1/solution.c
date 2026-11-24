#include <stdio.h>
#include <string.h>

const char *TERMS[] = {"Bitar", "Kabel", "Radio", "Ramar", "MAC", "Switch", "Paket", "IP", "Router", "ICMP",
                       "Segment", "TCP", "UDP", "Inloggning", "JSON", "XML", "JPG", "TLS",
                       "HTTP", "HTTPS", "MQTT", "FTP", "DNS", "CoAP"};
const int LAYER[] = {1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7};
const int COUNT = 24;
const char *NAMES[] = {"", "Fysiska", "Datalänk", "Nätverk", "Transport", "Session", "Presentation", "Applikation"};

int layerOf(const char *term) {
    for (int i = 0; i < COUNT; i++) {
        if (strcmp(TERMS[i], term) == 0) return LAYER[i];   // strcmp ger 0 när strängarna är lika
    }
    return 0;
}

int main(void) {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        char term[32];
        scanf("%31s", term);
        int layer = layerOf(term);
        if (layer == 0) printf("%s: okänt\n", term);
        else printf("%s: lager %d (%s)\n", term, layer, NAMES[layer]);
    }
    return 0;
}
