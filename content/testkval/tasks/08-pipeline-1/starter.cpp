#include <iostream>
#include <string>
using namespace std;

const string STAGES[] = {"Build", "Lint", "Test", "Artifact"};

int main() {
    string results[4];
    int approvals;
    for (auto& r : results) cin >> r;
    cin >> approvals;

    for (int i = 0; i < 4; i++) {
        // TODO: efter första "fail" ska resten skrivas som "hoppas över"
        cout << STAGES[i] << ": " << results[i] << "\n";
    }
    cout << "Pipeline: grön\n";   // TODO: "röd (stannade vid X)"
    cout << "Merge: ja\n";        // TODO: kräver grön pipeline och minst en godkänd granskning
}
