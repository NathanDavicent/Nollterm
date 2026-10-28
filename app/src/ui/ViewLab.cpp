// Kodlabbet: en fri editor där du kan skriva och köra C, C++ och Python.

#include <chrono>

#include <imgui.h>
#include <imgui_stdlib.h>

#include "App.h"
#include "CodeView.h"
#include "Theme.h"
#include "Widgets.h"

namespace nt::ui {

static std::string labTemplate(Language l) {
    switch (l) {
        case Language::C:
            return "#include <stdio.h>\n\nint main(void) {\n    int n;\n    scanf(\"%d\", &n);\n    for (int i = 1; i <= n; i++) {\n"
                   "        printf(\"%d * %d = %d\\n\", i, i, i * i);\n    }\n    return 0;\n}\n";
        case Language::Cpp:
            return "#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n"
                   "    cin >> n;\n    vector<int> squares;\n    for (int i = 1; i <= n; i++) squares.push_back(i * i);\n"
                   "    for (int s : squares) cout << s << \" \";\n    cout << endl;\n    return 0;\n}\n";
        case Language::Python:
            return "n = int(input())\nsquares = [i * i for i in range(1, n + 1)]\nprint(*squares)\n";
    }
    return "";
}

void App::viewLab() {
    const Palette& p = pal();
    if (!labInit_) {
        labLang_ = progress_.preferredLanguage();
        std::string saved = progress_.labCode(labLang_);
        labEditor_.SetPalette(editorPalette());
        labEditor_.SetTabSize(4);
        labEditor_.SetShowWhitespaces(false);
        labEditor_.SetLanguageDefinition(labLang_ == Language::Python ? pythonLanguage()
                                         : labLang_ == Language::C    ? TextEditor::LanguageDefinition::C()
                                                                      : TextEditor::LanguageDefinition::CPlusPlus());
        labEditor_.SetText(saved.empty() ? labTemplate(labLang_) : saved);
        labInput_ = progress_.labInput().empty() ? "5" : progress_.labInput();
        labInit_ = true;
    }
    if (labRun_.valid() && labRun_.wait_for(std::chrono::milliseconds(0)) == std::future_status::ready) {
        labResult_ = labRun_.get();
        labHasResult_ = true;
        labMs_ = ImGui::GetTime() * 1000 - labMs_;
    }

    eyebrow("Kodlabb");
    heading("Skriv vad du vill och <em>kör det</em>.");
    spacing(2);
    mutedText("Riktig gcc, g++ och Python. Din kod sparas automatiskt per språk.");
    spacing(10);

    ImGui::AlignTextToFramePadding();
    ImGui::TextUnformatted("Språk");
    ImGui::SameLine();
    for (Language l : kAllLanguages) {
        if (chip(displayName(l), l == labLang_) && l != labLang_) {
            progress_.setLabCode(labLang_, labEditor_.GetText());
            labLang_ = l;
            progress_.setPreferredLanguage(l);
            std::string saved = progress_.labCode(l);
            labEditor_.SetLanguageDefinition(l == Language::Python ? pythonLanguage()
                                             : l == Language::C    ? TextEditor::LanguageDefinition::C()
                                                                   : TextEditor::LanguageDefinition::CPlusPlus());
            labEditor_.SetText(saved.empty() ? labTemplate(l) : saved);
            labHasResult_ = false;
        }
        ImGui::SameLine();
    }
    if (chip("Exempelkod")) labEditor_.SetText(labTemplate(labLang_));
    spacing(6);

    ImGui::PushFont(fonts().mono);
    labEditor_.Render("##lab", ImVec2(-1, px(380)), true);
    ImGui::PopFont();
    if (labEditor_.IsTextChanged()) progress_.setLabCode(labLang_, labEditor_.GetText());

    spacing(6);
    ImGui::TextDisabled("INDATA (stdin)");
    ImGui::PushFont(fonts().mono);
    if (ImGui::InputTextMultiline("##labin", &labInput_, ImVec2(-1, px(70)))) progress_.setLabInput(labInput_);
    ImGui::PopFont();
    spacing(4);

    const bool run = button(labRun_.valid() ? "Kör…" : "Kör ▶", ButtonKind::Primary, ImVec2(0, 0), !labRun_.valid()) ||
                     (ImGui::GetIO().KeyCtrl && ImGui::IsKeyPressed(ImGuiKey_Enter));
    if (run && !labRun_.valid()) {
        Toolchain tc = tc_;
        Language l = labLang_;
        std::string code = labEditor_.GetText(), input = labInput_;
        labMs_ = ImGui::GetTime() * 1000;
        labRun_ = std::async(std::launch::async, [tc, l, code, input] { return makeRunner(l, tc)->run(code, input, 10000); });
    }
    ImGui::SameLine();
    ImGui::AlignTextToFramePadding();
    if (labHasResult_) ImGui::TextDisabled("%s på %.0f ms (Ctrl+Enter kör)", labResult_.ok ? "Klart" : "Fel", labMs_);
    else ImGui::TextDisabled("Ctrl+Enter kör");

    spacing(6);
    ImGui::TextDisabled("UTDATA");
    ImVec2 o = ImGui::GetCursorScreenPos();
    const float w = ImGui::GetContentRegionAvail().x, h = px(200);
    ImGui::GetWindowDrawList()->AddRectFilled(o, ImVec2(o.x + w, o.y + h), p.codeBg, px(8));
    ImGui::PushStyleVar(ImGuiStyleVar_WindowPadding, ImVec2(px(12), px(10)));
    ImGui::BeginChild("##labout", ImVec2(w, h), ImGuiChildFlags_AlwaysUseWindowPadding, ImGuiWindowFlags_NoBackground);
    ImGui::PushFont(fonts().mono);
    ImGui::PushStyleColor(ImGuiCol_Text, toVec4(p.codeFg));
    if (labRun_.valid()) ImGui::TextUnformatted(labLang_ == Language::Python ? "Kör…" : "Kompilerar och kör…");
    else if (labHasResult_) {
        ImGui::TextUnformatted(labResult_.out.c_str());
        if (!labResult_.err.empty() || !labResult_.ok) {
            ImGui::PushStyleColor(ImGuiCol_Text, toVec4(p.bad));
            ImGui::TextWrapped("%s%s%s", labResult_.error.c_str(), labResult_.err.empty() ? "" : "\n", labResult_.err.c_str());
            ImGui::PopStyleColor();
        }
    }
    ImGui::PopStyleColor();
    ImGui::PopFont();
    ImGui::EndChild();
    ImGui::PopStyleVar();
}

}  // namespace nt::ui
