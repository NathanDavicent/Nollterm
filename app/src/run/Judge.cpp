#include "Judge.h"

namespace nt {

std::string normalizeOutput(const std::string& text) {
    std::string out, line;
    for (char c : text) {
        if (c == '\r') continue;
        if (c == '\n') {
            while (!line.empty() && (line.back() == ' ' || line.back() == '\t')) line.pop_back();
            out += line + "\n";
            line.clear();
        } else {
            line.push_back(c);
        }
    }
    while (!line.empty() && (line.back() == ' ' || line.back() == '\t')) line.pop_back();
    out += line;
    while (!out.empty() && out.back() == '\n') out.pop_back();
    return out;
}

std::vector<TestResult> runTests(const LanguageRunner& runner, const std::string& code,
                                 const std::vector<TestCase>& tests, int timeoutMs) {
    std::vector<TestResult> results;
    BuildResult build = runner.build(code);  // kompilera EN gång, kör sedan flera gånger

    for (const TestCase& t : tests) {
        TestResult r;
        r.input = t.input;
        r.expected = t.expected;
        if (!build.ok()) {
            r.error = "Kompileringsfel:\n" + build.diagnostics;
        } else {
            RunResult run = build.program->run(t.input, timeoutMs);
            r.actual = run.out;
            if (!run.ok) r.error = run.error + (run.err.empty() ? "" : "\n" + run.err);
            r.passed = run.ok && normalizeOutput(run.out) == normalizeOutput(t.expected);
        }
        results.push_back(std::move(r));
    }
    return results;
}

}  // namespace nt
