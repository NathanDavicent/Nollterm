#pragma once
// Frågor.
//
// Question är en abstrakt basklass. Varje frågetyp vet själv hur den rättas
// (grade) och om den är besvarad (isAnswered) – polymorfism.
// Hur frågorna RITAS ligger i ui/QuestionView, så att kärnan inte beror på grafiken.

#include <map>
#include <memory>
#include <set>
#include <string>
#include <vector>

#include "Language.h"

namespace nt {

enum class QuestionType { SingleChoice, MultiChoice, TextAnswer, Code };

const char* typeLabel(QuestionType t);  // "Flerval", "Flera rätt", ...

struct TestCase {
    std::string input;
    std::string expected;
};

// En koduppgift: testfall plus startkod och lösning per språk.
struct CodeTask {
    std::string id;
    std::vector<TestCase> tests;
    std::map<Language, std::string> starter;
    std::map<Language, std::string> solution;
    bool runsInBrowser = false;  // C/C++-versionen fungerar i webbversionens tolk

    std::vector<Language> languages() const;  // språk som har en startkod
    bool supports(Language l) const { return starter.count(l) > 0; }
};

struct TestResult {
    std::string input, expected, actual, error;
    bool passed = false;
};

// Allt användaren har svarat på en fråga. En struct för alla typer håller det enkelt.
struct AnswerState {
    int choice = -1;                          // SingleChoice: valt alternativ
    std::set<int> picks;                      // MultiChoice: valda alternativ
    std::string text;                         // TextAnswer
    std::map<Language, std::string> code;     // Code: din kod per språk
    Language language = Language::Cpp;       // Code: valt språk
    bool checked = false;                     // har användaren tryckt Kontrollera/rättats
    bool correct = false;                     // resultatet av senaste rättningen
    std::vector<TestResult> results;          // Code: senaste testkörningen
};

class Question {
public:
    Question(std::string prompt, std::string why) : prompt_(std::move(prompt)), why_(std::move(why)) {}
    virtual ~Question() = default;

    virtual QuestionType type() const = 0;
    virtual bool isAnswered(const AnswerState& a) const = 0;
    virtual bool grade(const AnswerState& a) const = 0;  // true = rätt
    virtual int points() const { return 1; }

    const std::string& prompt() const { return prompt_; }  // kan innehålla enkel HTML (<code> m.m.)
    const std::string& why() const { return why_; }

private:
    std::string prompt_;
    std::string why_;
};

class SingleChoiceQuestion : public Question {
public:
    SingleChoiceQuestion(std::string prompt, std::string why, std::vector<std::string> options, int answer);
    QuestionType type() const override { return QuestionType::SingleChoice; }
    bool isAnswered(const AnswerState& a) const override { return a.choice >= 0; }
    bool grade(const AnswerState& a) const override { return a.choice == answer_; }

    const std::vector<std::string>& options() const { return options_; }
    int answer() const { return answer_; }

private:
    std::vector<std::string> options_;
    int answer_;
};

class MultiChoiceQuestion : public Question {
public:
    MultiChoiceQuestion(std::string prompt, std::string why, std::vector<std::string> options, std::set<int> answers);
    QuestionType type() const override { return QuestionType::MultiChoice; }
    bool isAnswered(const AnswerState& a) const override { return !a.picks.empty(); }
    bool grade(const AnswerState& a) const override { return a.picks == answers_; }  // exakt rätt kombination

    const std::vector<std::string>& options() const { return options_; }
    const std::set<int>& answers() const { return answers_; }

private:
    std::vector<std::string> options_;
    std::set<int> answers_;
};

class TextQuestion : public Question {
public:
    TextQuestion(std::string prompt, std::string why, std::vector<std::string> accepted, std::string placeholder);
    QuestionType type() const override { return QuestionType::TextAnswer; }
    bool isAnswered(const AnswerState& a) const override;
    bool grade(const AnswerState& a) const override;

    const std::vector<std::string>& accepted() const { return accepted_; }
    const std::string& placeholder() const { return placeholder_; }

    // "  Git  Push " -> "gitpush": små bokstäver, utan mellanslag och avslutande semikolon.
    static std::string normalize(const std::string& s);

private:
    std::vector<std::string> accepted_;
    std::string placeholder_;
};

class CodeQuestion : public Question {
public:
    CodeQuestion(std::string prompt, std::string why, std::shared_ptr<const CodeTask> task);
    QuestionType type() const override { return QuestionType::Code; }
    bool isAnswered(const AnswerState& a) const override;
    // Rättningen kräver att testerna redan körts (de tar tid och görs i bakgrunden).
    bool grade(const AnswerState& a) const override;
    int points() const override { return 2; }

    const CodeTask& task() const { return *task_; }

private:
    std::shared_ptr<const CodeTask> task_;
};

}  // namespace nt
