#include <stdio.h>
#include <string.h>

void show(int count, char ids[][16]) {
    if (count == 0) return;
    printf(" (");
    for (int i = 0; i < count; i++) printf(i ? ", %s" : "%s", ids[i]);
    printf(")");
}

int main(void) {
    int target, coverage, n;
    scanf("%d %d %d", &target, &coverage, &n);
    char notRun[32][16], blockers[32][16], majors[32][16];
    int nNotRun = 0, nBlockers = 0, nMajors = 0;
    for (int i = 0; i < n; i++) {
        char id[16], result[16], severity[16];
        scanf("%15s %15s %15s", id, result, severity);
        // TODO: lägg id i notRun (Skip), blockers (Fail + Blocker) eller majors (Fail + Major)
    }
    int allRun = 1;   // TODO
    int covOk = 1;    // TODO
    printf("Alla testfall körda: %s", allRun ? "ja" : "nej"); show(nNotRun, notRun); printf("\n");
    printf("Öppna blockers: %d", nBlockers); show(nBlockers, blockers); printf("\n");
    printf("Öppna major: %d", nMajors); show(nMajors, majors); printf("\n");
    printf("Kodtäckning: %d %% (mål %d %%): %s\n", coverage, target, covOk ? "ja" : "nej");
    printf("Release: ja\n");   // TODO
    return 0;
}
