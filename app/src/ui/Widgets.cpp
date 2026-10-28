#include "Widgets.h"

#include <ctime>
#include <vector>

#include "RichText.h"
#include "Theme.h"

namespace nt::ui {

bool button(const char* label, ButtonKind kind, ImVec2 size, bool enabled) {
    const Palette& p = pal();
    int colors = 0;
    if (kind == ButtonKind::Primary) {
        ImGui::PushStyleColor(ImGuiCol_Button, toVec4(p.mask));
        ImGui::PushStyleColor(ImGuiCol_ButtonHovered, toVec4(withAlpha(p.mask, 0.88f)));
        ImGui::PushStyleColor(ImGuiCol_ButtonActive, toVec4(withAlpha(p.mask, 0.75f)));
        ImGui::PushStyleColor(ImGuiCol_Text, toVec4(p.maskInk));
        ImGui::PushStyleColor(ImGuiCol_Border, toVec4(p.mask));
        colors = 5;
    } else if (kind == ButtonKind::Ghost) {
        ImGui::PushStyleColor(ImGuiCol_Button, toVec4(withAlpha(p.paper, 0)));
        ImGui::PushStyleColor(ImGuiCol_Border, toVec4(withAlpha(p.paper, 0)));
        colors = 2;
    }
    ImGui::PushFont(fonts().bold);
    ImGui::PushStyleVar(ImGuiStyleVar_FramePadding, ImVec2(px(14), px(8)));
    ImGui::BeginDisabled(!enabled);
    bool clicked = ImGui::Button(label, size);
    ImGui::EndDisabled();
    if (enabled && ImGui::IsItemHovered()) ImGui::SetMouseCursor(ImGuiMouseCursor_Hand);
    ImGui::PopStyleVar();
    ImGui::PopFont();
    ImGui::PopStyleColor(colors);
    return clicked;
}

bool chip(const char* label, bool selected) {
    const Palette& p = pal();
    ImGui::PushStyleVar(ImGuiStyleVar_FrameRounding, px(99));
    ImGui::PushStyleVar(ImGuiStyleVar_FramePadding, ImVec2(px(12), px(5)));
    ImGui::PushStyleColor(ImGuiCol_Button, toVec4(selected ? p.ink : p.surface));
    ImGui::PushStyleColor(ImGuiCol_ButtonHovered, toVec4(selected ? p.ink : p.maskSoft));
    ImGui::PushStyleColor(ImGuiCol_Text, toVec4(selected ? p.paper : p.ink));
    ImGui::PushFont(fonts().small);
    bool clicked = ImGui::Button(label);
    if (ImGui::IsItemHovered()) ImGui::SetMouseCursor(ImGuiMouseCursor_Hand);
    ImGui::PopFont();
    ImGui::PopStyleColor(3);
    ImGui::PopStyleVar(2);
    return clicked;
}

void eyebrow(const std::string& text) {
    ImGui::PushFont(fonts().small);
    ImGui::PushStyleColor(ImGuiCol_Text, toVec4(pal().muted));
    std::string upper;
    for (size_t i = 0; i < text.size(); i++) {
        unsigned char c = (unsigned char)text[i];
        // Gör om a–z till versaler, och å/ä/ö (UTF-8: C3 A5/A4/B6) till Å/Ä/Ö.
        if (c == 0xC3 && i + 1 < text.size() && ((unsigned char)text[i + 1] == 0xA5 || (unsigned char)text[i + 1] == 0xA4 || (unsigned char)text[i + 1] == 0xB6)) {
            upper += (char)0xC3;
            upper += (char)((unsigned char)text[i + 1] - 0x20);
            i++;
        } else {
            upper += (char)(c < 128 ? std::toupper(c) : c);
        }
    }
    ImGui::TextUnformatted(upper.c_str());
    ImGui::PopStyleColor();
    ImGui::PopFont();
}

void mutedText(const std::string& text) {
    RichStyle rs;
    rs.color = pal().muted;
    richText(text, -1, rs);
}

void heading(const std::string& html, int level) {
    RichStyle rs;
    rs.font = level == 1 ? fonts().h1 : level == 2 ? fonts().h2 : fonts().h3;
    rs.accentEm = true;
    rs.lineSpacing = 1.25f;
    richText(html, -1, rs);
}

void progressBar(float fraction, float width, float height, unsigned color) {
    const Palette& p = pal();
    ImVec2 a = ImGui::GetCursorScreenPos();
    ImVec2 b(a.x + width, a.y + px(height));
    ImDrawList* dl = ImGui::GetWindowDrawList();
    dl->AddRectFilled(a, b, isDark() ? p.line : p.paper, px(height));
    if (fraction > 0)
        dl->AddRectFilled(a, ImVec2(a.x + width * (fraction > 1 ? 1 : fraction), b.y), color ? color : p.mask, px(height));
    ImGui::Dummy(ImVec2(width, px(height)));
}

void tag(const char* text, unsigned bg, unsigned fg) {
    ImFont* f = fonts().small;
    ImVec2 size = f->CalcTextSizeA(f->FontSize, FLT_MAX, 0, text);
    ImVec2 a = ImGui::GetCursorScreenPos();
    ImVec2 pad(px(7), px(2));
    ImGui::GetWindowDrawList()->AddRectFilled(a, ImVec2(a.x + size.x + pad.x * 2, a.y + size.y + pad.y * 2), bg, px(4));
    ImGui::GetWindowDrawList()->AddText(f, f->FontSize, ImVec2(a.x + pad.x, a.y + pad.y), fg, text);
    ImGui::Dummy(ImVec2(size.x + pad.x * 2, size.y + pad.y * 2));
}

void spacing(float pixels) { ImGui::Dummy(ImVec2(1, px(pixels))); }

// Kort: ett barnfönster som växer på höjden efter innehållet (AutoResizeY).
// Fönstret ger oss marginaler på alla sidor, egen bakgrund och ram, och kort kan läggas i varandra.
void beginCard(const char* id, unsigned bg, unsigned border, float padding) {
    ImGui::PushStyleColor(ImGuiCol_ChildBg, toVec4(bg ? bg : pal().surface));
    ImGui::PushStyleColor(ImGuiCol_Border, toVec4(border ? border : pal().line));
    ImGui::PushStyleVar(ImGuiStyleVar_WindowPadding, ImVec2(px(padding), px(padding)));
    ImGui::PushStyleVar(ImGuiStyleVar_ChildRounding, px(10));
    ImGui::BeginChild(id, ImVec2(ImGui::GetContentRegionAvail().x, 0),
                      ImGuiChildFlags_AutoResizeY | ImGuiChildFlags_Borders | ImGuiChildFlags_AlwaysUseWindowPadding,
                      ImGuiWindowFlags_NoScrollbar | ImGuiWindowFlags_NoScrollWithMouse);
    ImGui::PopStyleVar(2);
    ImGui::PopStyleColor(2);
}

void endCard() {
    ImGui::EndChild();
    ImGui::Dummy(ImVec2(1, px(4)));
}

bool clickableArea(const char* id, float height, Clickable& out, float width) {
    if (width < 0) width = ImGui::GetContentRegionAvail().x;
    out.min = ImGui::GetCursorScreenPos();
    bool clicked = ImGui::InvisibleButton(id, ImVec2(width, height));
    out.max = ImGui::GetItemRectMax();
    out.hovered = ImGui::IsItemHovered();
    if (out.hovered) ImGui::SetMouseCursor(ImGuiMouseCursor_Hand);
    return clicked;
}

std::string formatSeconds(int s) {
    if (s < 0) s = 0;
    char buf[32];
    snprintf(buf, sizeof buf, "%d:%02d", s / 60, s % 60);
    return buf;
}

std::string formatDate(long long t) {
    std::time_t tt = (std::time_t)t;
    std::tm tm{};
#ifdef _WIN32
    localtime_s(&tm, &tt);
#else
    localtime_r(&tt, &tm);
#endif
    char buf[32];
    std::strftime(buf, sizeof buf, "%Y-%m-%d %H:%M", &tm);
    return buf;
}

}  // namespace nt::ui
