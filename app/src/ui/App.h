#pragma once
// App äger allt: kurserna, framstegen, verktygen och vilken sida som visas.
// main.cpp skapar en App och anropar frame() en gång per bildruta.
//
// Sidorna är uppdelade på flera .cpp-filer (ViewsCourse, ViewExam, ViewLab)
// men är medlemsfunktioner i samma klass, så de delar tillstånd utan globala variabler.

#include <cstdlib>
#include <filesystem>
#include <future>
#include <map>
#include <memory>
#include <optional>
#include <random>
#include <string>
#include <vector>

#include <TextEditor.h>

#include "QuestionView.h"
#include "core/Content.h"
#include "core/Exam.h"
#include "core/Progress.h"
#include "run/LanguageRunner.h"

namespace nt::ui {

enum class Screen { Home, Course, Lesson, Exam, Assignments, Resources, Lab, About };

struct Route {
    Screen screen = Screen::Home;
    int course = -1;
    int lesson = -1;
    bool operator==(const Route& o) const { return screen == o.screen && course == o.course && lesson == o.lesson; }
};

class App {
public:
    App(std::vector<Course> courses, Toolchain tc, std::string loadError);

    void frame();                  // ritar hela fönstret
    // Öppna en sida direkt, t.ex. "lesson:1:5" (kurs 1, lektion 5). Används för skärmdumpar och tester.
    void openRoute(const std::string& spec);
    ProgressStore& progress() { return progress_; }
    float debugScroll = -1;        // för skärmdumpar: 0–1 = andel av sidan, >1 = pixlar

private:
    // ---- navigering ----
    void go(Route r);
    void back();
    void drawTopBar();
    void drawSidebar();
    bool sidebarLink(const std::string& label, const std::string& right, bool active, bool done = false, int number = -1);

    // ---- sidor (ViewsCourse.cpp) ----
    void viewHome();
    void viewCourse();
    void viewLesson();
    void viewAssignments();
    void viewResources();
    void viewAbout();
    void drawCourseTabs(Screen active);
    void drawBlock(const Lesson& lesson, const Block& b, int lessonIdx, int& section, int& exercise);
    void drawPractice(const Course& c, const Lesson& l);
    void lessonRow(const Course& c, int i);

    // ---- prov (ViewExam.cpp) ----
    void viewExam();
    void examSetup(const Course& c);
    void examRunning(const Course& c);
    void examGrading(const Course& c);
    void examResult(const Course& c, const ExamResult& r);

    // ---- kodlabb (ViewLab.cpp) ----
    void viewLab();

    void handleLink(const std::string& href);  // http-länkar öppnas i webbläsaren

    std::vector<Course> courses_;
    Toolchain tc_;
    std::string loadError_;
    ProgressStore progress_;
    QuestionView questions_;
    std::mt19937 rng_{std::getenv("NOLLTERM_SEED") ? (unsigned)std::atoi(std::getenv("NOLLTERM_SEED")) : std::random_device{}()};

    Route route_;
    std::vector<Route> history_;
    bool scrollTop_ = false;
    int debugScrollFrames_ = 0;

    // Övningssvar som visas just nu (läses från ProgressStore vid behov).
    std::map<std::string, AnswerState> practice_;
    int practiceFilter_ = -1;  // -1 = alla typer, annars (int)QuestionType

    // Prov
    ExamConfig examConfig_;
    std::unique_ptr<Exam> exam_;
    int examCurrent_ = 0;
    std::vector<bool> examFlags_;
    bool examConfirm_ = false;
    std::future<ExamResult> examGrading_;
    std::optional<ExamResult> examShown_;
    bool reviewOnlyWrong_ = false;

    // Kodlabb
    TextEditor labEditor_;
    Language labLang_ = Language::Cpp;
    bool labInit_ = false;
    std::string labInput_;
    std::future<RunResult> labRun_;
    RunResult labResult_;
    bool labHasResult_ = false;
    double labMs_ = 0;

    // Info om verktygen (räknas ut i bakgrunden första gången Om-sidan visas)
    std::future<std::vector<std::string>> toolInfoJob_;
    std::vector<std::string> toolInfo_;
};

}  // namespace nt::ui
