#include <stdio.h>

int main(void) {
    int y;
    scanf("%d", &y);
    if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
        printf("ja\n");
    } else {
        printf("nej\n");
    }
    return 0;
}
