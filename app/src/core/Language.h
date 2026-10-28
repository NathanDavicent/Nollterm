#pragma once
// Språken som kodfrågorna och kodlabbet kan köras i.
// enum class ger typsäkerhet: Language::Cpp kan inte blandas ihop med ett int.

#include <optional>
#include <string>

namespace nt {

enum class Language { C, Cpp, Python };

// Namn som visas i gränssnittet, t.ex. "C++".
const char* displayName(Language lang);

// Filändelse för källkoden, t.ex. "cpp". Används för filnamn i content/.
const char* extension(Language lang);

// "c" -> Language::C osv. Tom optional om ändelsen inte är känd.
std::optional<Language> languageFromExtension(const std::string& ext);

// Alla språk i den ordning de visas i rullgardinen.
inline constexpr Language kAllLanguages[] = {Language::C, Language::Cpp, Language::Python};

}  // namespace nt
