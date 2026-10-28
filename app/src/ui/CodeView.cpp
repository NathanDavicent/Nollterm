#include "CodeView.h"

#include <cctype>
#include <set>
#include <vector>

#include <imgui.h>

#include "Theme.h"
#include "Widgets.h"

namespace nt::ui {

namespace {

struct Token {
    std::string text;
    ImU32 color;
};

const std::set<std::string>& keywords(const std::string& lang) {
    static const std::set<std::string> cpp = {
        "auto", "bool", "break", "case", "catch", "char", "class", "const", "constexpr", "continue", "default", "delete",
        "do", "double", "else", "enum", "explicit", "false", "final", "float", "for", "friend", "if", "inline", "int",
        "long", "namespace", "new", "noexcept", "nullptr", "operator", "override", "private", "protected", "public",
        "return", "short", "signed", "sizeof", "static", "static_cast", "dynamic_cast", "struct", "switch", "template",
        "this", "throw", "true", "try", "typedef", "typename", "unsigned", "using", "virtual", "void", "while", "size_t",
        "std", "string", "vector", "map", "unique_ptr", "shared_ptr", "NULL"};
    static const std::set<std::string> py = {
        "and", "as", "assert", "break", "class", "continue", "def", "del", "elif", "else", "except", "False", "finally",
        "for", "from", "global", "if", "import", "in", "is", "lambda", "None", "nonlocal", "not", "or", "pass", "raise",
        "return", "True", "try", "while", "with", "yield", "match", "case", "self", "print", "input", "int", "float",
        "str", "len", "range"};
    static const std::set<std::string> bash = {"git", "g++", "gcc", "cd", "npm", "node", "python"};
    static const std::set<std::string> sql = {
        "SELECT", "FROM", "WHERE", "DISTINCT", "ORDER", "BY", "ASC", "DESC", "LIMIT", "AND", "OR", "NOT", "LIKE", "IS",
        "NULL", "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE", "TABLE", "DROP", "ALTER", "PRIMARY",
        "FOREIGN", "KEY", "REFERENCES", "INTEGER", "TEXT", "REAL", "COUNT", "GROUP", "HAVING", "JOIN", "ON", "AS", "IN"};
    static const std::set<std::string> none;
    if (lang == "py") return py;
    if (lang == "bash") return bash;
    if (lang == "sql") return sql;
    if (lang == "text") return none;
    return cpp;
}

// En enkel tokenizer: kommentarer, strängar, tal, nyckelord och preprocessor-rader.
std::vector<Token> tokenize(const std::string& line, const std::string& lang, bool& inBlockComment) {
    const Palette& p = pal();
    std::vector<Token> out;
    const bool hashComment = lang == "py" || lang == "bash";
    if (lang == "text") return {{line, p.codeFg}};   // ingen färgning, t.ex. sanningstabeller
    size_t i = 0;
    auto push = [&](size_t from, size_t to, ImU32 c) { if (to > from) out.push_back({line.substr(from, to - from), c}); };

    while (i < line.size()) {
        if (inBlockComment) {
            size_t end = line.find("*/", i);
            size_t stop = end == std::string::npos ? line.size() : end + 2;
            push(i, stop, p.hlComment);
            i = stop;
            if (end != std::string::npos) inBlockComment = false;
            continue;
        }
        char c = line[i];
        if (lang == "sql" && line.compare(i, 2, "--") == 0) { push(i, line.size(), p.hlComment); break; }
        if (!hashComment && line.compare(i, 2, "//") == 0) { push(i, line.size(), p.hlComment); break; }
        if (!hashComment && line.compare(i, 2, "/*") == 0) { inBlockComment = true; continue; }
        if (hashComment && c == '#') { push(i, line.size(), p.hlComment); break; }
        if (!hashComment && c == '#') {
            size_t s = line.find_first_not_of(" \t");
            if (s == i) { push(i, line.size(), p.hlPreproc); break; }
        }
        if (c == '"' || c == '\'') {
            size_t j = i + 1;
            while (j < line.size() && line[j] != c) j += line[j] == '\\' ? 2 : 1;
            push(i, std::min(j + 1, line.size()), p.hlString);
            i = std::min(j + 1, line.size());
            continue;
        }
        if (std::isdigit((unsigned char)c)) {
            size_t j = i;
            while (j < line.size() && (std::isalnum((unsigned char)line[j]) || line[j] == '.')) j++;
            push(i, j, p.hlNumber);
            i = j;
            continue;
        }
        if (std::isalpha((unsigned char)c) || c == '_') {
            size_t j = i;
            while (j < line.size() && (std::isalnum((unsigned char)line[j]) || line[j] == '_' || (lang == "bash" && line[j] == '+'))) j++;
            std::string word = line.substr(i, j - i);
            size_t k = j;
            while (k < line.size() && line[k] == ' ') k++;
            ImU32 col = keywords(lang).count(word) ? p.hlKeyword : (k < line.size() && line[k] == '(') ? p.hlFunction : p.codeFg;
            push(i, j, col);
            i = j;
            continue;
        }
        size_t j = i + 1;
        while (j < line.size() && !std::isalnum((unsigned char)line[j]) && line[j] != '_' && line[j] != '"' &&
               line[j] != '\'' && line[j] != '#' && line[j] != '/')
            j++;
        push(i, j, p.codeFg);
        i = j;
    }
    return out;
}

}  // namespace

void codeBlock(const std::string& id, const std::string& code, const std::string& lang, const std::string& caption) {
    const Palette& p = pal();
    ImFont* mono = fonts().mono;
    std::vector<std::string> lines;
    size_t start = 0;
    while (start <= code.size()) {
        size_t end = code.find('\n', start);
        if (end == std::string::npos) end = code.size();
        lines.push_back(code.substr(start, end - start));
        start = end + 1;
    }
    while (!lines.empty() && lines.back().empty()) lines.pop_back();

    const float lineH = mono->FontSize * 1.5f;
    const float barH = px(30);
    const float height = barH + lines.size() * lineH + px(24);
    const float width = ImGui::GetContentRegionAvail().x;
    ImVec2 top = ImGui::GetCursorScreenPos();
    ImDrawList* dl = ImGui::GetWindowDrawList();
    dl->AddRectFilled(top, ImVec2(top.x + width, top.y + height), p.codeBg, px(10));
    dl->AddLine(ImVec2(top.x, top.y + barH), ImVec2(top.x + width, top.y + barH), p.codeLine);

    // Rubrikraden
    const std::string label = !caption.empty() ? caption : lang == "c" ? "C" : lang == "py" ? "Python" : lang == "bash" ? "terminal" : lang == "sql" ? "SQL" : lang == "text" ? "" : "C++";
    dl->AddText(fonts().small, fonts().small->FontSize, ImVec2(top.x + px(12), top.y + (barH - fonts().small->FontSize) / 2), p.hlComment, label.c_str());
    ImGui::SetCursorScreenPos(ImVec2(top.x + width - px(86), top.y + px(4)));
    ImGui::PushID(id.c_str());
    ImGui::PushFont(fonts().small);
    ImGui::PushStyleColor(ImGuiCol_Button, toVec4(withAlpha(p.codeBg, 0)));
    ImGui::PushStyleColor(ImGuiCol_ButtonHovered, toVec4(p.codeLine));
    ImGui::PushStyleColor(ImGuiCol_Text, toVec4(p.codeFg));
    ImGui::PushStyleColor(ImGuiCol_Border, toVec4(p.codeLine));
    ImGui::PushStyleVar(ImGuiStyleVar_FramePadding, ImVec2(px(8), px(2)));
    static double copiedAt = -10;
    static ImGuiID copiedId = 0;
    const bool recently = copiedId == ImGui::GetID("copy") && ImGui::GetTime() - copiedAt < 1.5;
    if (ImGui::Button(recently ? "Kopierat" : "Kopiera", ImVec2(px(78), 0))) {
        ImGui::SetClipboardText(code.c_str());
        copiedAt = ImGui::GetTime();
        copiedId = ImGui::GetID("copy");
    }
    ImGui::PopStyleVar();
    ImGui::PopStyleColor(4);
    ImGui::PopFont();

    // Själva koden i ett eget fönster så att långa rader kan skrollas i sidled.
    ImGui::SetCursorScreenPos(ImVec2(top.x, top.y + barH));
    ImGui::PushStyleVar(ImGuiStyleVar_WindowPadding, ImVec2(px(14), px(12)));
    ImGui::PushStyleVar(ImGuiStyleVar_ItemSpacing, ImVec2(0, 0));
    ImGui::BeginChild("code", ImVec2(width, height - barH), ImGuiChildFlags_AlwaysUseWindowPadding,
                      ImGuiWindowFlags_HorizontalScrollbar | ImGuiWindowFlags_NoBackground);
    ImGui::PushFont(mono);
    bool inComment = false;
    for (const std::string& line : lines) {
        ImVec2 pos = ImGui::GetCursorScreenPos();
        float x = pos.x;
        for (const Token& t : tokenize(line, lang, inComment)) {
            ImGui::GetWindowDrawList()->AddText(mono, mono->FontSize, ImVec2(x, pos.y + (lineH - mono->FontSize) / 2), t.color, t.text.c_str());
            x += mono->CalcTextSizeA(mono->FontSize, FLT_MAX, 0, t.text.c_str()).x;
        }
        ImGui::Dummy(ImVec2(x - pos.x, lineH));
    }
    ImGui::PopFont();
    ImGui::EndChild();
    ImGui::PopStyleVar(2);
    ImGui::PopID();
    ImGui::SetCursorScreenPos(ImVec2(top.x, top.y + height));
    ImGui::Dummy(ImVec2(width, px(14)));
}

const TextEditor::LanguageDefinition& pythonLanguage() {
    static TextEditor::LanguageDefinition lang = [] {
        TextEditor::LanguageDefinition d;
        d.mName = "Python";
        for (const char* k : {"and", "as", "assert", "break", "class", "continue", "def", "del", "elif", "else", "except",
                              "False", "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "None",
                              "nonlocal", "not", "or", "pass", "raise", "return", "True", "try", "while", "with", "yield",
                              "match", "case", "self"})
            d.mKeywords.insert(k);
        for (const char* f : {"print", "input", "int", "float", "str", "len", "range", "list", "dict", "set", "min", "max",
                              "sum", "abs", "sorted", "enumerate", "zip", "map", "open", "isinstance", "super"}) {
            TextEditor::Identifier id;
            id.mDeclaration = "Inbyggd funktion";
            d.mIdentifiers.insert({f, id});
        }
        using PI = TextEditor::PaletteIndex;
        d.mTokenRegexStrings = {
            {R"##([fFrRbB]?\"(\\.|[^\"])*\")##", PI::String},
            {R"##([fFrRbB]?\'(\\.|[^\'])*\')##", PI::String},
            {R"##([+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)([eE][+-]?[0-9]+)?)##", PI::Number},
            {R"##([a-zA-Z_][a-zA-Z0-9_]*)##", PI::Identifier},
            {R"##([\[\]\{\}\!\%\^\&\*\(\)\-\+\=\~\|\<\>\?\/\;\,\.\:])##", PI::Punctuation},
        };
        d.mSingleLineComment = "#";
        d.mCommentStart = "\"\"\"";
        d.mCommentEnd = "\"\"\"";
        d.mPreprocChar = '\x01';  // Python har ingen preprocessor; '#' är kommentar
        d.mAutoIndentation = true;
        d.mCaseSensitive = true;
        return d;
    }();
    return lang;
}

TextEditor::Palette editorPalette() {
    const Palette& p = pal();
    TextEditor::Palette e = TextEditor::GetDarkPalette();
    using PI = TextEditor::PaletteIndex;
    // TextEditor vill ha färgerna i formatet 0xAABBGGRR, samma som ImU32.
    e[(int)PI::Default] = p.codeFg;
    e[(int)PI::Keyword] = p.hlKeyword;
    e[(int)PI::Number] = p.hlNumber;
    e[(int)PI::String] = p.hlString;
    e[(int)PI::CharLiteral] = p.hlString;
    e[(int)PI::Punctuation] = p.codeFg;
    e[(int)PI::Preprocessor] = p.hlPreproc;
    e[(int)PI::Identifier] = p.codeFg;
    e[(int)PI::KnownIdentifier] = p.hlFunction;
    e[(int)PI::PreprocIdentifier] = p.hlPreproc;
    e[(int)PI::Comment] = p.hlComment;
    e[(int)PI::MultiLineComment] = p.hlComment;
    e[(int)PI::Background] = p.codeBg;
    e[(int)PI::Cursor] = p.hlKeyword;
    e[(int)PI::Selection] = withAlpha(p.hlPreproc, 0.3f);
    e[(int)PI::LineNumber] = p.hlComment;
    e[(int)PI::CurrentLineFill] = withAlpha(p.codeFg, 0.04f);
    e[(int)PI::CurrentLineFillInactive] = withAlpha(p.codeFg, 0.02f);
    e[(int)PI::CurrentLineEdge] = withAlpha(p.codeFg, 0.08f);
    return e;
}

}  // namespace nt::ui
