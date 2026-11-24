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
    int velocity = 0;   // TODO: medelvärdet, avrundat nedåt
    printf("Velocity: %d\n", velocity);

    int n, planned = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        char story[32];
        int points;
        scanf("%31s %d", story, &points);
        // TODO: "för stor, bryt ner", "ogiltig estimering", "med" eller "får inte plats"
        printf("%s: med (%d p)\n", story, points);
    }
    printf("Planerat %d av %d p\n", planned, velocity);
    return 0;
}
