#include <stdio.h>
#include <ctype.h>

int countVowels(const char* s) {
    int c = 0;
    for (; *s; s++) {
        char ch = tolower(*s);
        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u' || ch == 'y')
            c++;
    }
    return c;
}

int main() {
    char buf[64];
    scanf("%s", buf);
    printf("%d\n", countVowels(buf));
    return 0;
}
