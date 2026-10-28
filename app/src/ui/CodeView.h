#pragma once
// Kodblock i lektionerna: färgad syntax, rubrik och en Kopiera-knapp.
// (Redigerbar kod använder TextEditor istället, se QuestionView och ViewLab.)

#include <string>

#include <cstdint>  // TextEditor.h använder uint8_t utan att inkludera <cstdint>
#include <TextEditor.h>

namespace nt::ui {

// lang: "c", "cpp", "py" eller "bash". caption visas i listen ovanför koden.
void codeBlock(const std::string& id, const std::string& code, const std::string& lang, const std::string& caption = "");

// Språkdefinitioner och färger för TextEditor. Python saknas i biblioteket, så vi gör en egen.
const TextEditor::LanguageDefinition& pythonLanguage();
TextEditor::Palette editorPalette();

}  // namespace nt::ui
