#pragma once
// Kör kod i C, C++ eller Python.
//
// Design (från OOP-kursen):
//   * LanguageRunner är en abstrakt basklass – ett gemensamt gränssnitt för alla språk.
//   * CompiledRunner (C och C++) och PythonRunner är konkreta subklasser.
//     Kompilerade språk översätts först till maskinkod, Python tolkas direkt (KUN11).
//   * build() är en ren virtuell funktion som varje språk implementerar på sitt sätt.
//   * makeRunner() är en fabrik (Factory Method) som skapar rätt subklass.
//   * Program äger en tillfällig mapp och raderar den i sin destruktor (RAII).

#include <filesystem>
#include <memory>
#include <string>
#include <vector>

#include "../core/Language.h"
#include "Process.h"

namespace nt {

namespace fs = std::filesystem;

// Var kompilatorer och Python finns. Appen letar först efter den medföljande
// verktygslådan (toolchain/ bredvid .exe-filen) och faller annars tillbaka på PATH.
struct Toolchain {
    std::string gcc = "gcc";
    std::string gxx = "g++";
    std::string python = "python3";
    std::vector<fs::path> extraPath;  // läggs först i PATH när program körs (för DLL:er)
    bool bundled = false;

    static Toolchain detect(const fs::path& appDir);
};

// Resultatet av en körning.
struct RunResult {
    bool ok = false;          // körde klart och returnerade 0
    std::string out;          // stdout
    std::string err;          // stderr
    std::string error;        // förklaring på svenska om något gick fel
    bool compileError = false;
    bool timedOut = false;
};

// Ett färdigbyggt program som kan köras många gånger (t.ex. en gång per testfall).
class Program {
public:
    Program(fs::path workDir, std::vector<std::string> command, EnvVars env, std::vector<fs::path> extraPath);
    ~Program();                                // raderar den tillfälliga mappen
    Program(const Program&) = delete;          // mappen får bara ha en ägare
    Program& operator=(const Program&) = delete;

    RunResult run(const std::string& input, int timeoutMs = 5000) const;

private:
    fs::path workDir_;
    std::vector<std::string> command_;
    EnvVars env_;
    std::vector<fs::path> extraPath_;
};

struct BuildResult {
    std::unique_ptr<Program> program;  // nullptr om bygget misslyckades
    std::string diagnostics;           // kompilatorns fel och varningar
    bool ok() const { return program != nullptr; }
};

class LanguageRunner {
public:
    explicit LanguageRunner(Toolchain tc) : tc_(std::move(tc)) {}
    virtual ~LanguageRunner() = default;

    virtual Language language() const = 0;

    // Översätt/förbered koden. För C/C++ betyder det att kompilera.
    virtual BuildResult build(const std::string& code) const = 0;

    // Bekvämlighet: bygg och kör en gång.
    RunResult run(const std::string& code, const std::string& input, int timeoutMs = 5000) const;

protected:
    // Skapar en ny tom mapp i systemets temp-katalog.
    static fs::path makeWorkDir();
    Toolchain tc_;
};

// C och C++ fungerar likadant: skriv källfil, kompilera med gcc/g++, kör .exe-filen.
class CompiledRunner : public LanguageRunner {
public:
    CompiledRunner(Toolchain tc, Language lang);
    Language language() const override { return lang_; }
    BuildResult build(const std::string& code) const override;

private:
    Language lang_;
};

// Python: skriv main.py och kör den med python-tolken. Ingen kompilering.
class PythonRunner : public LanguageRunner {
public:
    using LanguageRunner::LanguageRunner;
    Language language() const override { return Language::Python; }
    BuildResult build(const std::string& code) const override;
};

// Fabrik: ger rätt runner för språket.
std::unique_ptr<LanguageRunner> makeRunner(Language lang, const Toolchain& tc);

// Kompilatorernas version, för informationsrutan i appen.
std::string toolVersion(const std::string& program, const Toolchain& tc);

}  // namespace nt
