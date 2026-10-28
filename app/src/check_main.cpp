// nollterm-check: kommandoradsverktyg som testar kärnan utan grafik.
//
//   nollterm-check --selftest        kör små program i C, C++ och Python
//   nollterm-check --verify [kurs]   rättar alla lösningar i content/ i alla språk
//   nollterm-check --stats           läser in kurserna och skriver ut antal lektioner/frågor
//
// Används i GitHub Actions innan appen paketeras.

#include <iostream>
#include <string>

#include "core/Content.h"
#include "run/Judge.h"
#include "run/LanguageRunner.h"

using namespace nt;

static fs::path appDir(const char* argv0) {
    std::error_code ec;
    fs::path p = fs::canonical(fs::path(argv0), ec);
    return ec ? fs::current_path() : p.parent_path();
}

static int selftest(const Toolchain& tc) {
    struct Case { Language lang; const char* name; const char* code; const char* input; const char* want; bool expectOk; };
    const Case cases[] = {
        {Language::C, "C med scanf/printf", "#include <stdio.h>\nint main(void){int a,b;scanf(\"%d %d\",&a,&b);printf(\"%d\\n\",a+b);return 0;}", "2 3", "5", true},
        {Language::Cpp, "C++ med string och vector", "#include <iostream>\n#include <string>\n#include <vector>\nint main(){std::string s;std::getline(std::cin,s);std::vector<int> v{1,2,3};std::cout<<s<<\" \"<<v.size()<<\"\\n\";}", "hej", "hej 3", true},
        {Language::Python, "Python med å, ä, ö", "name = input()\nprint(f'Hej {name}, åäö')", "Nollterm", "Hej Nollterm, åäö", true},
        {Language::Cpp, "kompileringsfel", "int main(){ int x = 5 return 0; }", "", "", false},
        {Language::Python, "oändlig loop (timeout)", "while True:\n    pass", "", "", false},
    };
    int bad = 0;
    for (const Case& c : cases) {
        auto runner = makeRunner(c.lang, tc);
        RunResult r = runner->run(c.code, c.input, 2000);
        bool pass = c.expectOk ? (r.ok && normalizeOutput(r.out) == c.want) : !r.ok;
        std::cout << (pass ? "OK   " : "FEL  ") << displayName(c.lang) << ": " << c.name;
        if (!pass) std::cout << "  -> " << r.error << " " << r.err << " out=" << r.out;
        std::cout << "\n";
        bad += !pass;
    }
    return bad ? 1 : 0;
}

static int verify(const std::vector<Course>& courses, const Toolchain& tc, const std::string& only) {
    int checked = 0, problems = 0;
    for (const Course& c : courses) {
        if (!only.empty() && c.id != only) continue;
        for (const Lesson& l : c.lessons)
            for (auto& q : l.questions) {
                auto* code = dynamic_cast<const CodeQuestion*>(q.get());
                if (!code) continue;
                const CodeTask& task = code->task();
                for (Language lang : task.languages()) {
                    auto runner = makeRunner(lang, tc);
                    std::string name = c.id + "/" + task.id + " [" + displayName(lang) + "]";
                    checked++;
                    auto sol = task.solution.find(lang);
                    if (sol == task.solution.end()) {
                        std::cout << "FEL  " << name << ": saknar lösning\n";
                        problems++;
                        continue;
                    }
                    auto results = runTests(*runner, sol->second, task.tests);
                    int passed = 0;
                    for (auto& r : results) passed += r.passed;
                    if (passed != (int)results.size()) {
                        problems++;
                        std::cout << "FEL  " << name << ": lösningen klarar " << passed << "/" << results.size() << "\n";
                        for (auto& r : results)
                            if (!r.passed) { std::cout << "     in=" << r.input << " fick=" << r.actual << r.error << "\n"; break; }
                    }
                    auto starter = runTests(*runner, task.starter.at(lang), task.tests);
                    int sp = 0;
                    for (auto& r : starter) sp += r.passed;
                    if (sp == (int)starter.size()) {
                        problems++;
                        std::cout << "FEL  " << name << ": startkoden klarar redan alla tester\n";
                    }
                }
            }
    }
    std::cout << checked << " lösningar kontrollerade, " << problems << " problem\n";
    return problems ? 1 : 0;
}

int main(int argc, char** argv) {
    const std::string cmd = argc > 1 ? argv[1] : "--stats";
    const fs::path dir = appDir(argv[0]);
    const Toolchain tc = Toolchain::detect(dir);
    std::cout << "g++:    " << toolVersion(tc.gxx, tc) << "\n"
              << "python: " << toolVersion(tc.python, tc) << "\n";

    if (cmd == "--selftest") return selftest(tc);

    fs::path content = findContentDir(dir);
    if (content.empty()) content = findContentDir(fs::current_path());
    if (content.empty()) { std::cerr << "Hittade ingen content/-mapp\n"; return 2; }

    std::vector<Course> courses;
    try {
        courses = loadCourses(content);
    } catch (const std::exception& e) {
        std::cerr << e.what() << "\n";
        return 2;
    }
    if (cmd == "--verify") return verify(courses, tc, argc > 2 ? argv[2] : "");

    for (const Course& c : courses)
        std::cout << c.shortName << ": " << c.lessons.size() << " lektioner, " << c.questionCount() << " frågor, "
                  << c.codeTaskCount() << " kodfrågor\n";
    return 0;
}
