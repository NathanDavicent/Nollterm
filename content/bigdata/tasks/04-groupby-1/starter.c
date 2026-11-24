#include <stdio.h>

int main(void) {
    const char TYPES[3] = {'H', 'L', 'M'};   // i bokstavsordning
    int count[3] = {0}, failures[3] = {0};
    double torqueSum[3] = {0};
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        char t;
        double torque;
        int failure;
        scanf(" %c %lf %d", &t, &torque, &failure);
        // TODO: hitta typens index och uppdatera count, failures och torqueSum
    }
    for (int k = 0; k < 3; k++) {
        if (count[k] == 0) continue;
        // TODO: skriv även fel, felandel och medelvridmoment
        printf("%c: %d observationer\n", TYPES[k], count[k]);
    }
    return 0;
}
