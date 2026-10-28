#pragma once
// Kursinnehållet: kurser -> lektioner -> block och frågor.
// Allt läses från mappen content/ (JSON och kodfiler), så nya kurser kräver ingen ny kod.

#include <filesystem>
#include <memory>
#include <string>
#include <utility>
#include <vector>

#include "Question.h"

namespace nt {

namespace fs = std::filesystem;

// Ett stycke i en lektion. Bara vissa fält används beroende på typ.
enum class BlockType { Heading, Paragraph, List, Code, Table, Note, Widget, Exercise };

struct Block {
    BlockType type = BlockType::Paragraph;
    std::string text;                              // Heading: rubriken
    std::string html;                              // Paragraph, Note, Exercise: text med enkel HTML
    std::vector<std::string> items;                // List
    std::string lang, code, caption;               // Code (och Exercise: lösningens språk)
    std::vector<std::string> head;                 // Table: kolumnrubriker
    std::vector<std::vector<std::string>> rows;    // Table: rader
    std::string kind;                              // Note: "tip", "warn" eller "fix"
    std::string name;                              // Widget: vilken interaktiv figur
    std::string title, solution;                   // Exercise
};

struct Lesson {
    std::string id, title, category, date, lead;
    int minutes = 0;
    std::vector<std::string> sources, goals;
    std::vector<Block> blocks;
    std::vector<std::unique_ptr<Question>> questions;
};

struct TimelineEntry {
    std::string date, title;
    std::vector<std::string> lessonIds;
};

struct Assignment {
    struct Group {
        std::string heading;
        std::vector<std::string> items;
    };
    std::string id, kind, title, intro, hint;
    std::vector<Group> groups;
    std::vector<std::pair<std::string, std::string>> grades;  // ("G", "beskrivning")
    std::vector<std::string> lessonIds;
};

struct SourceDoc {
    std::string kind, title, description;
    std::vector<std::string> lessonIds;
};

struct Link {
    std::string kind, title, url, description;
};

struct Course {
    std::string id, badge, title, shortName, tag, description, headline;
    std::vector<Lesson> lessons;
    std::vector<TimelineEntry> timeline;
    std::vector<Assignment> assignments;
    std::vector<SourceDoc> sources;
    std::vector<Link> links;

    int lessonIndex(const std::string& lessonId) const;  // -1 om den saknas
    int questionCount() const;
    int codeTaskCount() const;
};

// Läser alla kurser i content/. Kastar std::runtime_error med en tydlig text vid fel.
std::vector<Course> loadCourses(const fs::path& contentDir);

// Läser tests.txt (block med "--- in" och "--- out").
std::vector<TestCase> parseTests(const std::string& text);

// Letar upp content/-mappen: bredvid programmet eller i någon föräldermapp (vid utveckling).
fs::path findContentDir(const fs::path& start);

}  // namespace nt
