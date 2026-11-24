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
        scanf(" %c %lf %d", &t, &torque, &failure);   // mellanslaget hoppar över radbrytningen
        for (int k = 0; k < 3; k++) {
            if (TYPES[k] == t) {
                count[k]++;
                failures[k] += failure;
                torqueSum[k] += torque;
            }
        }
    }
    for (int k = 0; k < 3; k++) {
        if (count[k] == 0) continue;
        printf("%c: %d observationer, %d fel (%.2f %%), medelvridmoment %.2f Nm\n", TYPES[k], count[k],
               failures[k], 100.0 * failures[k] / count[k], torqueSum[k] / count[k]);
    }
    return 0;
}
