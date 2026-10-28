#include "Exam.h"

#include <algorithm>
#include <ctime>
#include <numeric>

namespace nt {

const char* gradeName(Grade g) {
    switch (g) {
        case Grade::VG: return "VG";
        case Grade::G:  return "G";
        case Grade::IG: return "IG";
    }
    return "";
}

Grade gradeFor(int percent) {
    if (percent >= 75) return Grade::VG;
    if (percent >= 50) return Grade::G;
    return Grade::IG;
}

static bool eligible(const Course& c, const ExamConfig& cfg, int lesson, int q) {
    if (!cfg.lessonIds.empty() && !cfg.lessonIds.count(c.lessons[lesson].id)) return false;
    return cfg.types.count(c.lessons[lesson].questions[q]->type()) > 0;
}

int Exam::countEligible(const Course& course, const ExamConfig& config) {
    int n = 0;
    for (int l = 0; l < (int)course.lessons.size(); l++)
        for (int q = 0; q < (int)course.lessons[l].questions.size(); q++) n += eligible(course, config, l, q);
    return n;
}

Exam::Exam(const Course& course, ExamConfig config, std::mt19937& rng)
    : course_(course), config_(std::move(config)), start_(std::chrono::steady_clock::now()) {
    // 1. Samla frågorna per lektion och blanda varje lista.
    std::map<int, std::vector<ExamItem>> perLesson;
    for (int l = 0; l < (int)course.lessons.size(); l++)
        for (int q = 0; q < (int)course.lessons[l].questions.size(); q++)
            if (eligible(course, config_, l, q)) perLesson[l].push_back({l, q, {}});
    int total = 0;
    for (auto& [l, list] : perLesson) {
        std::shuffle(list.begin(), list.end(), rng);
        total += (int)list.size();
    }
    const int want = config_.count <= 0 ? total : std::min(config_.count, total);

    // 2. Plocka en fråga i taget från varje lektion i tur och ordning, så att provet
    //    blir jämnt fördelat över lektionerna istället för att domineras av en.
    std::vector<int> order;
    for (auto& [l, list] : perLesson) order.push_back(l);
    std::shuffle(order.begin(), order.end(), rng);
    while ((int)items_.size() < want) {
        for (int l : order) {
            if ((int)items_.size() >= want) break;
            if (perLesson[l].empty()) continue;
            items_.push_back(perLesson[l].back());
            perLesson[l].pop_back();
        }
    }
    std::shuffle(items_.begin(), items_.end(), rng);

    // 3. Blanda alternativens ordning, och förbered kodfrågorna med startkod.
    answers_.resize(items_.size());
    for (size_t i = 0; i < items_.size(); i++) {
        const Question& q = question(i);
        size_t options = 0;
        if (auto* s = dynamic_cast<const SingleChoiceQuestion*>(&q)) options = s->options().size();
        if (auto* m = dynamic_cast<const MultiChoiceQuestion*>(&q)) options = m->options().size();
        items_[i].optionOrder.resize(options);
        std::iota(items_[i].optionOrder.begin(), items_[i].optionOrder.end(), 0);
        std::shuffle(items_[i].optionOrder.begin(), items_[i].optionOrder.end(), rng);

        if (auto* c = dynamic_cast<const CodeQuestion*>(&q)) {
            const CodeTask& task = c->task();
            Language lang = task.supports(config_.language) ? config_.language : task.languages().front();
            answers_[i].language = lang;
            for (Language l : task.languages()) answers_[i].code[l] = task.starter.at(l);
        }
    }
}

const Question& Exam::question(size_t i) const {
    return *course_.lessons[items_[i].lesson].questions[items_[i].question];
}

int Exam::secondsElapsed() const {
    return (int)std::chrono::duration_cast<std::chrono::seconds>(std::chrono::steady_clock::now() - start_).count();
}

int Exam::secondsLeft() const {
    if (config_.minutes <= 0) return -1;
    return std::max(0, config_.minutes * 60 - secondsElapsed());
}

ExamResult Exam::finish() const {
    ExamResult r;
    r.timestamp = (long long)std::time(nullptr);
    r.seconds = secondsElapsed();
    r.items = items_;
    r.answers = answers_;
    for (size_t i = 0; i < items_.size(); i++) {
        const Question& q = question(i);
        bool ok = q.isAnswered(answers_[i]) && q.grade(answers_[i]);
        r.correct.push_back(ok);
        r.maxPoints += q.points();
        if (ok) r.points += q.points();
    }
    r.percent = r.maxPoints ? (int)(100.0 * r.points / r.maxPoints + 0.5) : 0;
    r.grade = gradeFor(r.percent);
    return r;
}

}  // namespace nt
