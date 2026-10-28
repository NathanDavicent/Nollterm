#include <stdio.h>

int main(void) {
    int a, b, cin;
    scanf("%d %d %d", &a, &b, &cin);
    int sum = a ^ b ^ cin;                    // två XOR-grindar
    int cout = (a & b) | (cin & (a ^ b));     // två AND och en OR
    printf("Sum=%d Cout=%d\n", sum, cout);
    return 0;
}
