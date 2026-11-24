#include <stdio.h>

int main(void) {
    int total, days;
    scanf("%d %d", &total, &days);
    int left = total;
    for (int day = 1; day <= days; day++) {
        int done;
        scanf("%d", &done);
        left -= done;
        double ideal = total - (double)total * day / days;   // rak linje från total till 0
        printf("Dag %d: kvar %d, ideal %.1f%s\n", day, left, ideal, left > ideal ? " (efter)" : "");
    }
    if (left == 0) printf("Sprintmålet nått\n");
    else printf("Kvar vid sprintslut: %d p\n", left);
    return 0;
}
