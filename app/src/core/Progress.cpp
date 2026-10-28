#include "Progress.h"

#include <cstdlib>
#include <fstream>

namespace nt {

using json = nlohmann::json;
namespace fs = std::filesystem;

static fs::path dataDir() {
#ifdef _WIN32
    if (const char* appdata = std::getenv("APPDATA")) return fs::path(appdata) / "Nollterm";
#else
    if (const char* xdg = std::getenv("XDG_DATA_HOME")) return fs::path(xdg) / "nollterm";
    if (const char* home = std::getenv("HOME")) return fs::path(home) / ".local" / "share" / "nollterm";
#endif
    return fs::temp_directory_path() / "nollterm";
}

ProgressStore::ProgressStore() : path_(dataDir() / "progress.json") {
    std::ifstream f(path_);
    if (f) {
        try { data_ = json::parse(f); } catch (...) { data_ = json::object(); }  // trasig fil: börja om
    }
    if (!data_.is_object()) data_ = json::object();
}

void ProgressStore::saveIfDirty() {
    if (!dirty_) return;
    std::error_code ec;
    fs::create_directories(path_.parent_path(), ec);
    // Skriv till en temporär fil och byt namn: då blir filen aldrig halvskriven om appen stängs.
    fs::path tmp = path_;
    tmp += ".tmp";
    {
        std::ofstream f(tmp);
        f << data_.dump(1);
    }
    fs::rename(tmp, path_, ec);
    dirty_ = false;
}

// ---- lektioner ----
bool ProgressStore::isDone(const std::string& c, const std::string& l) const {
    auto it = data_.find("done");
    if (it == data_.end() || !it->contains(c)) return false;
    for (auto& x : (*it)[c]) if (x == l) return true;
    return false;
}

void ProgressStore::setDone(const std::string& c, const std::string& l, bool done) {
    json& list = data_["done"][c];
    if (!list.is_array()) list = json::array();
    json out = json::array();
    for (auto& x : list) if (x != l) out.push_back(x);
    if (done) out.push_back(l);
    list = out;
    dirty_ = true;
}

int ProgressStore::doneCount(const std::string& c) const {
    auto it = data_.find("done");
    return it != data_.end() && it->contains(c) ? (int)(*it)[c].size() : 0;
}

// ---- svar ----
json toJson(const AnswerState& a) {
    json j;
    if (a.choice >= 0) j["choice"] = a.choice;
    if (!a.picks.empty()) j["picks"] = a.picks;
    if (!a.text.empty()) j["text"] = a.text;
    if (!a.code.empty()) {
        json code = json::object();
        for (auto& [l, src] : a.code) code[extension(l)] = src;
        j["code"] = code;
        j["lang"] = extension(a.language);
    }
    j["checked"] = a.checked;
    j["correct"] = a.correct;
    if (!a.results.empty()) {
        json rs = json::array();
        for (auto& r : a.results)
            rs.push_back({{"in", r.input}, {"want", r.expected}, {"got", r.actual.substr(0, 2000)}, {"err", r.error.substr(0, 2000)}, {"ok", r.passed}});
        j["results"] = rs;
    }
    return j;
}

AnswerState answerFromJson(const json& j) {
    AnswerState a;
    if (!j.is_object()) return a;
    a.choice = j.value("choice", -1);
    if (j.contains("picks")) a.picks = j["picks"].get<std::set<int>>();
    a.text = j.value("text", "");
    if (j.contains("code"))
        for (auto& [ext, src] : j["code"].items())
            if (auto l = languageFromExtension(ext)) a.code[*l] = src.get<std::string>();
    if (auto l = languageFromExtension(j.value("lang", "cpp"))) a.language = *l;
    a.checked = j.value("checked", false);
    a.correct = j.value("correct", false);
    if (j.contains("results"))
        for (auto& r : j["results"])
            a.results.push_back({r.value("in", ""), r.value("want", ""), r.value("got", ""), r.value("err", ""), r.value("ok", false)});
    return a;
}

AnswerState ProgressStore::practice(const std::string& c, const std::string& l, int q) const {
    const std::string key = c + ":" + l, idx = std::to_string(q);
    auto it = data_.find("practice");
    if (it == data_.end() || !it->contains(key) || !(*it)[key].contains(idx)) return {};
    return answerFromJson((*it)[key][idx]);
}

void ProgressStore::setPractice(const std::string& c, const std::string& l, int q, const AnswerState& a) {
    data_["practice"][c + ":" + l][std::to_string(q)] = toJson(a);
    dirty_ = true;
}

void ProgressStore::clearPractice(const std::string& c, const std::string& l) {
    if (data_.contains("practice")) data_["practice"].erase(c + ":" + l);
    dirty_ = true;
}

// ---- checklistor ----
bool ProgressStore::isChecked(const std::string& key) const {
    auto it = data_.find("checks");
    return it != data_.end() && it->value(key, false);
}

void ProgressStore::setChecked(const std::string& key, bool on) {
    data_["checks"][key] = on;
    dirty_ = true;
}

// ---- prov ----
std::vector<ExamResult> ProgressStore::exams(const std::string& c) const {
    std::vector<ExamResult> out;
    auto it = data_.find("exams");
    if (it == data_.end() || !it->contains(c)) return out;
    for (auto& e : (*it)[c]) {
        ExamResult r;
        r.timestamp = e.value("ts", 0LL);
        r.seconds = e.value("secs", 0);
        r.points = e.value("pts", 0);
        r.maxPoints = e.value("max", 0);
        r.percent = e.value("pct", 0);
        r.grade = gradeFor(r.percent);
        for (auto& it2 : e.value("items", json::array()))
            r.items.push_back({it2.value("l", 0), it2.value("q", 0), it2.value("order", std::vector<int>{})});
        for (auto& a : e.value("answers", json::array())) r.answers.push_back(answerFromJson(a));
        for (auto& ok : e.value("ok", json::array())) r.correct.push_back(ok.get<bool>());
        out.push_back(std::move(r));
    }
    return out;
}

void ProgressStore::addExam(const std::string& c, const ExamResult& r) {
    json e = {{"ts", r.timestamp}, {"secs", r.seconds}, {"pts", r.points}, {"max", r.maxPoints}, {"pct", r.percent}};
    json items = json::array(), answers = json::array();
    for (auto& it : r.items) items.push_back({{"l", it.lesson}, {"q", it.question}, {"order", it.optionOrder}});
    for (auto& a : r.answers) answers.push_back(toJson(a));
    e["items"] = items;
    e["answers"] = answers;
    e["ok"] = r.correct;
    json& list = data_["exams"][c];
    if (!list.is_array()) list = json::array();
    list.insert(list.begin(), e);           // nyast först
    while (list.size() > 15) list.erase(list.end() - 1);
    dirty_ = true;
}

// ---- kodlabb och inställningar ----
std::string ProgressStore::labCode(Language l) const {
    auto it = data_.find("lab");
    return it != data_.end() ? it->value(std::string("code_") + extension(l), "") : "";
}
void ProgressStore::setLabCode(Language l, const std::string& code) {
    data_["lab"][std::string("code_") + extension(l)] = code;
    dirty_ = true;
}
std::string ProgressStore::labInput() const {
    auto it = data_.find("lab");
    return it != data_.end() ? it->value("input", "") : "";
}
void ProgressStore::setLabInput(const std::string& s) {
    data_["lab"]["input"] = s;
    dirty_ = true;
}
Language ProgressStore::preferredLanguage() const {
    auto l = languageFromExtension(data_.value("language", "cpp"));
    return l ? *l : Language::Cpp;
}
void ProgressStore::setPreferredLanguage(Language l) {
    data_["language"] = extension(l);
    dirty_ = true;
}
bool ProgressStore::darkMode() const { return data_.value("dark", false); }
void ProgressStore::setDarkMode(bool on) {
    data_["dark"] = on;
    dirty_ = true;
}

}  // namespace nt
