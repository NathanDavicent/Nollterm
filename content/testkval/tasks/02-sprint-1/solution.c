#include <stdio.h>

int isFib(int p) {
    return p == 1 || p == 2 || p == 3 || p == 5 || p == 8;
}

int main(void) {
    int k, sum = 0;
    scanf("%d", &k);
    for (int i = 0; i < k; i++) {
        int v;
        scanf("%d", &v);
        sum += v;
    }
    int velocity = sum / k;   // heltalsdivision avrundar nedåt
    printf("Velocity: %d\n", velocity);

    int n, planned = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        char story[32];
        int points;
        scanf("%31s %d", story, &points);
        if (points >= 13) {
            printf("%s: för stor, bryt ner (%d p)\n", story, points);
        } else if (!isFib(points)) {
            printf("%s: ogiltig estimering (%d p)\n", story, points);
        } else if (planned + points <= velocity) {
            planned += points;
            printf("%s: med (%d p)\n", story, points);
        } else {
            printf("%s: får inte plats (%d p)\n", story, points);
        }
    }
    printf("Planerat %d av %d p\n", planned, velocity);
    return 0;
}
