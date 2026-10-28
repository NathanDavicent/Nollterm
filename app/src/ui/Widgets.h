#pragma once
// Små återanvändbara byggstenar för gränssnittet: knappar, kort, etiketter, staplar.

#include <string>

#include <imgui.h>

namespace nt::ui {

enum class ButtonKind { Normal, Primary, Ghost };

bool button(const char* label, ButtonKind kind = ButtonKind::Normal, ImVec2 size = ImVec2(0, 0), bool enabled = true);
bool chip(const char* label, bool selected = false);           // rund liten knapp (filter, flikar)
void eyebrow(const std::string& text);                          // liten versal etikett ovanför rubriker
void mutedText(const std::string& text);                        // grå, radbruten text
void heading(const std::string& html, int level = 1);           // h1/h2/h3, <em> i accentfärg
void progressBar(float fraction, float width, float height = 6.0f, unsigned color = 0);
void tag(const char* text, unsigned bg, unsigned fg);           // liten färgad etikett ("Tips", "OK")
void spacing(float pixels);

// Ett kort: ram + bakgrund runt innehållet. Höjden anpassas efter innehållet.
void beginCard(const char* id, unsigned bg = 0, unsigned border = 0, float padding = 16.0f);
void endCard();

// Klickbar yta med valfritt innehåll ritat ovanpå (används för lektionsrader och svarsalternativ).
// Anropa först clickableBegin, rita innehållet, sedan clickableEnd som returnerar true vid klick.
struct Clickable {
    ImVec2 min, max;
    bool hovered = false;
};
bool clickableArea(const char* id, float height, Clickable& out, float width = -1.0f);

std::string formatSeconds(int s);  // 125 -> "2:05"
std::string formatDate(long long unixTime);

}  // namespace nt::ui
