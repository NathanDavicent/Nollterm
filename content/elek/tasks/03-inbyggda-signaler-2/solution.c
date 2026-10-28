#include <stdio.h>

int main(void) {
    int procent;
    scanf("%d", &procent);
    // 8 bitars PWM: 0 = alltid av, 255 = alltid på. +50 gör att heltalsdivisionen avrundar.
    int varde = (procent * 255 + 50) / 100;
    printf("analogWrite: %d\n", varde);
    return 0;
}
