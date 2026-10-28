#include "Theme.h"

namespace nt::ui {

// Hex-färg (som i CSS) till ImGuis format. IM_COL32 tar r, g, b, a.
static constexpr ImU32 hex(unsigned rgb) {
    return IM_COL32((rgb >> 16) & 0xFF, (rgb >> 8) & 0xFF, rgb & 0xFF, 0xFF);
}

static const Palette kLight = {
    hex(0xf3f5f1), hex(0xffffff), hex(0x15201c), hex(0x59665f), hex(0xd6ddd6),
    hex(0x0c6a4e), hex(0xffffff), hex(0xe0eee7),
    hex(0xa85a22), hex(0xf5e6d8),
    hex(0x1c7a4a), hex(0xdff1e6), hex(0xb3261e), hex(0xfae3e0),
    hex(0x0f1c17), hex(0xd9e6df), hex(0x23362e),
    hex(0xf0a56b), hex(0x8fd8a8), hex(0x7e958b), hex(0xe6c87a), hex(0x7fc4e6), hex(0xf2e6c9),
};

static const Palette kDark = {
    hex(0x0d1412), hex(0x131d19), hex(0xe3eae5), hex(0x95a49c), hex(0x26352f),
    hex(0x4cc69c), hex(0x08130f), hex(0x16302a),
    hex(0xe59d63), hex(0x36261b),
    hex(0x63d494), hex(0x173326), hex(0xf2877e), hex(0x3a1c1a),
    hex(0x08100d), hex(0xd9e6df), hex(0x1c2b25),
    hex(0xf0a56b), hex(0x8fd8a8), hex(0x7e958b), hex(0xe6c87a), hex(0x7fc4e6), hex(0xf2e6c9),
};

static const Palette* gPal = &kLight;
static Fonts gFonts;
static float gScale = 1.0f;

const Palette& pal() { return *gPal; }
Fonts& fonts() { return gFonts; }
float scale() { return gScale; }
float px(float v) { return v * gScale; }
bool isDark() { return gPal == &kDark; }

ImVec4 toVec4(ImU32 c) { return ImGui::ColorConvertU32ToFloat4(c); }

ImU32 withAlpha(ImU32 c, float alpha) {
    ImVec4 v = toVec4(c);
    v.w = alpha;
    return ImGui::ColorConvertFloat4ToU32(v);
}

void setDark(bool dark) {
    gPal = dark ? &kDark : &kLight;
    const Palette& p = *gPal;
    ImGuiStyle& s = ImGui::GetStyle();
    s.WindowRounding = px(0);
    s.ChildRounding = px(10);
    s.FrameRounding = px(7);
    s.PopupRounding = px(8);
    s.GrabRounding = px(6);
    s.ScrollbarRounding = px(8);
    s.TabRounding = px(6);
    s.FramePadding = ImVec2(px(10), px(7));
    s.ItemSpacing = ImVec2(px(8), px(8));
    s.WindowPadding = ImVec2(px(0), px(0));
    s.ScrollbarSize = px(12);
    s.FrameBorderSize = 1.0f;
    s.ChildBorderSize = 1.0f;
    s.WindowBorderSize = 0.0f;
    s.CellPadding = ImVec2(px(10), px(7));

    ImVec4* c = s.Colors;
    c[ImGuiCol_Text] = toVec4(p.ink);
    c[ImGuiCol_TextDisabled] = toVec4(p.muted);
    c[ImGuiCol_WindowBg] = toVec4(p.paper);
    c[ImGuiCol_ChildBg] = toVec4(withAlpha(p.paper, 0));
    c[ImGuiCol_PopupBg] = toVec4(p.surface);
    c[ImGuiCol_Border] = toVec4(p.line);
    c[ImGuiCol_FrameBg] = toVec4(p.surface);
    c[ImGuiCol_FrameBgHovered] = toVec4(p.maskSoft);
    c[ImGuiCol_FrameBgActive] = toVec4(p.maskSoft);
    c[ImGuiCol_Button] = toVec4(p.surface);
    c[ImGuiCol_ButtonHovered] = toVec4(p.maskSoft);
    c[ImGuiCol_ButtonActive] = toVec4(withAlpha(p.mask, 0.35f));
    c[ImGuiCol_Header] = toVec4(p.maskSoft);
    c[ImGuiCol_HeaderHovered] = toVec4(p.maskSoft);
    c[ImGuiCol_HeaderActive] = toVec4(withAlpha(p.mask, 0.3f));
    c[ImGuiCol_CheckMark] = toVec4(p.mask);
    c[ImGuiCol_SliderGrab] = toVec4(p.mask);
    c[ImGuiCol_SliderGrabActive] = toVec4(p.mask);
    c[ImGuiCol_ScrollbarBg] = toVec4(withAlpha(p.paper, 0));
    c[ImGuiCol_ScrollbarGrab] = toVec4(p.line);
    c[ImGuiCol_ScrollbarGrabHovered] = toVec4(p.muted);
    c[ImGuiCol_ScrollbarGrabActive] = toVec4(p.muted);
    c[ImGuiCol_Separator] = toVec4(p.line);
    c[ImGuiCol_TableHeaderBg] = toVec4(p.paper);
    c[ImGuiCol_TableBorderStrong] = toVec4(p.line);
    c[ImGuiCol_TableBorderLight] = toVec4(p.line);
    c[ImGuiCol_TableRowBg] = toVec4(p.surface);
    c[ImGuiCol_TableRowBgAlt] = toVec4(p.surface);
    c[ImGuiCol_TextSelectedBg] = toVec4(withAlpha(p.mask, 0.3f));
    c[ImGuiCol_NavHighlight] = toVec4(p.copper);
    c[ImGuiCol_ModalWindowDimBg] = toVec4(withAlpha(p.ink, 0.35f));
}

bool loadFonts(const std::filesystem::path& dir, float scale) {
    gScale = scale;
    ImGuiIO& io = ImGui::GetIO();
    io.Fonts->Clear();

    // Teckenintervall: latin (å, ä, ö), grekiska (π), skiljetecken, pilar, matematik, ramtecken (UML), former och bockar.
    static const ImWchar ranges[] = {
        0x0020, 0x00FF, 0x0100, 0x017F, 0x0370, 0x03FF, 0x2000, 0x206F, 0x2190, 0x21FF, 0x2200, 0x22FF,
        0x2300, 0x23FF, 0x2500, 0x257F, 0x25A0, 0x25FF, 0x2600, 0x26FF, 0x2700, 0x27BF, 0};

    auto load = [&](const char* file, float size) -> ImFont* {
        std::filesystem::path p = dir / "fonts" / file;
        if (!std::filesystem::exists(p)) return nullptr;
        ImFontConfig cfg;
        cfg.OversampleH = 2;
        cfg.PixelSnapH = false;
        return io.Fonts->AddFontFromFileTTF(p.string().c_str(), size * scale, &cfg, ranges);
    };
    gFonts.body = load("DejaVuSans.ttf", 16.5f);   // första typsnittet blir standard
    gFonts.bold = load("DejaVuSans-Bold.ttf", 16.5f);
    gFonts.italic = load("DejaVuSans-Oblique.ttf", 16.5f);
    gFonts.mono = load("DejaVuSansMono.ttf", 14.5f);
    gFonts.small = load("DejaVuSans.ttf", 13.5f);
    gFonts.h1 = load("DejaVuSans-Bold.ttf", 31.0f);
    gFonts.h2 = load("DejaVuSans-Bold.ttf", 22.0f);
    gFonts.h3 = load("DejaVuSans-Bold.ttf", 18.0f);
    if (!gFonts.body) {
        ImFont* f = io.Fonts->AddFontDefault();  // nödlösning om assets saknas
        gFonts = {f, f, f, f, f, f, f, f};
        return false;
    }
    return true;
}

}  // namespace nt::ui
