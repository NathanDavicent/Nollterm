#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    for (int k = 0; k < n; k++) {
        int lo, hi;
        scanf("%d %d", &lo, &hi);
        printf("Intervall %d..%d\n", lo, hi);
        int values[6] = {lo - 1, lo, lo + 1, hi - 1, hi, hi + 1};   // strax under, på, strax över
        for (int i = 0; i < 6; i++) {
            int ok = values[i] >= lo && values[i] <= hi;
            printf("  %d: %s\n", values[i], ok ? "giltig" : "ogiltig");
        }
    }
    return 0;
}
