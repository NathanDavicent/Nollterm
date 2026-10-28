// Provläget: inställningar -> pågående prov -> rättning -> resultat och genomgång.

#include <algorithm>
#include <cmath>

#include <imgui.h>

#include "App.h"
#include "RichText.h"
#include "Theme.h"
#include "Widgets.h"
#include "run/Judge.h"

namespace nt::ui {

void App::viewExam() {
    const Course& c = courses_[route_.course];
    drawCourseTabs(Screen::Exam);
    if (examGrading_.valid()) examGrading(c);
    else if (exam_) examRunning(c);
    else if (examShown_) examResult(c, *examShown_);
    else examSetup(c);
}

// ------------------------------------------------------------------ inställningar

void App::examSetup(const Course& c) {
    const Palette& p = pal();
    eyebrow("Prov · " + c.shortName);
    heading("Slumpat prov med rättning.");
    spacing(2);
    mutedText("Välj lektioner, frågetyper och språk. Frågorna dras slumpvis och jämnt fördelat, och du får inget facit förrän du lämnar in.");
    spacing(12);

    // Lektioner som inte finns i den här kursen ska inte ligga kvar i valet.
    std::set<std::string> valid;
    for (auto& l : c.lessons) valid.insert(l.id);
    for (auto it = examConfig_.lessonIds.begin(); it != examConfig_.lessonIds.end();)
        it = valid.count(*it) ? std::next(it) : examConfig_.lessonIds.erase(it);

    beginCard("setup", p.surface, p.line, 18);
    eyebrow("Lektioner");
    const bool all = examConfig_.lessonIds.empty();
    for (size_t i = 0; i < c.lessons.size(); i++) {
        bool on = all || examConfig_.lessonIds.count(c.lessons[i].id);
        std::string label = (i < 9 ? "0" : "") + std::to_string(i + 1) + " " + c.lessons[i].title;
        if (i % 2) ImGui::SameLine(ImGui::GetContentRegionAvail().x * 0.5f + px(18));
        ImGui::PushID((int)i);
        if (ImGui::Checkbox(label.c_str(), &on)) {
            if (all) for (auto& l : c.lessons) examConfig_.lessonIds.insert(l.id);
            if (on) examConfig_.lessonIds.insert(c.lessons[i].id);
            else examConfig_.lessonIds.erase(c.lessons[i].id);
            if (examConfig_.lessonIds.size() == c.lessons.size()) examConfig_.lessonIds.clear();
        }
        ImGui::PopID();
    }
    if (chip("Välj alla")) examConfig_.lessonIds.clear();
    spacing(10);

    eyebrow("Frågetyper");
    for (int t = 0; t < 4; t++) {
        QuestionType qt = (QuestionType)t;
        bool on = examConfig_.types.count(qt);
        std::string label = std::string(typeLabel(qt)) + (qt == QuestionType::Code ? " (2 p)" : "");
        if (ImGui::Checkbox(label.c_str(), &on)) {
            if (on) examConfig_.types.insert(qt);
            else examConfig_.types.erase(qt);
        }
        ImGui::SameLine(0, px(18));
    }
    ImGui::NewLine();
    spacing(6);

    eyebrow("Antal frågor");
    for (int n : {10, 15, 20, 30, 0}) {
        if (chip(n ? std::to_string(n).c_str() : "Alla", examConfig_.count == n)) examConfig_.count = n;
        ImGui::SameLine();
    }
    ImGui::NewLine();
    spacing(6);
    eyebrow("Tidsgräns");
    for (int m : {0, 10, 20, 30, 45, 60}) {
        if (chip(m ? (std::to_string(m) + " min").c_str() : "Ingen", examConfig_.minutes == m)) examConfig_.minutes = m;
        ImGui::SameLine();
    }
    ImGui::NewLine();
    spacing(6);
    eyebrow("Språk för kodfrågor");
    for (Language l : kAllLanguages) {
        if (chip(displayName(l), examConfig_.language == l)) {
            examConfig_.language = l;
            progress_.setPreferredLanguage(l);
        }
        ImGui::SameLine();
    }
    ImGui::NewLine();
    ImGui::PushFont(fonts().small);
    ImGui::TextDisabled("Uppgifter som saknar ditt språk visas i ett språk de stöder. Du kan byta språk per fråga under provet.");
    ImGui::PopFont();
    spacing(10);

    const int pool = Exam::countEligible(c, examConfig_);
    const int n = examConfig_.count <= 0 ? pool : std::min(examConfig_.count, pool);
    ImGui::Text("%d frågor matchar. Provet drar %d av dem.", pool, n);
    spacing(4);
    if (button("Starta provet →", ButtonKind::Primary, ImVec2(0, 0), n > 0)) {
        exam_ = std::make_unique<Exam>(c, examConfig_, rng_);
        examCurrent_ = 0;
        examFlags_.assign(exam_->items().size(), false);
        examConfirm_ = false;
        questions_.reset();
    }
    endCard();

    // Betygsgränser och historik
    beginCard("rules", p.surface, p.line, 18);
    heading("Så rättas provet", 3);
    richText("Flerval, flera rätt och fritext ger 1 poäng. <strong>Flera rätt</strong> kräver exakt rätt kombination. "
             "Kodfrågor ger 2 poäng om alla dolda tester går igenom. Gränser: <strong>G</strong> från 50 %, "
             "<strong>VG</strong> från 75 %. Gränserna är satta för självtest, inte av läraren.");
    endCard();

    std::vector<ExamResult> history = progress_.exams(c.id);
    if (!history.empty()) {
        heading("Tidigare prov", 3);
        if (ImGui::BeginTable("hist", 4, ImGuiTableFlags_Borders | ImGuiTableFlags_RowBg)) {
            ImGui::TableSetupColumn("Datum");
            ImGui::TableSetupColumn("Poäng");
            ImGui::TableSetupColumn("Betyg");
            ImGui::TableSetupColumn("");
            ImGui::TableHeadersRow();
            for (size_t i = 0; i < history.size(); i++) {
                const ExamResult& r = history[i];
                ImGui::TableNextRow();
                ImGui::TableNextColumn();
                ImGui::TextUnformatted(formatDate(r.timestamp).c_str());
                ImGui::TableNextColumn();
                ImGui::Text("%d/%d · %d %%", r.points, r.maxPoints, r.percent);
                ImGui::TableNextColumn();
                const Palette& pp = pal();
                tag(gradeName(r.grade), r.grade == Grade::VG ? pp.okSoft : r.grade == Grade::G ? pp.maskSoft : pp.badSoft,
                    r.grade == Grade::VG ? pp.ok : r.grade == Grade::G ? pp.mask : pp.bad);
                ImGui::TableNextColumn();
                ImGui::PushID((int)i);
                if (ImGui::SmallButton("Visa")) examShown_ = r;
                ImGui::PopID();
            }
            ImGui::EndTable();
        }
    }
}

// ------------------------------------------------------------------ pågående prov

void App::examRunning(const Course& c) {
    const Palette& p = pal();
    Exam& ex = *exam_;
    const int N = (int)ex.items().size();
    if (ex.timeIsUp()) examConfirm_ = true;  // tiden ute: lämna in direkt nedan

    int answered = 0;
    for (int i = 0; i < N; i++) answered += ex.question(i).isAnswered(ex.answers()[i]);

    // Översta raden: fråga, besvarade, timer
    ImGui::PushFont(fonts().h3);
    ImGui::Text("Prov · fråga %d av %d", examCurrent_ + 1, N);
    ImGui::PopFont();
    ImGui::SameLine();
    ImGui::TextDisabled("   %d/%d besvarade", answered, N);
    ImGui::SameLine();
    const int left = ex.secondsLeft();
    std::string timer = left >= 0 ? formatSeconds(left) + " kvar" : formatSeconds(ex.secondsElapsed());
    ImGui::SetCursorPosX(ImGui::GetContentRegionMax().x - ImGui::CalcTextSize(timer.c_str()).x - px(4));
    ImGui::PushStyleColor(ImGuiCol_Text, toVec4(left >= 0 && left <= 60 ? p.bad : p.ink));
    ImGui::PushFont(fonts().mono);
    ImGui::TextUnformatted(timer.c_str());
    ImGui::PopFont();
    ImGui::PopStyleColor();

    // Navigering mellan frågorna: grön = besvarad, koppar = markerad
    spacing(4);
    for (int i = 0; i < N; i++) {
        const bool isAns = ex.question(i).isAnswered(ex.answers()[i]);
        ImGui::PushID(i);
        ImGui::PushStyleColor(ImGuiCol_Button, toVec4(isAns ? p.maskSoft : p.surface));
        ImGui::PushStyleColor(ImGuiCol_Border, toVec4(i == examCurrent_ ? p.ink : isAns ? p.mask : p.line));
        ImGui::PushStyleVar(ImGuiStyleVar_FrameBorderSize, i == examCurrent_ ? px(2) : 1.0f);
        if (ImGui::Button(std::to_string(i + 1).c_str(), ImVec2(px(36), px(32)))) { examCurrent_ = i; examConfirm_ = false; }
        if (examFlags_[i]) {
            ImVec2 m = ImGui::GetItemRectMax();
            ImGui::GetWindowDrawList()->AddCircleFilled(ImVec2(m.x - px(3), ImGui::GetItemRectMin().y + px(3)), px(5), p.copper);
        }
        ImGui::PopStyleVar();
        ImGui::PopStyleColor(2);
        ImGui::PopID();
        if ((i + 1) % 15 != 0 && i + 1 < N) ImGui::SameLine(0, px(5));
    }
    spacing(10);

    // Frågan
    const ExamItem& item = ex.items()[examCurrent_];
    QuestionContext ctx;
    ctx.mode = QuestionMode::Exam;
    ctx.number = examCurrent_ + 1;
    ctx.total = N;
    ctx.from = "Lektion " + std::to_string(item.lesson + 1);
    ctx.optionOrder = &item.optionOrder;
    ctx.uid = "exam-" + std::to_string(examCurrent_);
    ctx.preferred = ex.config().language;
    beginCard("q", p.surface, p.line, 18);
    questions_.draw(ex.question(examCurrent_), ex.answers()[examCurrent_], ctx);
    endCard();

    // Knappar
    if (button("← Föregående", ButtonKind::Normal, ImVec2(0, 0), examCurrent_ > 0)) examCurrent_--;
    ImGui::SameLine();
    if (button(examFlags_[examCurrent_] ? "Ta bort markering" : "Markera för senare")) examFlags_[examCurrent_] = !examFlags_[examCurrent_];
    ImGui::SameLine();
    if (button("Nästa →", ButtonKind::Normal, ImVec2(0, 0), examCurrent_ + 1 < N)) examCurrent_++;
    ImGui::SameLine();
    if (button("Lämna in", ButtonKind::Primary)) examConfirm_ = true;
    spacing(6);

    auto submit = [&] {
        // Kodfrågorna rättas i bakgrunden så att fönstret inte fryser medan testerna körs.
        Toolchain tc = tc_;
        Exam* e = exam_.get();
        questions_.reset();
        examGrading_ = std::async(std::launch::async, [tc, e] {
            for (size_t i = 0; i < e->items().size(); i++) {
                auto* code = dynamic_cast<const CodeQuestion*>(&e->question(i));
                AnswerState& a = e->answers()[i];
                if (code && code->isAnswered(a))
                    a.results = runTests(*makeRunner(a.language, tc), a.code[a.language], code->task().tests);
            }
            return e->finish();
        });
        examConfirm_ = false;
    };

    if (ex.timeIsUp()) {
        submit();
    } else if (examConfirm_) {
        int flagged = (int)std::count(examFlags_.begin(), examFlags_.end(), true);
        std::string msg = "<strong>Lämna in provet?</strong> " +
                          (answered < N ? std::to_string(N - answered) + " frågor är obesvarade." : std::string("Alla frågor är besvarade.")) +
                          (flagged ? " " + std::to_string(flagged) + " är markerade för senare." : "");
        beginCard("confirm", p.copperSoft, p.copper, 16);
        richText(msg);
        if (button("Fortsätt skriva")) examConfirm_ = false;
        ImGui::SameLine();
        if (button("Lämna in", ButtonKind::Primary)) submit();
        endCard();
    }
    spacing(10);
    if (button("Avbryt provet utan att spara", ButtonKind::Ghost)) {
        exam_.reset();
        questions_.reset();
    }
}

void App::examGrading(const Course& c) {
    if (examGrading_.wait_for(std::chrono::milliseconds(0)) == std::future_status::ready) {
        ExamResult r = examGrading_.get();
        progress_.addExam(c.id, r);
        examShown_ = r;
        exam_.reset();
        scrollTop_ = true;
        return;
    }
    heading("Rättar provet…", 2);
    mutedText("Kodfrågorna kompileras och körs mot dolda tester. Det tar några sekunder.");
    // En enkel animerad indikator
    const float t = (float)ImGui::GetTime();
    ImVec2 a = ImGui::GetCursorScreenPos();
    for (int i = 0; i < 3; i++) {
        float r = px(5) * (0.6f + 0.4f * std::sin(t * 5 - i));
        ImGui::GetWindowDrawList()->AddCircleFilled(ImVec2(a.x + px(10) + i * px(20), a.y + px(14)), r, pal().mask);
    }
    ImGui::Dummy(ImVec2(px(80), px(28)));
}

// ------------------------------------------------------------------ resultat

void App::examResult(const Course& c, const ExamResult& r) {
    const Palette& p = pal();
    beginCard("result", p.surface, p.line, 20);
    // Ring med procent
    ImVec2 a = ImGui::GetCursorScreenPos();
    const float R = px(52);
    ImVec2 center(a.x + R + px(8), a.y + R + px(8));
    ImDrawList* dl = ImGui::GetWindowDrawList();
    dl->AddCircle(center, R, p.line, 64, px(11));
    const ImU32 col = r.grade == Grade::VG ? p.ok : r.grade == Grade::G ? p.mask : p.bad;
    const float pi = 3.14159265f;
    const float a0 = -pi / 2, a1 = a0 + 2 * pi * r.percent / 100.0f;
    dl->PathArcTo(center, R, a0, a1, 64);
    dl->PathStroke(col, 0, px(11));
    std::string pct = std::to_string(r.percent) + "%";
    ImVec2 ps = fonts().h2->CalcTextSizeA(fonts().h2->FontSize, FLT_MAX, 0, pct.c_str());
    dl->AddText(fonts().h2, fonts().h2->FontSize, ImVec2(center.x - ps.x / 2, center.y - ps.y / 2 - px(8)), p.ink, pct.c_str());
    const char* g = gradeName(r.grade);
    ImVec2 gs = fonts().body->CalcTextSizeA(fonts().body->FontSize, FLT_MAX, 0, g);
    dl->AddText(fonts().body, fonts().body->FontSize, ImVec2(center.x - gs.x / 2, center.y + px(10)), p.muted, g);
    ImGui::Dummy(ImVec2(R * 2 + px(16), R * 2 + px(16)));
    ImGui::SameLine(0, px(24));
    ImGui::BeginGroup();
    eyebrow("Resultat · " + formatDate(r.timestamp));
    std::string title = std::string(r.grade == Grade::VG ? "Väl godkänt." : r.grade == Grade::G ? "Godkänt." : "Inte godkänt än.") +
                        " " + std::to_string(r.points) + " av " + std::to_string(r.maxPoints) + " poäng.";
    heading(title, 2);
    int right = (int)std::count(r.correct.begin(), r.correct.end(), true);
    ImGui::TextDisabled("%d av %d frågor rätt på %s.", right, (int)r.correct.size(), formatSeconds(r.seconds).c_str());
    spacing(6);
    if (button("Nytt prov", ButtonKind::Primary)) {
        examShown_.reset();
        exam_ = std::make_unique<Exam>(c, examConfig_, rng_);
        examCurrent_ = 0;
        examFlags_.assign(exam_->items().size(), false);
        questions_.reset();
    }
    ImGui::SameLine();
    if (button("Inställningar och historik")) examShown_.reset();
    ImGui::EndGroup();
    endCard();
    if (!examShown_) return;

    // Per lektion
    struct Sum { int pts = 0, max = 0; };
    std::map<int, Sum> perLesson;
    for (size_t i = 0; i < r.items.size(); i++) {
        const Lesson& l = c.lessons[r.items[i].lesson];
        int pts = l.questions[r.items[i].question]->points();
        perLesson[r.items[i].lesson].max += pts;
        if (i < r.correct.size() && r.correct[i]) perLesson[r.items[i].lesson].pts += pts;
    }
    beginCard("perlesson", p.surface, p.line, 18);
    heading("Per lektion", 3);
    for (auto& [li, s] : perLesson) {
        float f = s.max ? (float)s.pts / s.max : 0;
        ImGui::TextUnformatted(c.lessons[li].title.c_str());
        ImGui::SameLine(ImGui::GetContentRegionAvail().x * 0.55f);
        progressBar(f, ImGui::GetContentRegionAvail().x * 0.3f, 7, f < 0.5f ? p.bad : f < 0.75f ? p.copper : p.mask);
        ImGui::SameLine();
        ImGui::TextDisabled("%d/%d", s.pts, s.max);
    }
    endCard();

    // Genomgång
    heading("Genomgång", 2);
    if (chip("Alla", !reviewOnlyWrong_)) reviewOnlyWrong_ = false;
    ImGui::SameLine();
    if (chip("Bara fel", reviewOnlyWrong_)) reviewOnlyWrong_ = true;
    spacing(8);
    for (size_t i = 0; i < r.items.size(); i++) {
        const bool ok = i < r.correct.size() && r.correct[i];
        if (reviewOnlyWrong_ && ok) continue;
        const ExamItem& item = r.items[i];
        const Question& q = *c.lessons[item.lesson].questions[item.question];
        AnswerState a = i < r.answers.size() ? r.answers[i] : AnswerState{};
        QuestionContext ctx;
        ctx.mode = QuestionMode::Review;
        ctx.number = (int)i + 1;
        ctx.total = (int)r.items.size();
        ctx.from = "Lektion " + std::to_string(item.lesson + 1);
        ctx.optionOrder = &item.optionOrder;
        ctx.uid = "review-" + std::to_string(r.timestamp) + "-" + std::to_string(i);
        beginCard(ctx.uid.c_str(), p.surface, ok ? p.ok : p.bad, 18);
        questions_.draw(q, a, ctx);
        if (!q.isAnswered(a)) {
            ImGui::PushStyleColor(ImGuiCol_Text, toVec4(p.bad));
            ImGui::TextUnformatted("Obesvarad.");
            ImGui::PopStyleColor();
        }
        endCard();
    }
}

}  // namespace nt::ui
