#include <iostream>
#include <string>
#include <vector>
using namespace std;

string show(const vector<string>& ids) {
    if (ids.empty()) return "";
    string s = " (";
    for (size_t i = 0; i < ids.size(); i++) s += (i ? ", " : "") + ids[i];
    return s + ")";
}

int main() {
    int target, coverage, n;
    cin >> target >> coverage >> n;
    vector<string> notRun, blockers, majors;
    for (int i = 0; i < n; i++) {
        string id, result, severity;
        cin >> id >> result >> severity;
        // TODO: lägg id i notRun (Skip), blockers (Fail + Blocker) eller majors (Fail + Major)
    }
    bool allRun = true;   // TODO
    bool covOk = true;    // TODO
    cout << "Alla testfall körda: " << (allRun ? "ja" : "nej") << show(notRun) << "\n";
    cout << "Öppna blockers: " << blockers.size() << show(blockers) << "\n";
    cout << "Öppna major: " << majors.size() << show(majors) << "\n";
    cout << "Kodtäckning: " << coverage << " % (mål " << target << " %): " << (covOk ? "ja" : "nej") << "\n";
    cout << "Release: ja\n";   // TODO
}
