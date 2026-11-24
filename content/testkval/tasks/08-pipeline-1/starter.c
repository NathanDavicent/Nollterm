#include <stdio.h>
#include <string.h>

const char *STAGES[] = {"Build", "Lint", "Test", "Artifact"};

int main(void) {
    char results[4][8];
    int approvals;
    for (int i = 0; i < 4; i++) scanf("%7s", results[i]);
    scanf("%d", &approvals);

    for (int i = 0; i < 4; i++) {
        // TODO: efter första "fail" ska resten skrivas som "hoppas över"
        printf("%s: %s\n", STAGES[i], results[i]);
    }
    printf("Pipeline: grön\n");   // TODO: "röd (stannade vid X)"
    printf("Merge: ja\n");        // TODO: kräver grön pipeline och minst en godkänd granskning
    return 0;
}
