#include "QuestionFactory.h"

#include <stdexcept>

#include <nlohmann/json.hpp>

namespace nt {

std::unique_ptr<Question> makeQuestion(const nlohmann::json& j, std::shared_ptr<const CodeTask> task) {
    const std::string type = j.at("type");
    const std::string prompt = j.at("q");
    const std::string why = j.value("why", "");

    if (type == "mc")
        return std::make_unique<SingleChoiceQuestion>(prompt, why, j.at("options").get<std::vector<std::string>>(),
                                                      j.at("answer").get<int>());
    if (type == "multi")
        return std::make_unique<MultiChoiceQuestion>(prompt, why, j.at("options").get<std::vector<std::string>>(),
                                                     j.at("answers").get<std::set<int>>());
    if (type == "text")
        return std::make_unique<TextQuestion>(prompt, why, j.at("accept").get<std::vector<std::string>>(),
                                              j.value("placeholder", ""));
    if (type == "code") {
        if (!task) throw std::runtime_error("Kodfråga utan uppgift: " + prompt);
        return std::make_unique<CodeQuestion>(prompt, why, std::move(task));
    }
    throw std::runtime_error("Okänd frågetyp: " + type);
}

}  // namespace nt
