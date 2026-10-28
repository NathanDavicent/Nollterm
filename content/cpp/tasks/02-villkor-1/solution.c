#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    if (n > 0) {
        printf("positivt\n");
    } else if (n < 0) {
        printf("negativt\n");
    } else {
        printf("noll\n");
    }
    return 0;
}
