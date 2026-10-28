// Sidorna för kurser och lektioner: startsidan, kursöversikten, lektionen,
// uppgifterna, resurserna och Om appen.

#include <algorithm>
#include <cstdio>

#include <imgui.h>

#include "App.h"
#include "CodeView.h"
#include "RichText.h"
#include "Theme.h"
#include "Widgets.h"

namespace nt::ui {

static std::string twoDigits(int n) {
    char b[16];
    snprintf(b, sizeof b, "%02d", n);
    return b;
}

// ------------------------------------------------------------------ startsidan

void App::viewHome() {
    const Palette& p = pal();
    eyebrow("Nollterm · din kursportal");
    heading("Välj en kurs. Läs, öva, <em>testa dig</em>.");
    spacing(4);
    mutedText("Varje kurs är uppdelad i lektioner med genomgång, kodövningar och frågor. Koduppgifterna kan lösas i C, C++ eller Python och körs med riktiga kompilatorer på din dator.");
    spacing(18);

    const float gap = px(16);
    const float w = (ImGui::GetContentRegionAvail().x - gap) / 2;
    for (int i = 0; i < (int)courses_.size() + 1; i++) {
        if (i % 2) ImGui::SameLine(0, gap);
        ImGui::BeginGroup();
        ImGui::PushID(i);
        const bool isCourse = i < (int)courses_.size();
        const float h = px(210);
        Clickable c;
        bool clicked = clickableArea("card", h, c, w);
        ImDrawList* dl = ImGui::GetWindowDrawList();
        dl->AddRectFilled(c.min, c.max, isCourse ? p.surface : p.paper, px(12));
        dl->AddRect(c.min, c.max, c.hovered && isCourse ? p.mask : p.line, px(12), 0, px(1.2f));
        ImVec2 after = ImGui::GetCursorScreenPos();
        ImGui::SetCursorScreenPos(ImVec2(c.min.x + px(18), c.min.y + px(18)));
        ImGui::BeginGroup();
        // PushTextWrapPos tar en x-position relativ till fönstret, inte skärmen.
        ImGui::PushTextWrapPos(c.max.x - ImGui::GetWindowPos().x - px(18));
        // Märke
        ImVec2 b = ImGui::GetCursorScreenPos();
        dl->AddRectFilled(b, ImVec2(b.x + px(48), b.y + px(48)), isCourse ? p.codeBg : p.paper, px(10));
        if (!isCourse) dl->AddRect(b, ImVec2(b.x + px(48), b.y + px(48)), p.line, px(10));
        const char* badge = isCourse ? courses_[i].badge.c_str() : "+";
        ImVec2 bs = fonts().mono->CalcTextSizeA(fonts().mono->FontSize, FLT_MAX, 0, badge);
        dl->AddText(fonts().mono, fonts().mono->FontSize, ImVec2(b.x + (px(48) - bs.x) / 2, b.y + (px(48) - bs.y) / 2),
                    isCourse ? p.hlKeyword : p.muted, badge);
        ImGui::Dummy(ImVec2(px(48), px(48)));
        spacing(4);
        if (isCourse) {
            const Course& co = courses_[i];
            ImGui::PushFont(fonts().h3);
            ImGui::TextUnformatted(co.title.c_str());
            ImGui::PopFont();
            ImGui::PushStyleColor(ImGuiCol_Text, toVec4(p.muted));
            ImGui::PushFont(fonts().small);
            ImGui::TextWrapped("%s", co.description.c_str());
            ImGui::PopFont();
            ImGui::PopStyleColor();
            spacing(2);
            const int done = progress_.doneCount(co.id);
            progressBar((float)done / std::max<size_t>(1, co.lessons.size()), w - px(36));
            ImGui::PushFont(fonts().small);
            ImGui::TextDisabled("%d lektioner · %d frågor · %d/%d klara", (int)co.lessons.size(), co.questionCount(), done,
                                (int)co.lessons.size());
            ImGui::PopFont();
        } else {
            ImGui::PushFont(fonts().h3);
            ImGui::TextUnformatted("Lägg till en kurs");
            ImGui::PopFont();
            ImGui::PushStyleColor(ImGuiCol_Text, toVec4(p.muted));
            ImGui::PushFont(fonts().small);
            ImGui::TextWrapped("Nya kurser är bara filer i mappen content/: lektioner i JSON och koduppgifter som vanliga .c-, .cpp- och .py-filer. Ingen kod behöver ändras.");
            ImGui::PopFont();
            ImGui::PopStyleColor();
        }
        ImGui::PopTextWrapPos();
        ImGui::EndGroup();
        ImGui::SetCursorScreenPos(after);
        ImGui::PopID();
        ImGui::EndGroup();
        if (clicked && isCourse) go({Screen::Course, i});
    }
    spacing(16);
    eyebrow("Verktyg");
    spacing(4);
    if (button("Öppna kodlabbet")) go({Screen::Lab});
    ImGui::SameLine();
    mutedText("En fri editor där du kan skriva och köra C, C++ och Python.");
}

// ------------------------------------------------------------------ kursen

void App::drawCourseTabs(Screen active) {
    const int ci = route_.course;
    const std::pair<const char*, Screen> tabs[] = {
        {"Lektioner", Screen::Course}, {"Prov", Screen::Exam}, {"Uppgifter", Screen::Assignments}, {"Resurser", Screen::Resources}};
    for (auto& [label, screen] : tabs) {
        if (chip(label, screen == active)) go({screen, ci});
        ImGui::SameLine();
    }
    ImGui::NewLine();
    spacing(10);
}

void App::lessonRow(const Course& c, int i) {
    const Palette& p = pal();
    const Lesson& l = c.lessons[i];
    int right = 0, total = (int)l.questions.size();
    for (int q = 0; q < total; q++) right += progress_.practice(c.id, l.id, q).correct;
    const float w = ImGui::GetContentRegionAvail().x;
    const float textW = w - px(70) - px(130);
    RichStyle lead;
    lead.color = p.muted;
    lead.font = fonts().small;
    const float h = px(16) + fonts().h3->FontSize * 1.3f + richTextHeight(l.lead, textW, lead) + px(14);
    ImGui::PushID(i);
    Clickable cl;
    bool clicked = clickableArea("row", h, cl, w);
    ImGui::PopID();
    ImDrawList* dl = ImGui::GetWindowDrawList();
    dl->AddRectFilled(cl.min, cl.max, p.surface, px(10));
    dl->AddRect(cl.min, cl.max, cl.hovered ? p.mask : p.line, px(10));
    ImVec2 after = ImGui::GetCursorScreenPos();
    dl->AddText(fonts().small, fonts().small->FontSize, ImVec2(cl.min.x + px(16), cl.min.y + px(14)), p.muted, "LEKTION");
    std::string num = twoDigits(i + 1);
    dl->AddText(fonts().h2, fonts().h2->FontSize, ImVec2(cl.min.x + px(16), cl.min.y + px(32)), p.ink, num.c_str());
    ImGui::SetCursorScreenPos(ImVec2(cl.min.x + px(70), cl.min.y + px(12)));
    ImGui::BeginGroup();
    ImGui::PushFont(fonts().h3);
    ImGui::TextUnformatted(l.title.c_str());
    ImGui::PopFont();
    richText(l.lead, textW, lead);
    ImGui::EndGroup();
    // Höger: klar / minuter, rätt svar, stapel
    const float rx = cl.max.x - px(116);
    float y = cl.min.y + px(14);
    if (progress_.isDone(c.id, l.id)) {
        ImGui::SetCursorScreenPos(ImVec2(rx, y));
        tag("klar", p.okSoft, p.ok);
    } else {
        std::string m = std::to_string(l.minutes) + " min";
        dl->AddText(fonts().small, fonts().small->FontSize, ImVec2(rx, y), p.muted, m.c_str());
    }
    std::string score = std::to_string(right) + "/" + std::to_string(total) + " rätt";
    dl->AddText(fonts().small, fonts().small->FontSize, ImVec2(rx, y + px(24)), p.muted, score.c_str());
    ImGui::SetCursorScreenPos(ImVec2(rx, y + px(46)));
    progressBar(total ? (float)right / total : 0, px(96), 5);
    ImGui::SetCursorScreenPos(after);
    spacing(4);
    if (clicked) go({Screen::Lesson, route_.course, i});
}

void App::viewCourse() {
    const Palette& p = pal();
    const Course& c = courses_[route_.course];
    drawCourseTabs(Screen::Course);
    eyebrow(c.title + " · " + c.tag);
    heading(c.headline);
    spacing(2);
    mutedText(c.description);
    spacing(8);
    int next = 0;
    while (next < (int)c.lessons.size() && progress_.isDone(c.id, c.lessons[next].id)) next++;
    if (next >= (int)c.lessons.size()) next = 0;
    std::string start = (progress_.doneCount(c.id) ? "Fortsätt med lektion " : "Börja med lektion ") + twoDigits(next + 1) + " →";
    if (button(start.c_str(), ButtonKind::Primary)) go({Screen::Lesson, route_.course, next});
    ImGui::SameLine();
    if (button("Gör ett prov")) go({Screen::Exam, route_.course});
    spacing(14);

    // Siffror
    const std::pair<int, const char*> stats[] = {{(int)c.lessons.size(), "lektioner"},
                                                 {c.questionCount(), "frågor i poolen"},
                                                 {c.codeTaskCount(), "kodfrågor"},
                                                 {(int)c.assignments.size(), "uppgifter"}};
    const float sw = ImGui::GetContentRegionAvail().x / 4;
    ImVec2 s0 = ImGui::GetCursorScreenPos();
    ImDrawList* dl = ImGui::GetWindowDrawList();
    dl->AddRectFilled(s0, ImVec2(s0.x + sw * 4, s0.y + px(70)), p.surface, px(10));
    dl->AddRect(s0, ImVec2(s0.x + sw * 4, s0.y + px(70)), p.line, px(10));
    for (int i = 0; i < 4; i++) {
        float x = s0.x + sw * i;
        if (i) dl->AddLine(ImVec2(x, s0.y), ImVec2(x, s0.y + px(70)), p.line);
        std::string n = std::to_string(stats[i].first);
        dl->AddText(fonts().h2, fonts().h2->FontSize, ImVec2(x + px(16), s0.y + px(10)), p.ink, n.c_str());
        dl->AddText(fonts().small, fonts().small->FontSize, ImVec2(x + px(16), s0.y + px(42)), p.muted, stats[i].second);
    }
    ImGui::Dummy(ImVec2(sw * 4, px(70)));
    spacing(22);

    eyebrow("Lektioner");
    heading("Lektionerna, i kursens ordning.", 2);
    spacing(8);
    std::vector<bool> shown(c.lessons.size(), false);
    for (const TimelineEntry& t : c.timeline) {
        std::vector<int> ids;
        for (auto& id : t.lessonIds) {
            int li = c.lessonIndex(id);
            if (li >= 0 && !shown[li]) { ids.push_back(li); shown[li] = true; }
        }
        if (ids.empty()) continue;
        ImGui::PushFont(fonts().small);
        ImGui::PushStyleColor(ImGuiCol_Text, toVec4(p.copper));
        ImGui::TextUnformatted(t.date.c_str());
        ImGui::PopStyleColor();
        ImGui::PopFont();
        ImGui::SameLine();
        ImGui::PushFont(fonts().bold);
        ImGui::TextUnformatted(t.title.c_str());
        ImGui::PopFont();
        for (int li : ids) lessonRow(c, li);
        spacing(10);
    }
    for (int i = 0; i < (int)c.lessons.size(); i++)
        if (!shown[i]) lessonRow(c, i);
}

// ------------------------------------------------------------------ lektionen

void App::drawBlock(const Lesson& lesson, const Block& b, int lessonIdx, int& section, int& exercise) {
    const Palette& p = pal();
    std::string link;
    switch (b.type) {
        case BlockType::Heading: {
            section++;
            spacing(22);
            char addr[16];
            snprintf(addr, sizeof addr, "0x%04X", (lessonIdx + 1) * 0x100 + section * 0x10);
            ImGui::PushFont(fonts().mono);
            ImGui::PushStyleColor(ImGuiCol_Text, toVec4(p.copper));
            ImGui::TextUnformatted(addr);
            ImGui::PopStyleColor();
            ImGui::PopFont();
            heading(b.text, 2);
            spacing(4);
            break;
        }
        case BlockType::Paragraph:
            link = richText(b.html);
            spacing(6);
            break;
        case BlockType::List:
            for (auto& item : b.items) {
                ImGui::Indent(px(22));
                ImVec2 pos = ImGui::GetCursorScreenPos();
                ImGui::GetWindowDrawList()->AddText(fonts().body, fonts().body->FontSize,
                                                    ImVec2(pos.x - px(16), pos.y + px(3)), p.muted, "\xE2\x80\xA2");
                std::string l = richText(item);
                if (!l.empty()) link = l;
                ImGui::Unindent(px(22));
            }
            spacing(6);
            break;
        case BlockType::Code:
            codeBlock(lesson.id + "-c" + std::to_string((size_t)&b), b.code, b.lang, b.caption);
            break;
        case BlockType::Table: {
            const int cols = (int)b.head.size();
            ImGui::PushID(&b);
            if (ImGui::BeginTable("table", cols, ImGuiTableFlags_Borders | ImGuiTableFlags_RowBg | ImGuiTableFlags_SizingStretchProp)) {
                ImGui::TableNextRow(ImGuiTableRowFlags_Headers);
                for (int i = 0; i < cols; i++) {
                    ImGui::TableSetColumnIndex(i);
                    ImGui::TableSetBgColor(ImGuiTableBgTarget_CellBg, p.paper);
                    ImGui::PushFont(fonts().small);
                    ImGui::TextDisabled("%s", stripTags(b.head[i]).c_str());
                    ImGui::PopFont();
                }
                for (auto& row : b.rows) {
                    ImGui::TableNextRow();
                    for (int i = 0; i < cols && i < (int)row.size(); i++) {
                        ImGui::TableSetColumnIndex(i);
                        RichStyle rs;
                        rs.font = i == 0 && b.head[0].empty() ? fonts().bold : fonts().body;
                        rs.lineSpacing = 1.35f;
                        richText(row[i], ImGui::GetContentRegionAvail().x, rs);
                    }
                }
                ImGui::EndTable();
            }
            ImGui::PopID();
            spacing(10);
            break;
        }
        case BlockType::Note: {
            const bool tip = b.kind == "tip", warn = b.kind == "warn";
            noteBox(b.html, tip ? p.maskSoft : warn ? p.copperSoft : p.badSoft, tip ? p.mask : warn ? p.copper : p.bad,
                    tip ? "Tips:" : warn ? "Se upp:" : "Felsök:");
            spacing(4);
            break;
        }
        case BlockType::Widget:
            noteBox("Här finns en interaktiv figur i webbversionen (<code>" + b.name + "</code>). Den kommer till appen i en senare version.",
                    p.surface, p.muted, "Interaktiv figur.");
            break;
        case BlockType::Exercise: {
            exercise++;
            std::string label = "ÖVN " + twoDigits(exercise) + "   " + b.title + "##ex" + std::to_string(exercise);
            ImGui::PushStyleColor(ImGuiCol_Header, toVec4(p.surface));
            ImGui::PushFont(fonts().bold);
            bool open = ImGui::CollapsingHeader(label.c_str());
            ImGui::PopFont();
            ImGui::PopStyleColor();
            if (open) {
                ImGui::Indent(px(12));
                link = richText(b.html, ImGui::GetContentRegionAvail().x - px(12));
                if (!b.solution.empty() && ImGui::TreeNode((std::string("Visa ett lösningsförslag##s") + std::to_string(exercise)).c_str())) {
                    codeBlock(lesson.id + "-ex" + std::to_string(exercise), b.solution, b.lang, "lösningsförslag");
                    ImGui::TreePop();
                }
                ImGui::Unindent(px(12));
            }
            spacing(4);
            break;
        }
    }
    if (!link.empty()) handleLink(link);
}

void App::drawPractice(const Course& c, const Lesson& l) {
    const Palette& p = pal();
    ImGui::Separator();
    spacing(14);
    heading("Testa din förståelse", 2);
    int counts[4] = {0, 0, 0, 0}, right = 0;
    for (int q = 0; q < (int)l.questions.size(); q++) {
        counts[(int)l.questions[q]->type()]++;
        right += progress_.practice(c.id, l.id, q).correct;
    }
    mutedText(std::to_string(l.questions.size()) + " frågor. Flerval rättas direkt, kodfrågorna körs mot testfall i det språk du väljer.");
    spacing(4);
    if (chip(("Alla · " + std::to_string(l.questions.size())).c_str(), practiceFilter_ < 0)) practiceFilter_ = -1;
    for (int t = 0; t < 4; t++) {
        if (!counts[t]) continue;
        ImGui::SameLine();
        std::string label = std::string(typeLabel((QuestionType)t)) + " · " + std::to_string(counts[t]);
        if (chip(label.c_str(), practiceFilter_ == t)) practiceFilter_ = t;
    }
    ImGui::SameLine();
    ImGui::AlignTextToFramePadding();
    ImGui::TextDisabled("   %d/%d rätt", right, (int)l.questions.size());
    spacing(8);

    for (int q = 0; q < (int)l.questions.size(); q++) {
        const Question& question = *l.questions[q];
        if (practiceFilter_ >= 0 && (int)question.type() != practiceFilter_) continue;
        const std::string key = c.id + ":" + l.id + ":" + std::to_string(q);
        auto it = practice_.find(key);
        if (it == practice_.end()) it = practice_.emplace(key, progress_.practice(c.id, l.id, q)).first;
        QuestionContext ctx;
        ctx.mode = QuestionMode::Practice;
        ctx.number = q + 1;
        ctx.total = (int)l.questions.size();
        ctx.uid = key;
        ctx.preferred = progress_.preferredLanguage();
        beginCard(key.c_str(), p.surface, p.line, 16);
        if (questions_.draw(question, it->second, ctx)) {
            progress_.setPractice(c.id, l.id, q, it->second);
            if (question.type() == QuestionType::Code) progress_.setPreferredLanguage(it->second.language);
        }
        endCard();
    }
    spacing(6);
    if (button("Nollställ svaren", ButtonKind::Ghost)) {
        progress_.clearPractice(c.id, l.id);
        for (int q = 0; q < (int)l.questions.size(); q++) practice_.erase(c.id + ":" + l.id + ":" + std::to_string(q));
        questions_.reset();
    }
    ImGui::SameLine();
    if (button("Prov på den här lektionen →")) {
        examConfig_.lessonIds = {l.id};
        examConfig_.count = 10;
        examShown_.reset();
        go({Screen::Exam, route_.course});
    }
}

void App::viewLesson() {
    const Palette& p = pal();
    const Course& c = courses_[route_.course];
    const int li = route_.lesson;
    const Lesson& l = c.lessons[li];

    ImGui::PushFont(fonts().small);
    ImGui::TextDisabled("%s  /  Lektion %s", c.shortName.c_str(), twoDigits(li + 1).c_str());
    ImGui::PopFont();
    spacing(6);
    eyebrow("Lektion " + twoDigits(li + 1) + " · " + l.category);
    heading(l.title);
    spacing(2);
    mutedText(l.lead);
    std::string meta = "≈ " + std::to_string(l.minutes) + " min · " + std::to_string(l.questions.size()) + " frågor";
    if (!l.date.empty()) meta += " · " + l.date;
    meta += " · Källa: ";
    for (size_t i = 0; i < l.sources.size(); i++) meta += (i ? " · " : "") + l.sources[i];
    ImGui::PushFont(fonts().small);
    ImGui::PushStyleColor(ImGuiCol_Text, toVec4(p.muted));
    ImGui::TextWrapped("%s", meta.c_str());
    ImGui::PopStyleColor();
    ImGui::PopFont();
    spacing(12);

    beginCard("goals", p.surface, p.line, 16);
    eyebrow("Efter lektionen kan du");
    for (auto& g : l.goals) {
        ImGui::Indent(px(18));
        ImVec2 pos = ImGui::GetCursorScreenPos();
        ImGui::GetWindowDrawList()->AddText(fonts().body, fonts().body->FontSize, ImVec2(pos.x - px(14), pos.y + px(3)),
                                            p.mask, "\xE2\x80\xA2");
        richText(g, ImGui::GetContentRegionAvail().x - px(20));
        ImGui::Unindent(px(18));
    }
    endCard();

    int section = 0, exercise = 0;
    for (const Block& b : l.blocks) drawBlock(l, b, li, section, exercise);

    spacing(20);
    drawPractice(c, l);

    spacing(20);
    const bool done = progress_.isDone(c.id, l.id);
    beginCard("done", p.maskSoft, p.mask, 16);
    ImGui::TextWrapped("%s", done ? "Lektionen är markerad som klar." : "Har du läst lektionen och svarat på frågorna? Markera den som klar.");
    if (button(done ? "Ångra" : "Markera som klar", done ? ButtonKind::Normal : ButtonKind::Primary)) progress_.setDone(c.id, l.id, !done);
    endCard();

    spacing(10);
    if (li > 0) {
        if (button(("← " + c.lessons[li - 1].title).c_str())) go({Screen::Lesson, route_.course, li - 1});
        ImGui::SameLine();
    }
    if (li + 1 < (int)c.lessons.size()) {
        if (button((c.lessons[li + 1].title + " →").c_str())) go({Screen::Lesson, route_.course, li + 1});
    } else if (button("Gör ett prov på hela kursen →")) {
        examConfig_.lessonIds.clear();
        go({Screen::Exam, route_.course});
    }
}

// ------------------------------------------------------------------ uppgifter och resurser

void App::viewAssignments() {
    const Palette& p = pal();
    const Course& c = courses_[route_.course];
    drawCourseTabs(Screen::Assignments);
    eyebrow("Uppgifter och inlämningar");
    heading("Bocka av kraven medan du bygger.");
    spacing(12);
    for (const Assignment& a : c.assignments) {
        int total = 0, done = 0;
        for (size_t g = 0; g < a.groups.size(); g++)
            for (size_t i = 0; i < a.groups[g].items.size(); i++) {
                total++;
                done += progress_.isChecked(c.id + ":" + a.id + ":" + std::to_string(g) + ":" + std::to_string(i));
            }
        beginCard(a.id.c_str(), p.surface, p.line, 18);
        eyebrow(a.kind + " · " + std::to_string(done) + "/" + std::to_string(total) + " klara");
        heading(a.title, 2);
        progressBar(total ? (float)done / total : 0, ImGui::GetContentRegionAvail().x - px(36));
        spacing(4);
        std::string link = richText(a.intro, ImGui::GetContentRegionAvail().x - px(36));
        if (!link.empty()) handleLink(link);
        for (size_t g = 0; g < a.groups.size(); g++) {
            spacing(6);
            ImGui::PushFont(fonts().bold);
            ImGui::TextUnformatted(a.groups[g].heading.c_str());
            ImGui::PopFont();
            for (size_t i = 0; i < a.groups[g].items.size(); i++) {
                const std::string key = c.id + ":" + a.id + ":" + std::to_string(g) + ":" + std::to_string(i);
                bool on = progress_.isChecked(key);
                ImGui::PushID(key.c_str());
                if (ImGui::Checkbox("##c", &on)) progress_.setChecked(key, on);
                ImGui::PopID();
                ImGui::SameLine();
                richText(a.groups[g].items[i], ImGui::GetContentRegionAvail().x - px(36));
            }
        }
        for (auto& [grade, text] : a.grades) {
            spacing(4);
            ImGui::PushFont(fonts().mono);
            ImGui::PushStyleColor(ImGuiCol_Text, toVec4(p.copper));
            ImGui::TextUnformatted(grade.c_str());
            ImGui::PopStyleColor();
            ImGui::PopFont();
            ImGui::SameLine();
            ImGui::TextWrapped("%s", text.c_str());
        }
        if (!a.hint.empty()) {
            spacing(6);
            richText("<strong>Tips:</strong> " + a.hint, ImGui::GetContentRegionAvail().x - px(36));
        }
        endCard();
    }
}

void App::viewResources() {
    const Palette& p = pal();
    const Course& c = courses_[route_.course];
    drawCourseTabs(Screen::Resources);
    eyebrow("Resursbibliotek");
    heading("Källorna bakom varje lektion.");
    spacing(12);
    heading("Kursdokument", 3);
    for (const SourceDoc& s : c.sources) {
        ImGui::PushFont(fonts().mono);
        ImGui::PushStyleColor(ImGuiCol_Text, toVec4(p.copper));
        ImGui::Text("%-6s", s.kind.c_str());
        ImGui::PopStyleColor();
        ImGui::PopFont();
        ImGui::SameLine();
        ImGui::BeginGroup();
        ImGui::PushFont(fonts().bold);
        ImGui::TextUnformatted(s.title.c_str());
        ImGui::PopFont();
        ImGui::PushStyleColor(ImGuiCol_Text, toVec4(p.muted));
        ImGui::TextWrapped("%s", s.description.c_str());
        ImGui::PopStyleColor();
        for (auto& id : s.lessonIds) {
            int li = c.lessonIndex(id);
            if (li < 0) continue;
            if (chip((twoDigits(li + 1) + " " + c.lessons[li].title).c_str())) go({Screen::Lesson, route_.course, li});
            ImGui::SameLine();
        }
        ImGui::NewLine();
        ImGui::EndGroup();
        spacing(8);
    }
    spacing(8);
    heading("Läs vidare", 3);
    for (const Link& l : c.links) {
        std::string href = richText("<a href=\"" + l.url + "\">" + l.title + " ↗</a>");
        if (!href.empty()) openUrl(href);
        ImGui::PushStyleColor(ImGuiCol_Text, toVec4(p.muted));
        ImGui::TextWrapped("%s", l.description.c_str());
        ImGui::PopStyleColor();
        spacing(6);
    }
}

// ------------------------------------------------------------------ om appen

void App::viewAbout() {
    const Palette& p = pal();
    eyebrow("Om appen");
    heading("Nollterm, skriven i C++.");
    spacing(4);
    mutedText("Byggd med Dear ImGui och GLFW. Koden finns på GitHub: <a href=\"https://github.com/NathanDavicent/Nollterm\">github.com/NathanDavicent/Nollterm</a>. Läs app/README.md för en guide genom källkoden.");
    spacing(12);

    if (!toolInfoJob_.valid() && toolInfo_.empty()) {
        Toolchain tc = tc_;
        toolInfoJob_ = std::async(std::launch::async, [tc] {
            return std::vector<std::string>{toolVersion(tc.gcc, tc), toolVersion(tc.gxx, tc), toolVersion(tc.python, tc)};
        });
    }
    if (toolInfoJob_.valid() && toolInfoJob_.wait_for(std::chrono::milliseconds(0)) == std::future_status::ready)
        toolInfo_ = toolInfoJob_.get();

    beginCard("tools", p.surface, p.line, 16);
    heading("Språk och verktyg", 3);
    const char* names[] = {"C (gcc)", "C++ (g++)", "Python"};
    const std::string* paths[] = {&tc_.gcc, &tc_.gxx, &tc_.python};
    for (int i = 0; i < 3; i++) {
        ImGui::PushFont(fonts().bold);
        ImGui::TextUnformatted(names[i]);
        ImGui::PopFont();
        ImGui::SameLine(px(130));
        ImGui::PushFont(fonts().mono);
        ImGui::TextWrapped("%s", toolInfo_.empty() ? "kontrollerar…" : toolInfo_[i].c_str());
        ImGui::PopFont();
        ImGui::SameLine(0, 0);
        ImGui::NewLine();
        ImGui::PushFont(fonts().small);
        ImGui::TextDisabled("%s", paths[i]->c_str());
        ImGui::PopFont();
    }
    spacing(4);
    ImGui::TextWrapped("%s", tc_.bundled ? "Kompilatorerna följer med appen (w64devkit och Python embeddable)."
                                         : "Appen använder kompilatorerna i PATH.");
    endCard();

    beginCard("data", p.surface, p.line, 16);
    heading("Dina data", 3);
    ImGui::TextWrapped("Framsteg, svar och provresultat sparas i:");
    ImGui::PushFont(fonts().mono);
    ImGui::TextWrapped("%s", progress_.path().string().c_str());
    ImGui::PopFont();
    endCard();
}

}  // namespace nt::ui
