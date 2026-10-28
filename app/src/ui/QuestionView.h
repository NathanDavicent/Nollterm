#pragma once
// Ritar en fråga i ett av tre lägen:
//   Practice – öva i lektionen, rättas direkt
//   Exam     – under ett prov, inget facit förrän provet lämnas in
//   Review   – genomgång efter provet, visar rätt svar
//
// Valet av ritfunktion görs med en switch på QuestionType. Det är ett litet och
// stängt antal fall, och då är enum class + switch fullt rimligt (se lektionen om polymorfism).

#include <future>
#include <map>
#include <memory>
#include <string>
#include <vector>

#include <cstdint>  // TextEditor.h använder uint8_t utan att inkludera <cstdint>
#include <TextEditor.h>

#include "core/Question.h"
#include "run/LanguageRunner.h"

namespace nt::ui {

enum class QuestionMode { Practice, Exam, Review };

struct QuestionContext {
    QuestionMode mode = QuestionMode::Practice;
    int number = 1, total = 1;
    std::string from;                              // t.ex. "Lektion 03" i prov
    const std::vector<int>* optionOrder = nullptr; // blandad ordning i prov
    std::string uid;                               // unikt id, håller isär redigerare
    Language preferred = Language::Cpp;
};

class QuestionView {
public:
    explicit QuestionView(Toolchain tc) : tc_(std::move(tc)) {}

    // Returnerar true om svaret ändrades (då ska det sparas).
    bool draw(const Question& q, AnswerState& a, const QuestionContext& ctx);

    // Glöm redigerare och körningar (t.ex. när ett nytt prov startar).
    void reset() { code_.clear(); }
    bool anyRunning() const;

private:
    struct CodeState {
        TextEditor editor;
        Language lang = Language::Cpp;
        std::string input;
        std::future<RunResult> run;
        std::future<std::vector<TestResult>> tests;
        RunResult lastRun;
        bool hasRun = false;
        bool showSolution = false;
    };

    bool drawChoice(const Question& q, AnswerState& a, const QuestionContext& ctx, bool multi);
    bool drawText(const Question& q, AnswerState& a, const QuestionContext& ctx);
    bool drawCode(const Question& q, AnswerState& a, const QuestionContext& ctx);
    void setEditorLanguage(CodeState& s, Language l);

    Toolchain tc_;
    std::map<std::string, std::unique_ptr<CodeState>> code_;
};

// Färgad ruta med text (används för förklaringar och tips).
void noteBox(const std::string& html, unsigned bg, unsigned labelColor, const char* label);

}  // namespace nt::ui
