#include <stdio.h>

int my_strlen(const char* str) {
    int len = 0;
    while (*str != '\0') {
        len++;
        str++;
    }
    return len;
}

int main() {
    char buf[64];
    scanf("%s", buf);
    printf("%d\n", my_strlen(buf));
    return 0;
}
