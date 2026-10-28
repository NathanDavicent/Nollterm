#pragma once
// Provläget: dra slumpade frågor, håll reda på svar och tid, räkna ut betyg.

#include <chrono>
#include <map>
#include <random>
#include <set>
#include <string>
#include <vector>

#include "Content.h"

namespace nt {

struct ExamConfig {
    std::set<std::string> lessonIds;     // tom = alla lektioner
    std::set<QuestionType> types = {QuestionType::SingleChoice, QuestionType::MultiChoice,
                                    QuestionType::TextAnswer, QuestionType::Code};
    int count = 15;                      // 0 = alla som matchar
    int minutes = 0;                     // 0 = ingen tidsgräns
    Language language = Language::Cpp;   // föredraget språk för kodfrågor
};

// En dragen fråga: var den kommer ifrån, och i vilken ordning alternativen visas.
struct ExamItem {
    int lesson = 0;
    int question = 0;
    std::vector<int> optionOrder;  // blandad ordning för flervalsfrågor
};

enum class Grade { IG, G, VG };
const char* gradeName(Grade g);
Grade gradeFor(int percent);  // VG från 75 %, G från 50 %

struct ExamResult {
    long long timestamp = 0;           // sekunder sedan 1970
    int seconds = 0;                   // tid det tog
    int points = 0, maxPoints = 0, percent = 0;
    Grade grade = Grade::IG;
    std::vector<ExamItem> items;
    std::vector<AnswerState> answers;
    std::vector<bool> correct;
};

class Exam {
public:
    Exam(const Course& course, ExamConfig config, std::mt19937& rng);

    const ExamConfig& config() const { return config_; }
    const std::vector<ExamItem>& items() const { return items_; }
    std::vector<AnswerState>& answers() { return answers_; }
    const Question& question(size_t i) const;

    int secondsElapsed() const;
    int secondsLeft() const;  // -1 om ingen tidsgräns
    bool timeIsUp() const { return config_.minutes > 0 && secondsLeft() <= 0; }

    // Rättar alla frågor. Kodfrågornas tester måste ha körts först (answers()[i].results).
    ExamResult finish() const;

    // Hur många frågor som matchar inställningarna (visas innan provet startar).
    static int countEligible(const Course& course, const ExamConfig& config);

private:
    const Course& course_;
    ExamConfig config_;
    std::vector<ExamItem> items_;
    std::vector<AnswerState> answers_;
    std::chrono::steady_clock::time_point start_;
};

}  // namespace nt
