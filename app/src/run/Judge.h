#pragma once
// Rättar en koduppgift: bygg koden en gång och kör den mot varje testfall.

#include <string>
#include <vector>

#include "../core/Question.h"
#include "LanguageRunner.h"

namespace nt {

// Jämför utdata utan att bry sig om mellanslag i radslut eller tomma rader på slutet.
std::string normalizeOutput(const std::string& text);

std::vector<TestResult> runTests(const LanguageRunner& runner, const std::string& code,
                                 const std::vector<TestCase>& tests, int timeoutMs = 5000);

}  // namespace nt
