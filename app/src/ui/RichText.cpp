#include "RichText.h"

#include <cctype>
#include <vector>

#include "Theme.h"

namespace nt::ui {

std::string decodeEntities(const std::string& s) {
    static const std::pair<const char*, const char*> table[] = {
        {"&lt;", "<"}, {"&gt;", ">"}, {"&amp;", "&"}, {"&quot;", "\""}, {"&#39;", "'"}, {"&nbsp;", "\xC2\xA0"}};
    std::string out;
    for (size_t i = 0; i < s.size();) {
        bool matched = false;
        if (s[i] == '&')
            for (auto& [ent, ch] : table) {
                size_t n = std::char_traits<char>::length(ent);
                if (s.compare(i, n, ent) == 0) { out += ch; i += n; matched = true; break; }
            }
        if (!matched) out += s[i++];
    }
    return out;
}

std::string stripTags(const std::string& html) {
    std::string out;
    bool inTag = false;
    for (char c : html) {
        if (c == '<') inTag = true;
        else if (c == '>') inTag = false;
        else if (!inTag) out += c;
    }
    return decodeEntities(out);
}

namespace {

// Aktuell stil medan vi går igenom texten.
struct Style {
    int bold = 0, italic = 0, code = 0, kbd = 0, sup = 0;
    std::string href;
};

struct ListLevel {
    bool ordered = false;
    int counter = 0;
};

// Placerar ord på rader. Om draw är false mäts bara höjden.
class Layout {
public:
    Layout(ImVec2 origin, float width, const RichStyle& rs, bool draw)
        : origin_(origin), width_(width), rs_(rs), draw_(draw), dl_(ImGui::GetWindowDrawList()) {
        base_ = rs.font ? rs.font : fonts().body;
        color_ = rs.color ? rs.color : pal().ink;
        lineH_ = base_->FontSize * rs.lineSpacing;
        pen_ = origin;
        lineStart_ = origin.x;
    }

    void text(const std::string& t, const Style& st) {
        // Dela upp i ord. Mellanslag sparas som "väntande" och ritas bara mellan ord på samma rad.
        size_t i = 0;
        while (i < t.size()) {
            if (std::isspace((unsigned char)t[i])) {
                pendingSpace_ = !atLineStart();
                while (i < t.size() && std::isspace((unsigned char)t[i])) i++;
                continue;
            }
            size_t j = i;
            while (j < t.size() && !std::isspace((unsigned char)t[j])) j++;
            word(t.substr(i, j - i), st);
            i = j;
        }
    }

    void newline() {
        pen_.y += lineH_;
        pen_.x = lineStart_;
        pendingSpace_ = false;
        lineHasContent_ = false;
    }
    void endLineIfNeeded() { if (lineHasContent_) newline(); }
    void paragraphGap() {
        endLineIfNeeded();
        if (pen_.y > origin_.y) pen_.y += lineH_ * 0.45f;
    }

    void beginListItem(int depth, const std::string& marker) {
        endLineIfNeeded();
        const float indent = px(22) * depth;
        lineStart_ = origin_.x + indent;
        pen_.x = lineStart_;
        if (draw_) {
            ImFont* f = base_;
            float w = f->CalcTextSizeA(f->FontSize, FLT_MAX, 0, marker.c_str()).x;
            dl_->AddText(f, f->FontSize, ImVec2(lineStart_ - w - px(7), pen_.y + yOffset(f)), pal().muted, marker.c_str());
        }
    }
    void endList(int depth) {
        endLineIfNeeded();
        lineStart_ = origin_.x + px(22) * depth;
        pen_.x = lineStart_;
    }

    // Förformaterat kodblock (<pre>) inne i texten.
    void preBlock(const std::string& code) {
        endLineIfNeeded();
        ImFont* f = fonts().mono;
        const float lh = f->FontSize * 1.45f, pad = px(10);
        int lines = 1;
        for (char c : code) lines += c == '\n';
        const float h = lines * lh + pad * 2;
        if (draw_) {
            ImVec2 a(lineStart_, pen_.y + px(4)), b(origin_.x + width_, pen_.y + px(4) + h);
            dl_->AddRectFilled(a, b, pal().codeBg, px(8));
            float y = a.y + pad;
            size_t start = 0;
            ImGui::PushClipRect(a, b, true);
            while (start <= code.size()) {
                size_t end = code.find('\n', start);
                if (end == std::string::npos) end = code.size();
                std::string line = code.substr(start, end - start);
                dl_->AddText(f, f->FontSize, ImVec2(a.x + pad, y), pal().codeFg, line.c_str());
                y += lh;
                start = end + 1;
            }
            ImGui::PopClipRect();
        }
        pen_.y += h + px(12);
        pen_.x = lineStart_;
        lineHasContent_ = false;
    }

    float height() const { return (pen_.y - origin_.y) + (lineHasContent_ ? lineH_ : 0.0f); }
    const std::string& clicked() const { return clicked_; }

private:
    bool atLineStart() const { return !lineHasContent_; }
    float yOffset(ImFont* f) const { return (lineH_ - f->FontSize) * 0.5f; }

    ImFont* fontFor(const Style& st) const {
        if (st.code || st.kbd) return fonts().mono;
        if (st.sup) return fonts().small;
        if (st.bold) return fonts().bold;
        if (st.italic && !rs_.accentEm) return fonts().italic;
        return base_;
    }

    void word(std::string w, const Style& st) {
        ImFont* f = fontFor(st);
        // Rubriker ritas med ett större typsnitt; behåll storleken för fetstil/kursiv i dem.
        if (base_ != fonts().body && !st.code && !st.kbd) f = base_;
        const float size = f->FontSize;
        const float pad = (st.code || st.kbd) ? px(4) : 0.0f;
        const float space = pendingSpace_ ? base_->CalcTextSizeA(base_->FontSize, FLT_MAX, 0, " ").x : 0.0f;
        float w_px = f->CalcTextSizeA(size, FLT_MAX, 0, w.c_str()).x + pad * 2;
        const float right = origin_.x + width_;

        if (pen_.x + space + w_px > right && !atLineStart()) {
            newline();
        } else {
            pen_.x += space;
        }
        // Ett ord som är bredare än hela raden (lång kod/länk) delas upp.
        while (w_px > right - lineStart_ && w.size() > 1) {
            size_t cut = w.size() - 1;
            while (cut > 1 && f->CalcTextSizeA(size, FLT_MAX, 0, w.substr(0, cut).c_str()).x + pad * 2 > right - pen_.x) cut--;
            while (cut > 1 && (w[cut] & 0xC0) == 0x80) cut--;  // dela inte mitt i ett UTF-8-tecken
            emit(w.substr(0, cut), st, f, pad);
            newline();
            w = w.substr(cut);
            w_px = f->CalcTextSizeA(size, FLT_MAX, 0, w.c_str()).x + pad * 2;
        }
        emit(w, st, f, pad);
        pendingSpace_ = false;
    }

    void emit(const std::string& w, const Style& st, ImFont* f, float pad) {
        const float size = f->FontSize;
        const float textW = f->CalcTextSizeA(size, FLT_MAX, 0, w.c_str()).x;
        const ImVec2 pos(pen_.x, pen_.y + yOffset(f) - (st.sup ? px(5) : 0));
        if (draw_) {
            ImU32 col = color_;
            if (st.code) col = pal().ink;
            if (st.italic && rs_.accentEm) col = pal().mask;
            if (!st.href.empty()) col = pal().mask;
            if (st.code) {
                // Ord i samma <code> ritas som EN bakgrund: börja där förra kodordet slutade.
                const bool continues = codeRunRight_ >= 0 && codeRunY_ == pen_.y;
                const float x0 = continues ? codeRunRight_ - px(4) : pos.x;
                dl_->AddRectFilled(ImVec2(x0, pos.y - px(1)), ImVec2(pos.x + textW + pad * 2, pos.y + size + px(2)),
                                   pal().maskSoft, px(4));
            }
            if (st.kbd) {
                dl_->AddRect(ImVec2(pos.x, pos.y - px(1)), ImVec2(pos.x + textW + pad * 2, pos.y + size + px(3)),
                             pal().line, px(4), 0, px(1.5f));
            }
            dl_->AddText(f, size, ImVec2(pos.x + pad, pos.y), col, w.c_str());
            if (!st.href.empty()) {
                ImVec2 a(pos.x, pen_.y), b(pos.x + textW, pen_.y + lineH_);
                dl_->AddLine(ImVec2(a.x, pos.y + size + px(1)), ImVec2(b.x, pos.y + size + px(1)), col, px(1));
                if (ImGui::IsWindowHovered() && ImGui::IsMouseHoveringRect(a, b)) {
                    ImGui::SetMouseCursor(ImGuiMouseCursor_Hand);
                    if (ImGui::IsMouseClicked(ImGuiMouseButton_Left)) clicked_ = st.href;
                }
            }
        }
        pen_.x += textW + pad * 2;
        lineHasContent_ = true;
        codeRunRight_ = st.code ? pen_.x : -1.0f;
        codeRunY_ = pen_.y;
    }

    ImVec2 origin_, pen_;
    float width_, lineH_, lineStart_;
    const RichStyle& rs_;
    bool draw_;
    ImDrawList* dl_;
    ImFont* base_;
    ImU32 color_;
    bool pendingSpace_ = false, lineHasContent_ = false;
    float codeRunRight_ = -1.0f, codeRunY_ = 0.0f;
    std::string clicked_;
};

std::string attr(const std::string& tag, const std::string& name) {
    size_t p = tag.find(name + "=\"");
    if (p == std::string::npos) return "";
    p += name.size() + 2;
    return tag.substr(p, tag.find('"', p) - p);
}

// Går igenom HTML:en och skickar text och taggar till layouten.
float layoutHtml(const std::string& html, float width, const RichStyle& rs, bool draw, std::string* clicked) {
    if (width < 0) width = ImGui::GetContentRegionAvail().x;
    ImVec2 origin = ImGui::GetCursorScreenPos();
    Layout lay(origin, width, rs, draw);
    Style st;
    std::vector<ListLevel> lists;

    size_t i = 0;
    while (i < html.size()) {
        if (html[i] != '<') {
            size_t j = html.find('<', i);
            if (j == std::string::npos) j = html.size();
            lay.text(decodeEntities(html.substr(i, j - i)), st);
            i = j;
            continue;
        }
        size_t end = html.find('>', i);
        if (end == std::string::npos) { lay.text(html.substr(i), st); break; }
        std::string tag = html.substr(i + 1, end - i - 1);
        i = end + 1;
        const bool closing = !tag.empty() && tag[0] == '/';
        std::string name;
        for (size_t k = closing ? 1 : 0; k < tag.size() && std::isalnum((unsigned char)tag[k]); k++)
            name += (char)std::tolower((unsigned char)tag[k]);
        const int d = closing ? -1 : 1;

        if (name == "strong" || name == "b") st.bold += d;
        else if (name == "em" || name == "i") st.italic += d;
        else if (name == "code") st.code += d;
        else if (name == "kbd") st.kbd += d;
        else if (name == "sup") st.sup += d;
        else if (name == "a") st.href = closing ? "" : attr(tag, "href");
        else if (name == "br") lay.newline();
        else if (name == "p") lay.paragraphGap();
        else if (name == "ul" || name == "ol") {
            if (!closing) { lay.endLineIfNeeded(); lists.push_back({name == "ol", 0}); }
            else if (!lists.empty()) { lists.pop_back(); lay.endList((int)lists.size()); lay.paragraphGap(); }
        } else if (name == "li" && !closing) {
            if (lists.empty()) lists.push_back({false, 0});
            ListLevel& lv = lists.back();
            lv.counter++;
            lay.beginListItem((int)lists.size(), lv.ordered ? std::to_string(lv.counter) + "." : "\xE2\x80\xA2");
        } else if (name == "pre" && !closing) {
            size_t close = html.find("</pre>", i);
            if (close == std::string::npos) close = html.size();
            lay.preBlock(decodeEntities(stripTags(html.substr(i, close - i))));
            i = std::min(html.size(), close + 6);
        }
    }
    if (clicked) *clicked = lay.clicked();
    return lay.height();
}

}  // namespace

std::string richText(const std::string& html, float width, const RichStyle& style) {
    if (width < 0) width = ImGui::GetContentRegionAvail().x;
    std::string clicked;
    float h = layoutHtml(html, width, style, true, &clicked);
    ImGui::Dummy(ImVec2(width, h));  // reservera platsen så att nästa element hamnar under
    return clicked;
}

float richTextHeight(const std::string& html, float width, const RichStyle& style) {
    return layoutHtml(html, width, style, false, nullptr);
}

}  // namespace nt::ui
