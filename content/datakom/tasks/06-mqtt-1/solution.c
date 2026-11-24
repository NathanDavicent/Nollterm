#include <stdio.h>
#include <string.h>

// Delar upp en topic i nivåer. Returnerar antalet nivåer.
int split(const char *topic, char levels[16][32]) {
    int count = 0, len = 0;
    for (int i = 0; ; i++) {
        if (topic[i] == '/' || topic[i] == '\0') {
            levels[count][len] = '\0';
            count++;
            len = 0;
            if (topic[i] == '\0') break;
        } else {
            levels[count][len++] = topic[i];
        }
    }
    return count;
}

int matches(const char *filter, const char *topic) {
    char f[16][32], t[16][32];
    int nf = split(filter, f);
    int nt = split(topic, t);
    for (int i = 0; i < nf; i++) {
        if (strcmp(f[i], "#") == 0) return 1;                     // resten matchar
        if (i >= nt) return 0;                                    // topicen tog slut
        if (strcmp(f[i], "+") != 0 && strcmp(f[i], t[i]) != 0) return 0;
    }
    return nf == nt;
}

int main(void) {
    char filter[128];
    int n;
    scanf("%127s %d", filter, &n);
    for (int i = 0; i < n; i++) {
        char topic[128];
        scanf("%127s", topic);
        printf("%s: %s\n", topic, matches(filter, topic) ? "ja" : "nej");
    }
    return 0;
}
