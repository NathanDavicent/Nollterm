#include "Question.h"

#include <algorithm>
#include <cctype>

namespace nt {

const char* typeLabel(QuestionType t) {
    switch (t) {
        case QuestionType::SingleChoice: return "Flerval";
        case QuestionType::MultiChoice:  return "Flera rätt";
        case QuestionType::TextAnswer:   return "Fritext";
        case QuestionType::Code:         return "Kod";
    }
    return "";
}

std::vector<Language> CodeTask::languages() const {
    std::vector<Language> out;
    for (Language l : kAllLanguages)
        if (supports(l)) out.push_back(l);
    return out;
}

SingleChoiceQuestion::SingleChoiceQuestion(std::string prompt, std::string why, std::vector<std::string> options, int answer)
    : Question(std::move(prompt), std::move(why)), options_(std::move(options)), answer_(answer) {}

MultiChoiceQuestion::MultiChoiceQuestion(std::string prompt, std::string why, std::vector<std::string> options, std::set<int> answers)
    : Question(std::move(prompt), std::move(why)), options_(std::move(options)), answers_(std::move(answers)) {}

TextQuestion::TextQuestion(std::string prompt, std::string why, std::vector<std::string> accepted, std::string placeholder)
    : Question(std::move(prompt), std::move(why)), accepted_(std::move(accepted)), placeholder_(std::move(placeholder)) {}

std::string TextQuestion::normalize(const std::string& s) {
    std::string out;
    for (unsigned char c : s) {
        if (std::isspace(c)) continue;
        if (c == '\'') c = '"';  // 'x' och "x" räknas lika
        out.push_back(c < 128 ? (char)std::tolower(c) : (char)c);
    }
    while (!out.empty() && out.back() == ';') out.pop_back();
    return out;
}

bool TextQuestion::isAnswered(const AnswerState& a) const { return !normalize(a.text).empty(); }

bool TextQuestion::grade(const AnswerState& a) const {
    const std::string mine = normalize(a.text);
    if (mine.empty()) return false;
    return std::any_of(accepted_.begin(), accepted_.end(), [&](const std::string& ok) { return normalize(ok) == mine; });
}

CodeQuestion::CodeQuestion(std::string prompt, std::string why, std::shared_ptr<const CodeTask> task)
    : Question(std::move(prompt), std::move(why)), task_(std::move(task)) {}

static std::string trimEnd(std::string s) {
    while (!s.empty() && std::isspace((unsigned char)s.back())) s.pop_back();
    return s;
}

bool CodeQuestion::isAnswered(const AnswerState& a) const {
    auto it = a.code.find(a.language);
    if (it == a.code.end()) return false;
    auto st = task_->starter.find(a.language);
    // Besvarad = koden har ändrats från startkoden (tomma rader på slutet räknas inte).
    return st == task_->starter.end() || trimEnd(it->second) != trimEnd(st->second);
}

bool CodeQuestion::grade(const AnswerState& a) const {
    if (a.results.size() != task_->tests.size() || a.results.empty()) return false;
    return std::all_of(a.results.begin(), a.results.end(), [](const TestResult& r) { return r.passed; });
}

}  // namespace nt
