#include <stdio.h>

int main(void) {
    double uin, r1, r2;
    scanf("%lf %lf %lf", &uin, &r1, &r2);
    // Samma ström går genom båda, så spänningen delas i proportion till resistansen.
    double uut = uin * r2 / (r1 + r2);
    printf("Uut = %.2f V\n", uut);
    return 0;
}
