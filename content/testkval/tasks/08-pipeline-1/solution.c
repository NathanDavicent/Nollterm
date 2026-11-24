#include <stdio.h>
#include <string.h>

const char *STAGES[] = {"Build", "Lint", "Test", "Artifact"};

int main(void) {
    char results[4][8];
    int approvals;
    for (int i = 0; i < 4; i++) scanf("%7s", results[i]);
    scanf("%d", &approvals);

    int failedAt = -1;
    for (int i = 0; i < 4; i++) {
        if (failedAt >= 0) {
            printf("%s: hoppas över\n", STAGES[i]);   // pipelinen stannar vid första fel
        } else {
            printf("%s: %s\n", STAGES[i], results[i]);
            if (strcmp(results[i], "fail") == 0) failedAt = i;
        }
    }
    if (failedAt >= 0) printf("Pipeline: röd (stannade vid %s)\n", STAGES[failedAt]);
    else printf("Pipeline: grön\n");

    if (failedAt >= 0) printf("Merge: nej (röd pipeline)\n");
    else if (approvals < 1) printf("Merge: nej (ingen godkänd granskning)\n");
    else printf("Merge: ja\n");
    return 0;
}
