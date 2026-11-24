#include <stdio.h>

int main(void) {
    int total, days;
    scanf("%d %d", &total, &days);
    int left = total;
    for (int day = 1; day <= days; day++) {
        int done;
        scanf("%d", &done);
        left -= done;
        double ideal = 0.0;   // TODO: rak linje från total till 0
        printf("Dag %d: kvar %d, ideal %.1f\n", day, left, ideal);
        // TODO: skriv " (efter)" i slutet av raden om left > ideal
    }
    // TODO: "Sprintmålet nått" eller "Kvar vid sprintslut: X p"
    return 0;
}
