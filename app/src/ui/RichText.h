#pragma once
// Ritar lektionstext som innehåller enkel HTML med automatisk radbrytning.
//
// Stöds: <strong>/<b>, <em>/<i>, <code>, <kbd>, <a href>, <br>, <p>, <ul>/<ol>/<li>, <pre>, <sup>
// och entiteter som &lt; &gt; &amp;.
//
// ImGui har ingen egen layoutmotor för formaterad text, så vi placerar varje ord själva:
// mät ordets bredd, bryt raden om det inte får plats, rita det med ImDrawList.

#include <string>

#include <imgui.h>

namespace nt::ui {

struct RichStyle {
    ImFont* font = nullptr;      // grundtypsnitt (standard: fonts().body)
    ImU32 color = 0;             // textfärg (standard: pal().ink)
    bool accentEm = false;       // <em> ritas i accentfärg istället för kursivt (rubriker)
    float lineSpacing = 1.5f;    // radhöjd i förhållande till typsnittets storlek
};

// Ritar texten vid nuvarande position. width < 0 betyder all tillgänglig bredd.
// Returnerar adressen (href) om användaren klickade på en länk, annars tom sträng.
std::string richText(const std::string& html, float width = -1.0f, const RichStyle& style = {});

// Mäter hur hög texten blir utan att rita den.
float richTextHeight(const std::string& html, float width, const RichStyle& style = {});

std::string decodeEntities(const std::string& s);
std::string stripTags(const std::string& html);  // "Ett <b>fett</b> ord" -> "Ett fett ord"

}  // namespace nt::ui
