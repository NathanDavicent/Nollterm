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
        if (result == "Skip") notRun.push_back(id);
        else if (result == "Fail" && severity == "Blocker") blockers.push_back(id);
        else if (result == "Fail" && severity == "Major") majors.push_back(id);
    }
    bool allRun = notRun.empty();
    bool covOk = coverage >= target;
    cout << "Alla testfall körda: " << (allRun ? "ja" : "nej") << show(notRun) << "\n";
    cout << "Öppna blockers: " << blockers.size() << show(blockers) << "\n";
    cout << "Öppna major: " << majors.size() << show(majors) << "\n";
    cout << "Kodtäckning: " << coverage << " % (mål " << target << " %): " << (covOk ? "ja" : "nej") << "\n";
    cout << "Release: " << (allRun && blockers.empty() && covOk ? "ja" : "nej") << "\n";   // alla exit-kriterier
}
