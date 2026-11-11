#include <stdio.h>

#define RED_S     5
#define YELLOW_S  2
#define GREEN_S   5
#define CYCLE_S   (RED_S + YELLOW_S + GREEN_S + YELLOW_S)   // 14 s

// Cykeln: röd 5 s, gul 2 s, grön 5 s, gul 2 s, sedan om från början.
const char* lightAt(int t) {
    int p = t % CYCLE_S;                       // var i cykeln vi är
    if (p < RED_S) return "RÖD";
    if (p < RED_S + YELLOW_S) return "GUL";
    if (p < RED_S + YELLOW_S + GREEN_S) return "GRÖN";
    return "GUL";
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
