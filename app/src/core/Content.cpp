#include "Content.h"

#include <fstream>
#include <sstream>
#include <stdexcept>

#include <nlohmann/json.hpp>

#include "QuestionFactory.h"

namespace nt {

using json = nlohmann::json;

static std::string readText(const fs::path& path) {
    std::ifstream f(path, std::ios::binary);
    if (!f) throw std::runtime_error("Kunde inte läsa " + path.string());
    std::stringstream ss;
    ss << f.rdbuf();
    return ss.str();
}

static json readJson(const fs::path& path) {
    try {
        return json::parse(readText(path));
    } catch (const json::parse_error& e) {
        throw std::runtime_error("Fel i " + path.string() + ": " + e.what());
    }
}

// Hjälpfunktion: läs ett fält om det finns, annars standardvärde.
template <typename T>
static T get(const json& j, const char* key, T fallback = T{}) {
    auto it = j.find(key);
    return it != j.end() && !it->is_null() ? it->get<T>() : fallback;
}

int Course::lessonIndex(const std::string& lessonId) const {
    for (size_t i = 0; i < lessons.size(); i++)
        if (lessons[i].id == lessonId) return (int)i;
    return -1;
}

int Course::questionCount() const {
    int n = 0;
    for (auto& l : lessons) n += (int)l.questions.size();
    return n;
}

int Course::codeTaskCount() const {
    int n = 0;
    for (auto& l : lessons)
        for (auto& q : l.questions) n += q->type() == QuestionType::Code;
    return n;
}

std::vector<TestCase> parseTests(const std::string& text) {
    std::vector<TestCase> tests;
    std::istringstream in(text);
    std::string line, section, buf;
    TestCase current;
    auto flush = [&] {
        while (!buf.empty() && buf.back() == '\n') buf.pop_back();
        if (section == "in") current.input = buf;
        else if (section == "out") { current.expected = buf; tests.push_back(current); current = {}; }
        buf.clear();
    };
    while (std::getline(in, line)) {
        if (!line.empty() && line.back() == '\r') line.pop_back();
        if (line == "--- in" || line == "--- out") {
            flush();
            section = line.substr(4);
        } else {
            buf += line + "\n";
        }
    }
    flush();
    return tests;
}

static std::shared_ptr<CodeTask> loadTask(const fs::path& dir, const std::string& id) {
    if (!fs::exists(dir / "tests.txt")) throw std::runtime_error("Uppgiften " + id + " saknar tests.txt");
    auto task = std::make_shared<CodeTask>();
    task->id = id;
    task->tests = parseTests(readText(dir / "tests.txt"));
    for (Language l : kAllLanguages) {
        std::string ext = extension(l);
        if (fs::exists(dir / ("starter." + ext))) task->starter[l] = readText(dir / ("starter." + ext));
        if (fs::exists(dir / ("solution." + ext))) task->solution[l] = readText(dir / ("solution." + ext));
    }
    return task;
}

static Block parseBlock(const json& j) {
    Block b;
    const std::string t = j.at("type");
    if (t == "h") { b.type = BlockType::Heading; b.text = j.at("text"); }
    else if (t == "p") { b.type = BlockType::Paragraph; b.html = j.at("html"); }
    else if (t == "list") { b.type = BlockType::List; b.items = j.at("items").get<std::vector<std::string>>(); }
    else if (t == "code") { b.type = BlockType::Code; b.lang = j.at("lang"); b.code = j.at("code"); b.caption = get<std::string>(j, "caption"); }
    else if (t == "table") { b.type = BlockType::Table; b.head = j.at("head").get<std::vector<std::string>>();
                             b.rows = j.at("rows").get<std::vector<std::vector<std::string>>>(); }
    else if (t == "note") { b.type = BlockType::Note; b.kind = j.at("kind"); b.html = j.at("html"); }
    else if (t == "widget") { b.type = BlockType::Widget; b.name = j.at("name"); }
    else if (t == "exercise") { b.type = BlockType::Exercise; b.title = j.at("title"); b.html = j.at("html");
                                b.solution = get<std::string>(j, "solution"); b.lang = get<std::string>(j, "lang", "cpp"); }
    else throw std::runtime_error("Okänd blocktyp: " + t);
    return b;
}

static Course loadCourse(const fs::path& dir) {
    json c = readJson(dir / "course.json");
    Course course;
    course.id = c.at("id");
    course.badge = get<std::string>(c, "badge");
    course.title = c.at("title");
    course.shortName = get<std::string>(c, "short", course.title);
    course.tag = get<std::string>(c, "tag");
    course.description = get<std::string>(c, "description");
    course.headline = get<std::string>(c, "headline", course.title);

    for (const std::string file : c.at("lessons")) {
        json j = readJson(dir / "lessons" / file);
        Lesson l;
        l.id = j.at("id");
        l.title = j.at("title");
        l.category = get<std::string>(j, "category");
        l.minutes = get<int>(j, "minutes");
        l.date = get<std::string>(j, "date");
        l.lead = get<std::string>(j, "lead");
        l.sources = get<std::vector<std::string>>(j, "sources");
        l.goals = get<std::vector<std::string>>(j, "goals");
        for (auto& b : j.at("blocks")) l.blocks.push_back(parseBlock(b));
        for (auto& q : j.at("questions")) {
            std::shared_ptr<CodeTask> task;
            if (q.contains("task")) {
                std::string id = q.at("task");
                task = loadTask(dir / "tasks" / id, id);
                task->runsInBrowser = get<bool>(q, "web");
            }
            l.questions.push_back(makeQuestion(q, task));
        }
        course.lessons.push_back(std::move(l));
    }
    for (auto& t : get<json>(c, "timeline", json::array()))
        course.timeline.push_back({t.at("date"), t.at("title"), t.at("lessons").get<std::vector<std::string>>()});
    for (auto& a : get<json>(c, "assignments", json::array())) {
        Assignment as;
        as.id = a.at("id");
        as.kind = get<std::string>(a, "kind");
        as.title = a.at("title");
        as.intro = get<std::string>(a, "intro");
        as.hint = get<std::string>(a, "hint");
        for (auto& g : a.at("groups")) as.groups.push_back({g.at("h"), g.at("items").get<std::vector<std::string>>()});
        for (auto& g : get<json>(a, "grade", json::array())) as.grades.emplace_back(g.at(0), g.at(1));
        as.lessonIds = get<std::vector<std::string>>(a, "topics");
        course.assignments.push_back(std::move(as));
    }
    for (auto& s : get<json>(c, "sources", json::array()))
        course.sources.push_back({s.at("kind"), s.at("title"), s.at("description"), s.at("lessons").get<std::vector<std::string>>()});
    for (auto& l : get<json>(c, "links", json::array()))
        course.links.push_back({l.at("kind"), l.at("title"), l.at("url"), l.at("description")});
    return course;
}

std::vector<Course> loadCourses(const fs::path& contentDir) {
    json index = readJson(contentDir / "courses.json");
    std::vector<Course> courses;
    for (const std::string id : index.at("courses")) {
        try {
            courses.push_back(loadCourse(contentDir / id));
        } catch (const json::exception& e) {
            throw std::runtime_error("Fel i kursen " + id + ": " + e.what());
        }
    }
    return courses;
}

fs::path findContentDir(const fs::path& start) {
    for (fs::path p = start; !p.empty(); p = p.parent_path()) {
        if (fs::exists(p / "content" / "courses.json")) return p / "content";
        if (p == p.parent_path()) break;
    }
    return {};
}

}  // namespace nt
