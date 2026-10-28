#include "App.h"

#include <imgui.h>

#include "RichText.h"
#include "Theme.h"
#include "Widgets.h"

namespace nt::ui {

App::App(std::vector<Course> courses, Toolchain tc, std::string loadError)
    : courses_(std::move(courses)), tc_(std::move(tc)), loadError_(std::move(loadError)), questions_(tc_) {
    setDark(progress_.darkMode());
    examConfig_.language = progress_.preferredLanguage();
}

void App::go(Route r) {
    if (r == route_) return;
    history_.push_back(route_);
    route_ = r;
    scrollTop_ = true;
    practiceFilter_ = -1;
}

void App::back() {
    if (history_.empty()) return;
    route_ = history_.back();
    history_.pop_back();
    scrollTop_ = true;
}

void App::openRoute(const std::string& spec) {
    std::vector<std::string> parts;
    size_t start = 0;
    while (true) {
        size_t c = spec.find(':', start);
        parts.push_back(spec.substr(start, c == std::string::npos ? std::string::npos : c - start));
        if (c == std::string::npos) break;
        start = c + 1;
    }
    auto num = [&](size_t i) { return i < parts.size() ? std::atoi(parts[i].c_str()) : -1; };
    const std::string& s = parts[0];
    if (s == "course") go({Screen::Course, num(1)});
    else if (s == "lesson") go({Screen::Lesson, num(1), num(2)});
    else if (s == "exam") go({Screen::Exam, num(1)});
    else if (s == "assign") go({Screen::Assignments, num(1)});
    else if (s == "res") go({Screen::Resources, num(1)});
    else if (s == "lab") go({Screen::Lab});
    else if (s == "about") go({Screen::About});
    else if (s == "examrun") {
        go({Screen::Exam, num(1)});
        examConfig_.count = 10;
        exam_ = std::make_unique<Exam>(courses_[num(1)], examConfig_, rng_);
        examCurrent_ = num(2) > 0 ? num(2) : 0;
        examFlags_.assign(exam_->items().size(), false);
    }
}

void App::handleLink(const std::string& href) {
    if (href.rfind("http", 0) == 0) openUrl(href);
    else if (href == "#app") go({Screen::About});
}

// ------------------------------------------------------------------ fönstrets ram

void App::frame() {
    const Palette& p = pal();
    const ImGuiViewport* vp = ImGui::GetMainViewport();
    ImGui::SetNextWindowPos(vp->WorkPos);
    ImGui::SetNextWindowSize(vp->WorkSize);
    ImGui::Begin("Nollterm", nullptr,
                 ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoBringToFrontOnFocus |
                     ImGuiWindowFlags_NoSavedSettings);

    // Kortkommando: Alt+vänsterpil eller musens bakåtknapp går tillbaka.
    if ((ImGui::GetIO().KeyAlt && ImGui::IsKeyPressed(ImGuiKey_LeftArrow)) || ImGui::IsMouseClicked(ImGuiMouseButton_Middle + 1))
        back();

    drawTopBar();

    const float sideW = px(280);
    ImGui::PushStyleColor(ImGuiCol_ChildBg, toVec4(p.paper));
    ImGui::PushStyleVar(ImGuiStyleVar_WindowPadding, ImVec2(px(18), px(20)));
    ImGui::BeginChild("sidebar", ImVec2(sideW, 0), ImGuiChildFlags_AlwaysUseWindowPadding);
    drawSidebar();
    ImGui::EndChild();
    ImGui::PopStyleVar();
    ImGui::PopStyleColor();

    ImGui::SameLine(0, 0);
    ImGui::BeginChild("content", ImVec2(0, 0), ImGuiChildFlags_None);
    if (scrollTop_) { ImGui::SetScrollY(0); scrollTop_ = false; }
    if (debugScroll >= 0 && debugScrollFrames_ < 8) {  // bara de första bildrutorna, sedan får man skrolla fritt
        ImGui::SetScrollY(debugScroll <= 1 ? debugScroll * ImGui::GetScrollMaxY() : debugScroll);
        debugScrollFrames_++;
    }

    // Läskolumnen: max ca 860 px bred, centrerad.
    const float avail = ImGui::GetContentRegionAvail().x;
    const float colW = std::min(avail - px(48), px(860));
    ImGui::SetCursorPos(ImVec2(std::max(px(24), (avail - colW) * 0.5f), px(26)));
    ImGui::BeginChild("page", ImVec2(colW, 0), ImGuiChildFlags_AutoResizeY, ImGuiWindowFlags_NoScrollbar);

    if (!loadError_.empty()) {
        noteBox(loadError_, p.badSoft, p.bad, "Kunde inte läsa kursinnehållet.");
    }
    switch (route_.screen) {
        case Screen::Home:        viewHome(); break;
        case Screen::Course:      viewCourse(); break;
        case Screen::Lesson:      viewLesson(); break;
        case Screen::Exam:        viewExam(); break;
        case Screen::Assignments: viewAssignments(); break;
        case Screen::Resources:   viewResources(); break;
        case Screen::Lab:         viewLab(); break;
        case Screen::About:       viewAbout(); break;
    }
    spacing(60);
    ImGui::EndChild();
    ImGui::EndChild();
    ImGui::End();

    progress_.saveIfDirty();
}

void App::drawTopBar() {
    const Palette& p = pal();
    const float h = px(56);
    ImVec2 a = ImGui::GetCursorScreenPos();
    ImDrawList* dl = ImGui::GetWindowDrawList();
    dl->AddRectFilled(a, ImVec2(a.x + ImGui::GetContentRegionAvail().x, a.y + h), p.surface);
    dl->AddLine(ImVec2(a.x, a.y + h - 1), ImVec2(a.x + ImGui::GetContentRegionAvail().x, a.y + h - 1), p.line);

    // Logotyp: "nollterm\0"
    ImGui::SetCursorScreenPos(ImVec2(a.x + px(20), a.y + (h - fonts().h3->FontSize) / 2));
    ImGui::PushFont(fonts().h3);
    ImGui::TextUnformatted("nollterm");
    ImGui::PopFont();
    ImGui::SameLine(0, px(2));
    ImGui::PushFont(fonts().mono);
    ImGui::PushStyleColor(ImGuiCol_Text, toVec4(p.mask));
    ImGui::TextUnformatted("\\0");
    ImGui::PopStyleColor();
    ImGui::PopFont();

    // Navigering
    ImGui::SetCursorScreenPos(ImVec2(a.x + px(200), a.y + (h - ImGui::GetFrameHeight()) / 2));
    auto nav = [&](const char* label, bool active, Route r) {
        ImGui::PushStyleColor(ImGuiCol_Button, toVec4(active ? p.paper : withAlpha(p.surface, 0)));
        ImGui::PushStyleColor(ImGuiCol_Border, toVec4(withAlpha(p.surface, 0)));
        ImGui::PushStyleColor(ImGuiCol_Text, toVec4(active ? p.ink : p.muted));
        if (ImGui::Button(label)) go(r);
        if (ImGui::IsItemHovered()) ImGui::SetMouseCursor(ImGuiMouseCursor_Hand);
        ImGui::PopStyleColor(3);
        ImGui::SameLine();
    };
    if (ImGui::ArrowButton("##back", ImGuiDir_Left)) back();
    if (ImGui::IsItemHovered()) ImGui::SetTooltip("Tillbaka (Alt+vänsterpil)");
    ImGui::SameLine();
    nav("Kurser", route_.screen == Screen::Home, {Screen::Home});
    if (route_.course >= 0) {
        const Course& c = courses_[route_.course];
        nav(c.shortName.c_str(), route_.screen == Screen::Course || route_.screen == Screen::Lesson, {Screen::Course, route_.course});
        nav("Prov", route_.screen == Screen::Exam, {Screen::Exam, route_.course});
    }
    nav("Kodlabb", route_.screen == Screen::Lab, {Screen::Lab, route_.course});
    nav("Om appen", route_.screen == Screen::About, {Screen::About, route_.course});

    // Mörkt läge till höger
    const char* modeLabel = isDark() ? "Ljust läge" : "Mörkt läge";
    float w = ImGui::CalcTextSize(modeLabel).x + px(28);
    ImGui::SetCursorScreenPos(ImVec2(ImGui::GetWindowPos().x + ImGui::GetWindowWidth() - w - px(16), a.y + (h - ImGui::GetFrameHeight()) / 2));
    if (ImGui::Button(modeLabel)) {
        setDark(!isDark());
        progress_.setDarkMode(isDark());
    }
    ImGui::SetCursorScreenPos(ImVec2(a.x, a.y + h));
}

// ------------------------------------------------------------------ sidomenyn

bool App::sidebarLink(const std::string& label, const std::string& right, bool active, bool done, int number) {
    const Palette& p = pal();
    const float w = ImGui::GetContentRegionAvail().x;
    const float textX = number >= 0 ? px(34) : px(8);
    const float textW = w - textX - px(36);
    RichStyle rs;
    rs.lineSpacing = 1.3f;
    const float h = std::max(px(34), richTextHeight(label, textW, rs) + px(14));
    Clickable c;
    ImGui::PushID(label.c_str());
    bool clicked = clickableArea("link", h, c, w);
    ImGui::PopID();
    ImDrawList* dl = ImGui::GetWindowDrawList();
    if (active) dl->AddRectFilled(c.min, c.max, p.maskSoft, px(6));
    else if (c.hovered) dl->AddRectFilled(c.min, c.max, p.surface, px(6));
    ImVec2 after = ImGui::GetCursorScreenPos();
    if (number >= 0) {
        char n[16];
        snprintf(n, sizeof n, "%02d", number);
        dl->AddText(fonts().mono, fonts().small->FontSize, ImVec2(c.min.x + px(8), c.min.y + px(9)), p.muted, n);
    }
    ImGui::SetCursorScreenPos(ImVec2(c.min.x + textX, c.min.y + px(7)));
    richText(label, textW, rs);
    if (!right.empty()) {
        float rw = ImGui::CalcTextSize(right.c_str()).x;
        dl->AddText(fonts().small, fonts().small->FontSize, ImVec2(c.max.x - rw - px(4), c.min.y + px(9)), p.muted, right.c_str());
    } else if (number >= 0) {
        ImVec2 center(c.max.x - px(14), c.min.y + h / 2);
        if (done) dl->AddCircleFilled(center, px(6), p.mask);
        else dl->AddCircle(center, px(6), p.line, 0, px(1.5f));
    }
    ImGui::SetCursorScreenPos(after);
    return clicked;
}

void App::drawSidebar() {
    const Palette& p = pal();
    if (route_.course < 0 || route_.course >= (int)courses_.size()) {
        ImGui::PushFont(fonts().h3);
        ImGui::TextUnformatted("Dina kurser");
        ImGui::PopFont();
        spacing(8);
        for (int i = 0; i < (int)courses_.size(); i++)
            if (sidebarLink(courses_[i].title, std::to_string(courses_[i].lessons.size()) + " lekt.", false))
                go({Screen::Course, i});
        spacing(10);
        ImGui::Separator();
        spacing(6);
        if (sidebarLink("Kodlabb", displayName(labLang_), route_.screen == Screen::Lab)) go({Screen::Lab});
        if (sidebarLink("Om appen", "", route_.screen == Screen::About)) go({Screen::About});
        return;
    }
    const int ci = route_.course;
    const Course& c = courses_[ci];
    if (sidebarLink("← Alla kurser", "", false)) go({Screen::Home});
    spacing(4);
    ImGui::PushFont(fonts().h3);
    ImGui::PushTextWrapPos(0);
    ImGui::TextUnformatted(c.title.c_str());
    ImGui::PopTextWrapPos();
    ImGui::PopFont();
    spacing(6);
    if (sidebarLink("Lektioner", std::to_string(c.lessons.size()), route_.screen == Screen::Course)) go({Screen::Course, ci});
    if (sidebarLink("Prov", std::to_string(c.questionCount()) + " frågor", route_.screen == Screen::Exam)) go({Screen::Exam, ci});
    if (sidebarLink("Uppgifter", std::to_string(c.assignments.size()), route_.screen == Screen::Assignments)) go({Screen::Assignments, ci});
    if (sidebarLink("Resurser", std::to_string(c.sources.size()), route_.screen == Screen::Resources)) go({Screen::Resources, ci});
    spacing(8);
    ImGui::Separator();
    spacing(8);
    eyebrow("Lektioner");
    spacing(2);
    for (int i = 0; i < (int)c.lessons.size(); i++) {
        bool active = route_.screen == Screen::Lesson && route_.lesson == i;
        if (sidebarLink(c.lessons[i].title, "", active, progress_.isDone(c.id, c.lessons[i].id), i + 1))
            go({Screen::Lesson, ci, i});
    }
    spacing(14);
    const int done = progress_.doneCount(c.id);
    beginCard("journey", p.surface, p.line, 14);
    ImGui::PushFont(fonts().bold);
    ImGui::TextUnformatted("Din lärresa");
    ImGui::PopFont();
    progressBar(c.lessons.empty() ? 0 : (float)done / c.lessons.size(), ImGui::GetContentRegionAvail().x - px(28));
    ImGui::PushFont(fonts().small);
    ImGui::TextDisabled("%d av %d lektioner klara.", done, (int)c.lessons.size());
    ImGui::PopFont();
    endCard();
}

}  // namespace nt::ui
