#include <stdio.h>

// Cykeln: röd 5 s, gul 2 s, grön 5 s, gul 2 s, sedan om från början.
const char* lightAt(int t) {
    // TODO
    return "?";
}

int main(void) {
    int q;
    scanf("%d", &q);
    for (int i = 0; i < q; i++) {
        int t;
        scanf("%d", &t);
        printf("t=%d: %s\n", t, lightAt(t));
    }
    return 0;
}
