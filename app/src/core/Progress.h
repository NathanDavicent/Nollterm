#pragma once
// Sparar framsteg: klara lektioner, övningssvar, bockade krav, provhistorik och kodlabbet.
// Allt hamnar i en JSON-fil i användarens app-data-mapp:
//   Windows: %APPDATA%\Nollterm\progress.json
//   Linux:   ~/.local/share/nollterm/progress.json

#include <filesystem>
#include <string>
#include <vector>

#include <nlohmann/json.hpp>

#include "Exam.h"
#include "Question.h"

namespace nt {

class ProgressStore {
public:
    ProgressStore();  // läser filen om den finns

    bool isDone(const std::string& course, const std::string& lesson) const;
    void setDone(const std::string& course, const std::string& lesson, bool done);
    int doneCount(const std::string& course) const;

    // Övningssvar per fråga. Nyckel: kurs, lektion, frågans index.
    AnswerState practice(const std::string& course, const std::string& lesson, int question) const;
    void setPractice(const std::string& course, const std::string& lesson, int question, const AnswerState& a);
    void clearPractice(const std::string& course, const std::string& lesson);

    bool isChecked(const std::string& key) const;
    void setChecked(const std::string& key, bool on);

    std::vector<ExamResult> exams(const std::string& course) const;
    void addExam(const std::string& course, const ExamResult& r);

    std::string labCode(Language l) const;
    void setLabCode(Language l, const std::string& code);
    std::string labInput() const;
    void setLabInput(const std::string& s);

    Language preferredLanguage() const;
    void setPreferredLanguage(Language l);

    bool darkMode() const;
    void setDarkMode(bool on);

    // Skriver till disk om något ändrats. Anropas en gång per bildruta (billigt om inget ändrats).
    void saveIfDirty();
    const std::filesystem::path& path() const { return path_; }

private:
    nlohmann::json data_;
    std::filesystem::path path_;
    bool dirty_ = false;
};

// Konvertering mellan AnswerState och JSON (används även för provhistoriken).
nlohmann::json toJson(const AnswerState& a);
AnswerState answerFromJson(const nlohmann::json& j);

}  // namespace nt
