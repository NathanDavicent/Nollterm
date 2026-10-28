#pragma once
// Färger och typsnitt. Samma palett som webbversionen: kretskortsgrönt och koppar.

#include <filesystem>

#include <imgui.h>

namespace nt::ui {

struct Palette {
    ImU32 paper, surface, ink, muted, line;
    ImU32 mask, maskInk, maskSoft;      // grön accent (lödmask)
    ImU32 copper, copperSoft;           // kopparfärg för etiketter
    ImU32 ok, okSoft, bad, badSoft;
    ImU32 codeBg, codeFg, codeLine;
    ImU32 hlKeyword, hlString, hlComment, hlNumber, hlPreproc, hlFunction;
};

struct Fonts {
    ImFont* body = nullptr;
    ImFont* bold = nullptr;
    ImFont* italic = nullptr;
    ImFont* mono = nullptr;
    ImFont* small = nullptr;
    ImFont* h1 = nullptr;
    ImFont* h2 = nullptr;
    ImFont* h3 = nullptr;
};

const Palette& pal();
Fonts& fonts();
float scale();                      // skärmens skalning (1.0 på vanliga skärmar, 1.5 på 150 %)
float px(float v);                  // v * scale()

void setDark(bool dark);            // byter palett och ImGui-stil
bool isDark();

// Laddar typsnitten från assets/fonts. Returnerar false om filerna saknas.
bool loadFonts(const std::filesystem::path& assetsDir, float scale);

ImVec4 toVec4(ImU32 c);
ImU32 withAlpha(ImU32 c, float alpha);

}  // namespace nt::ui
