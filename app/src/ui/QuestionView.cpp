#include "QuestionView.h"

#include <algorithm>
#include <chrono>

#include <imgui.h>
#include <imgui_stdlib.h>

#include "CodeView.h"
#include "RichText.h"
#include "Theme.h"
#include "Widgets.h"
#include "run/Judge.h"

namespace nt::ui {

using namespace std::chrono_literals;

template <typename T>
static bool ready(std::future<T>& f) {
    return f.valid() && f.wait_for(0ms) == std::future_status::ready;
}

void noteBox(const std::string& html, unsigned bg, unsigned labelColor, const char* label) {
    const float pad = px(12);
    const float width = ImGui::GetContentRegionAvail().x;
    ImFont* lf = fonts().bold;
    std::string full = label ? std::string("<strong>") + label + "</strong> " + html : html;
    const float h = richTextHeight(full, width - pad * 2) + pad * 2;
    ImVec2 a = ImGui::GetCursorScreenPos();
    ImGui::GetWindowDrawList()->AddRectFilled(a, ImVec2(a.x + width, a.y + h), bg, px(8));
    (void)lf;
    (void)labelColor;
    ImGui::SetCursorScreenPos(ImVec2(a.x + pad, a.y + pad));
    std::string link = richText(full, width - pad * 2);
    if (!link.empty() && link.rfind("http", 0) == 0) openUrl(link);
    ImGui::SetCursorScreenPos(ImVec2(a.x, a.y + h));
    ImGui::Dummy(ImVec2(width, px(6)));
}

bool QuestionView::anyRunning() const {
    for (auto& [id, s] : code_)
        if (s->run.valid() || s->tests.valid()) return true;
    return false;
}

static void header(const Question& q, const QuestionContext& ctx) {
    const Palette& p = pal();
    std::string left = "FRÅGA " + std::to_string(ctx.number) + " AV " + std::to_string(ctx.total);
    if (!ctx.from.empty()) left += " · " + ctx.from;
    if (ctx.mode != QuestionMode::Practice) left += " · " + std::to_string(q.points()) + " P";
    ImGui::PushFont(fonts().small);
    ImGui::PushStyleColor(ImGuiCol_Text, toVec4(p.copper));
    ImGui::TextUnformatted(left.c_str());
    ImGui::PopStyleColor();
    ImGui::PopFont();
    const char* label = typeLabel(q.type());
    float w = fonts().small->CalcTextSizeA(fonts().small->FontSize, FLT_MAX, 0, label).x + px(14);
    ImGui::SameLine(ImGui::GetContentRegionMax().x - w);
    if (q.type() == QuestionType::Code) tag(label, p.codeBg, p.hlKeyword);
    else tag(label, p.paper, p.muted);
    spacing(2);
    RichStyle rs;
    rs.font = fonts().bold;
    std::string link = richText(q.prompt(), -1, rs);
    if (!link.empty()) openUrl(link);
    spacing(4);
}

static void feedback(const Question& q, bool ok) {
    const Palette& p = pal();
    noteBox(q.why(), ok ? p.okSoft : p.badSoft, ok ? p.ok : p.bad, ok ? "Rätt." : "Inte riktigt.");
}

bool QuestionView::draw(const Question& q, AnswerState& a, const QuestionContext& ctx) {
    ImGui::PushID(ctx.uid.c_str());
    header(q, ctx);
    bool changed = false;
    switch (q.type()) {
        case QuestionType::SingleChoice: changed = drawChoice(q, a, ctx, false); break;
        case QuestionType::MultiChoice:  changed = drawChoice(q, a, ctx, true); break;
        case QuestionType::TextAnswer:   changed = drawText(q, a, ctx); break;
        case QuestionType::Code:         changed = drawCode(q, a, ctx); break;
    }
    ImGui::PopID();
    return changed;
}

// ------------------------------------------------------------------ flerval och flera rätt

bool QuestionView::drawChoice(const Question& q, AnswerState& a, const QuestionContext& ctx, bool multi) {
    const Palette& p = pal();
    const std::vector<std::string>& options = multi ? static_cast<const MultiChoiceQuestion&>(q).options()
                                                    : static_cast<const SingleChoiceQuestion&>(q).options();
    auto isCorrect = [&](int i) {
        return multi ? static_cast<const MultiChoiceQuestion&>(q).answers().count(i) > 0
                     : static_cast<const SingleChoiceQuestion&>(q).answer() == i;
    };
    const bool showResult = ctx.mode == QuestionMode::Review || (ctx.mode == QuestionMode::Practice && a.checked);
    bool changed = false;
    const float width = ImGui::GetContentRegionAvail().x;
    const float pad = px(10), markerW = px(26);

    for (size_t pos = 0; pos < options.size(); pos++) {
        const int i = ctx.optionOrder && pos < ctx.optionOrder->size() ? (*ctx.optionOrder)[pos] : (int)pos;
        const bool picked = multi ? a.picks.count(i) > 0 : a.choice == i;
        const float textW = width - pad * 2 - markerW;
        const float h = richTextHeight(options[i], textW) + pad * 2;

        ImGui::PushID((int)pos);
        Clickable c;
        bool clicked = clickableArea("opt", h, c, width) && !showResult;
        ImGui::PopID();

        // Färger efter läge: vald, rätt, fel eller missad.
        ImU32 bg = p.paper, border = p.line;
        if (showResult) {
            if (isCorrect(i) && picked) { bg = p.okSoft; border = p.ok; }
            else if (picked) { bg = p.badSoft; border = p.bad; }
            else if (isCorrect(i)) { bg = multi ? p.paper : p.okSoft; border = p.ok; }
        } else if (picked) {
            bg = p.surface;
            border = p.ink;
        } else if (c.hovered) {
            border = p.mask;
        }
        ImDrawList* dl = ImGui::GetWindowDrawList();
        dl->AddRectFilled(c.min, c.max, bg, px(8));
        dl->AddRect(c.min, c.max, border, px(8), 0, picked || showResult ? px(1.8f) : px(1.2f));
        // Markör: bokstav för flerval, fyrkant för flera rätt.
        ImVec2 m(c.min.x + pad, c.min.y + pad + px(2));
        if (multi) {
            ImVec2 b(m.x + px(15), m.y + px(15));
            if (picked) dl->AddRectFilled(m, b, showResult ? border : p.ink, px(3));
            else dl->AddRect(m, b, p.muted, px(3), 0, px(1.5f));
        } else {
            char letter[2] = {(char)('A' + pos), 0};
            dl->AddText(fonts().mono, fonts().mono->FontSize, m, p.muted, letter);
        }
        ImVec2 after = ImGui::GetCursorScreenPos();
        ImGui::SetCursorScreenPos(ImVec2(c.min.x + pad + markerW, c.min.y + pad));
        richText(options[i], textW);
        ImGui::SetCursorScreenPos(after);
        spacing(2);

        if (clicked && ctx.mode != QuestionMode::Review) {
            if (multi) {
                if (picked) a.picks.erase(i);
                else a.picks.insert(i);
            } else {
                a.choice = i;
                if (ctx.mode == QuestionMode::Practice) {  // flerval rättas direkt vid klick
                    a.checked = true;
                    a.correct = q.grade(a);
                }
            }
            changed = true;
        }
    }

    if (ctx.mode == QuestionMode::Practice && multi && !a.checked) {
        spacing(4);
        if (button("Kontrollera", ButtonKind::Primary, ImVec2(0, 0), !a.picks.empty())) {
            a.checked = true;
            a.correct = q.grade(a);
            changed = true;
        }
        ImGui::SameLine();
        ImGui::AlignTextToFramePadding();
        ImGui::TextDisabled("Välj alla alternativ som stämmer.");
    } else if (ctx.mode == QuestionMode::Exam && multi) {
        ImGui::TextDisabled("Välj alla alternativ som stämmer.");
    }
    if (showResult) {
        spacing(4);
        feedback(q, q.grade(a));
        if (ctx.mode == QuestionMode::Practice && button("Försök igen")) {
            a = AnswerState{};
            changed = true;
        }
    }
    return changed;
}

// ------------------------------------------------------------------ fritext

bool QuestionView::drawText(const Question& q, AnswerState& a, const QuestionContext& ctx) {
    const auto& tq = static_cast<const TextQuestion&>(q);
    const Palette& p = pal();
    const bool showResult = ctx.mode == QuestionMode::Review || (ctx.mode == QuestionMode::Practice && a.checked);
    const bool ok = q.grade(a);
    bool changed = false;

    ImGui::PushFont(fonts().mono);
    ImGui::SetNextItemWidth(-1);
    int colors = 0;
    if (showResult) {
        ImGui::PushStyleColor(ImGuiCol_FrameBg, toVec4(ok ? p.okSoft : p.badSoft));
        ImGui::PushStyleColor(ImGuiCol_Border, toVec4(ok ? p.ok : p.bad));
        colors = 2;
    }
    ImGuiInputTextFlags flags = ImGuiInputTextFlags_EnterReturnsTrue;
    if (ctx.mode == QuestionMode::Review) flags |= ImGuiInputTextFlags_ReadOnly;
    const std::string hint = tq.placeholder().empty() ? "Ditt svar" : tq.placeholder();
    std::string before = a.text;
    bool enter = ImGui::InputTextWithHint("##answer", hint.c_str(), &a.text, flags);
    if (a.text != before) {
        changed = true;
        if (ctx.mode == QuestionMode::Practice) a.checked = false;
    }
    ImGui::PopStyleColor(colors);
    ImGui::PopFont();

    if (ctx.mode == QuestionMode::Practice) {
        spacing(2);
        if (button("Kontrollera", ButtonKind::Primary) || enter) {
            a.checked = true;
            a.correct = q.grade(a);
            changed = true;
        }
        ImGui::SameLine();
        ImGui::AlignTextToFramePadding();
        if (a.checked) {
            ImGui::PushStyleColor(ImGuiCol_Text, toVec4(ok ? p.ok : p.bad));
            ImGui::TextUnformatted(ok ? "Rätt" : "Inte riktigt, försök igen eller läs förklaringen");
            ImGui::PopStyleColor();
        } else {
            ImGui::TextDisabled("Enter kontrollerar. Stora/små bokstäver och mellanslag spelar ingen roll.");
        }
    }
    if (showResult) {
        spacing(4);
        feedback(q, ok);
        std::string accepted = "Godkända svar: ";
        for (size_t i = 0; i < tq.accepted().size(); i++)
            accepted += (i ? ", " : "") + std::string("<code>") + tq.accepted()[i] + "</code>";
        mutedText(accepted);
    }
    return changed;
}

// ------------------------------------------------------------------ kod

void QuestionView::setEditorLanguage(CodeState& s, Language l) {
    s.lang = l;
    s.editor.SetLanguageDefinition(l == Language::Python ? pythonLanguage()
                                   : l == Language::C    ? TextEditor::LanguageDefinition::C()
                                                         : TextEditor::LanguageDefinition::CPlusPlus());
}

static void testList(const std::vector<TestResult>& results) {
    const Palette& p = pal();
    for (size_t i = 0; i < results.size(); i++) {
        const TestResult& r = results[i];
        std::string in = r.input;
        std::replace(in.begin(), in.end(), '\n', ' ');
        std::string html = std::string("<strong>") + (r.passed ? "OK" : "FEL") + "</strong>  Test " + std::to_string(i + 1) +
                           ": indata <code>" + (in.empty() ? "(tom)" : in) + "</code>";
        noteBox(html, r.passed ? p.okSoft : p.badSoft, 0, nullptr);
        if (!r.passed) {
            std::string detail = "Förväntat:\n" + r.expected + "\n\nFick:\n" + r.actual + (r.error.empty() ? "" : "\n" + r.error);
            ImGui::PushFont(fonts().mono);
            ImGui::PushStyleColor(ImGuiCol_Text, toVec4(p.ink));
            ImGui::Indent(px(12));
            ImGui::TextWrapped("%s", detail.c_str());
            ImGui::Unindent(px(12));
            ImGui::PopStyleColor();
            ImGui::PopFont();
            spacing(4);
        }
    }
}

bool QuestionView::drawCode(const Question& q, AnswerState& a, const QuestionContext& ctx) {
    const auto& cq = static_cast<const CodeQuestion&>(q);
    const CodeTask& task = cq.task();
    const Palette& p = pal();
    bool changed = false;

    // Första gången: välj språk och fyll i startkoden.
    auto& slot = code_[ctx.uid];
    if (!slot) {
        slot = std::make_unique<CodeState>();
        if (a.code.empty() || !task.supports(a.language)) {
            Language l = task.supports(ctx.preferred) ? ctx.preferred : task.languages().front();
            if (!task.supports(a.language) || a.code.empty()) a.language = l;
        }
        if (!a.code.count(a.language)) a.code[a.language] = task.starter.at(a.language);
        setEditorLanguage(*slot, a.language);
        slot->editor.SetPalette(editorPalette());
        slot->editor.SetShowWhitespaces(false);
        slot->editor.SetTabSize(4);
        slot->editor.SetText(a.code[a.language]);
        slot->editor.SetReadOnly(ctx.mode == QuestionMode::Review);
        slot->input = task.tests.empty() ? "" : task.tests.front().input;
    }
    CodeState& s = *slot;

    // Färdiga bakgrundsjobb?
    if (ready(s.run)) { s.lastRun = s.run.get(); s.hasRun = true; }
    if (ready(s.tests)) {
        a.results = s.tests.get();
        a.checked = true;
        a.correct = q.grade(a);
        changed = true;
    }

    // Språkväljare
    if (task.languages().size() > 1 && ctx.mode != QuestionMode::Review) {
        ImGui::AlignTextToFramePadding();
        ImGui::TextUnformatted("Språk");
        ImGui::SameLine();
        for (Language l : task.languages()) {
            if (chip(displayName(l), l == s.lang) && l != s.lang) {
                a.code[s.lang] = s.editor.GetText();
                if (!a.code.count(l)) a.code[l] = task.starter.at(l);
                setEditorLanguage(s, l);
                s.editor.SetText(a.code[l]);
                a.language = l;
                a.results.clear();
                a.checked = false;
                changed = true;
            }
            ImGui::SameLine();
        }
        ImGui::NewLine();
    } else {
        ImGui::TextDisabled("Språk: %s", displayName(s.lang));
    }

    if (!task.tests.empty()) {
        std::string ex = "Exempel: indata <code>" + task.tests.front().input + "</code> ger utdata <code>" + task.tests.front().expected + "</code>";
        for (char& c : ex) if (c == '\n') c = ' ';
        mutedText(ex);
    }

    // Redigeraren: höjden följer antalet rader.
    ImFont* mono = fonts().mono;
    const int lines = std::max(8, s.editor.GetTotalLines() + 1);
    const float h = std::min(px(520), lines * mono->FontSize * 1.32f + px(16));
    ImGui::PushFont(mono);
    s.editor.Render("##editor", ImVec2(-1, h), true);
    ImGui::PopFont();
    if (s.editor.IsTextChanged()) {
        a.code[s.lang] = s.editor.GetText();
        a.language = s.lang;
        if (ctx.mode == QuestionMode::Practice) a.checked = false;
        changed = true;
    }

    if (ctx.mode != QuestionMode::Review) {
        spacing(4);
        const float half = (ImGui::GetContentRegionAvail().x - px(10)) * 0.42f;
        ImGui::BeginGroup();
        ImGui::TextDisabled("INDATA (stdin)");
        ImGui::PushFont(mono);
        ImGui::InputTextMultiline("##stdin", &s.input, ImVec2(half, px(80)));
        ImGui::PopFont();
        ImGui::EndGroup();
        ImGui::SameLine(0, px(10));
        ImGui::BeginGroup();
        ImGui::TextDisabled("UTDATA");
        ImVec2 o = ImGui::GetCursorScreenPos();
        const float ow = ImGui::GetContentRegionAvail().x;
        ImGui::GetWindowDrawList()->AddRectFilled(o, ImVec2(o.x + ow, o.y + px(80)), p.codeBg, px(7));
        ImGui::PushStyleColor(ImGuiCol_Text, toVec4(p.codeFg));
        ImGui::PushStyleVar(ImGuiStyleVar_WindowPadding, ImVec2(px(8), px(6)));
        ImGui::BeginChild("##out", ImVec2(ow, px(80)), ImGuiChildFlags_AlwaysUseWindowPadding, ImGuiWindowFlags_NoBackground);
        ImGui::PushFont(mono);
        if (s.run.valid()) ImGui::TextDisabled("Kör…");
        else if (!s.hasRun) ImGui::TextDisabled("Tryck Kör för att köra programmet.");
        else {
            ImGui::TextUnformatted(s.lastRun.out.c_str());
            if (!s.lastRun.ok || !s.lastRun.err.empty()) {
                ImGui::PushStyleColor(ImGuiCol_Text, toVec4(p.bad));
                ImGui::TextWrapped("%s%s%s", s.lastRun.error.c_str(), s.lastRun.err.empty() ? "" : "\n", s.lastRun.err.c_str());
                ImGui::PopStyleColor();
            }
        }
        ImGui::PopFont();
        ImGui::EndChild();
        ImGui::PopStyleVar();
        ImGui::PopStyleColor();
        ImGui::EndGroup();

        spacing(4);
        const bool busy = s.run.valid() || s.tests.valid();
        if (button(s.run.valid() ? "Kör…" : "Kör", ButtonKind::Normal, ImVec2(0, 0), !busy)) {
            Toolchain tc = tc_;
            Language l = s.lang;
            std::string codeNow = s.editor.GetText(), input = s.input;
            s.run = std::async(std::launch::async, [tc, l, codeNow, input] { return makeRunner(l, tc)->run(codeNow, input); });
        }
        ImGui::SameLine();
        if (ctx.mode == QuestionMode::Practice) {
            if (button(s.tests.valid() ? "Kör testerna…" : "Kör testerna", ButtonKind::Primary, ImVec2(0, 0), !busy)) {
                Toolchain tc = tc_;
                Language l = s.lang;
                std::string codeNow = s.editor.GetText();
                std::vector<TestCase> tests = task.tests;
                s.tests = std::async(std::launch::async, [tc, l, codeNow, tests] { return runTests(*makeRunner(l, tc), codeNow, tests); });
            }
            ImGui::SameLine();
        }
        if (button("Återställ", ButtonKind::Ghost, ImVec2(0, 0), !busy)) {
            a.code[s.lang] = task.starter.at(s.lang);
            s.editor.SetText(a.code[s.lang]);
            a.results.clear();
            a.checked = false;
            changed = true;
        }
        if (ctx.mode == QuestionMode::Exam) {
            ImGui::SameLine();
            ImGui::AlignTextToFramePadding();
            ImGui::TextDisabled("Dolda tester körs när du lämnar in.");
        } else if (!a.results.empty()) {
            int passed = 0;
            for (auto& r : a.results) passed += r.passed;
            ImGui::SameLine();
            ImGui::AlignTextToFramePadding();
            ImGui::PushStyleColor(ImGuiCol_Text, toVec4(passed == (int)a.results.size() ? p.ok : p.bad));
            ImGui::Text("%d av %d tester godkända", passed, (int)a.results.size());
            ImGui::PopStyleColor();
        }
    }

    if (ctx.mode != QuestionMode::Exam && !a.results.empty()) {
        spacing(4);
        testList(a.results);
        feedback(q, q.grade(a));
    }
    // Lösningsförslaget visas efter ett försök, och alltid i genomgången.
    const bool canShow = ctx.mode == QuestionMode::Review || (ctx.mode == QuestionMode::Practice && !a.results.empty());
    if (canShow && task.solution.count(s.lang)) {
        if (ImGui::TreeNode("Visa lösningsförslag")) {
            codeBlock(ctx.uid + "-sol", task.solution.at(s.lang), extension(s.lang), std::string("lösningsförslag · ") + displayName(s.lang));
            ImGui::TreePop();
        }
    }
    return changed;
}

}  // namespace nt::ui
