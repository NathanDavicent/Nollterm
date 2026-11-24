#include <stdio.h>
#include <stdlib.h>
#include <string.h>

const char *NAMES[] = {"air_temperature_k", "process_temperature_k", "rotational_speed_rpm",
                       "torque_nm", "tool_wear_min", "machine_failure"};

// Läser ett tal. Returnerar 0 om texten inte är ett tal (som errors="coerce").
int toNumber(const char *text, double *out) {
    char *end;
    *out = strtod(text, &end);
    return end != text && *end == '\0';
}

// Returnerar index för första kolumnen som inte klarar kontrollen, eller -1.
int firstProblem(const double v[6], const int ok[6]) {
    if (!ok[0] || v[0] < 250 || v[0] > 350) return 0;
    if (!ok[1] || v[1] < 250 || v[1] > 400) return 1;
    if (!ok[2] || v[2] <= 0) return 2;
    if (!ok[3] || v[3] < 0) return 3;
    if (!ok[4] || v[4] < 0) return 4;
    if (!ok[5] || (v[5] != 0 && v[5] != 1)) return 5;
    return -1;
}

int main(void) {
    int n;
    char lines[100][128];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%127s", lines[i]);

    int duplicates = 0, invalid = 0, clean = 0, failures = 0;
    for (int i = 0; i < n; i++) {
        int seen = 0;
        for (int j = 0; j < i; j++) {
            if (strcmp(lines[i], lines[j]) == 0) seen = 1;   // samma rad tidigare = dubblett
        }
        if (seen) { duplicates++; continue; }

        char copy[128];
        strcpy(copy, lines[i]);                  // strtok ändrar strängen
        char *udi = strtok(copy, ",");
        strtok(NULL, ",");                       // type
        double v[6];
        int ok[6];
        for (int k = 0; k < 6; k++) ok[k] = toNumber(strtok(NULL, ","), &v[k]);

        int p = firstProblem(v, ok);
        if (p >= 0) {
            invalid++;
            printf("Ogiltig rad %s: %s\n", udi, NAMES[p]);
        } else {
            clean++;
            failures += (int)v[5];
        }
    }
    printf("Rader: %d\nDubbletter: %d\nOgiltiga: %d\nRena rader: %d\nMaskinfel: %d\n", n, duplicates, invalid, clean, failures);
    printf("Felandel: %.2f %%\n", 100.0 * failures / clean);
    return 0;
}
