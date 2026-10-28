#pragma once
// Fabrik (Factory Method): skapar rätt Question-subklass utifrån "type" i JSON.
// Resten av programmet behöver bara känna till basklassen Question.

#include <memory>

#include <nlohmann/json_fwd.hpp>

#include "Question.h"

namespace nt {

// task används bara för kodfrågor (annars nullptr).
std::unique_ptr<Question> makeQuestion(const nlohmann::json& j, std::shared_ptr<const CodeTask> task);

}  // namespace nt
