#include <iostream>
#include <string>
using namespace std;

const string STAGES[] = {"Build", "Lint", "Test", "Artifact"};

int main() {
    string results[4];
    int approvals;
    for (auto& r : results) cin >> r;
    cin >> approvals;

    int failedAt = -1;
    for (int i = 0; i < 4; i++) {
        if (failedAt >= 0) {
            cout << STAGES[i] << ": hoppas över\n";   // pipelinen stannar vid första fel
        } else {
            cout << STAGES[i] << ": " << results[i] << "\n";
            if (results[i] == "fail") failedAt = i;
        }
    }
    if (failedAt >= 0) cout << "Pipeline: röd (stannade vid " << STAGES[failedAt] << ")\n";
    else cout << "Pipeline: grön\n";

    if (failedAt >= 0) cout << "Merge: nej (röd pipeline)\n";
    else if (approvals < 1) cout << "Merge: nej (ingen godkänd granskning)\n";
    else cout << "Merge: ja\n";
}
