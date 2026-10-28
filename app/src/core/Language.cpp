#include "Language.h"

namespace nt {

const char* displayName(Language lang) {
    switch (lang) {
        case Language::C:      return "C";
        case Language::Cpp:    return "C++";
        case Language::Python: return "Python";
    }
    return "?";
}

const char* extension(Language lang) {
    switch (lang) {
        case Language::C:      return "c";
        case Language::Cpp:    return "cpp";
        case Language::Python: return "py";
    }
    return "";
}

std::optional<Language> languageFromExtension(const std::string& ext) {
    for (Language l : kAllLanguages)
        if (ext == extension(l)) return l;
    return std::nullopt;
}

}  // namespace nt
