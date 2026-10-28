#include "LanguageRunner.h"

#include <atomic>
#include <chrono>
#include <fstream>
#include <random>
#include <thread>

namespace nt {

#ifdef _WIN32
static constexpr const char* kExe = ".exe";
#else
static constexpr const char* kExe = "";
#endif

// ------------------------------------------------------------------------------ Toolchain

Toolchain Toolchain::detect(const fs::path& appDir) {
    Toolchain tc;
#ifdef _WIN32
    tc.python = "python";
#endif
    // Medföljande verktyg i den installerade appen: toolchain/w64devkit och toolchain/python
    fs::path kit = appDir / "toolchain" / "w64devkit" / "bin";
    if (fs::exists(kit / (std::string("g++") + kExe))) {
        tc.gcc = (kit / (std::string("gcc") + kExe)).string();
        tc.gxx = (kit / (std::string("g++") + kExe)).string();
        tc.extraPath.push_back(kit);
        tc.bundled = true;
    }
    fs::path py = appDir / "toolchain" / "python" / (std::string("python") + kExe);
    if (fs::exists(py)) tc.python = py.string();
    return tc;
}

std::string toolVersion(const std::string& program, const Toolchain& tc) {
    ProcessResult r = runProcess({program, "--version"}, "", 10000, fs::temp_directory_path(), {}, tc.extraPath);
    if (r.startFailed || r.exitCode != 0) return "hittades inte";
    std::string text = r.out.empty() ? r.err : r.out;  // python 2 skrev versionen på stderr
    return text.substr(0, text.find('\n'));
}

// ------------------------------------------------------------------------------ Program

Program::Program(fs::path workDir, std::vector<std::string> command, EnvVars env, std::vector<fs::path> extraPath)
    : workDir_(std::move(workDir)), command_(std::move(command)), env_(std::move(env)), extraPath_(std::move(extraPath)) {}

Program::~Program() {
    // På Windows kan .exe-filen vara låst en kort stund efter att programmet avslutats.
    for (int attempt = 0; attempt < 5; attempt++) {
        std::error_code ec;
        fs::remove_all(workDir_, ec);
        if (!ec) return;
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }
}

// Översätter Windows-felkoder och Linux-signaler till begripliga meddelanden.
static std::string crashReason(const ProcessResult& p) {
    if (!p.signalName.empty()) {
        if (p.signalName == "SIGSEGV") return "minnesfel (segfault) – läser eller skriver du utanför en array, eller via en ogiltig pekare?";
        if (p.signalName == "SIGFPE")  return "division med noll";
        if (p.signalName == "SIGILL")  return "ogiltig instruktion – saknar en funktion return?";
        if (p.signalName == "SIGABRT") return "programmet avbröts (abort/assert)";
        return p.signalName;
    }
    switch ((unsigned)p.exitCode) {
        case 0xC0000005u: return "minnesfel (segfault) – läser eller skriver du utanför en array, eller via en ogiltig pekare?";
        case 0xC0000094u: return "division med noll";
        case 0xC000001Du: return "ogiltig instruktion – saknar en funktion return?";
        case 0xC00000FDu: return "stacken tog slut – oändlig rekursion?";
        case 3u:          return "programmet avbröts (abort/assert)";
    }
    return "";
}

RunResult Program::run(const std::string& input, int timeoutMs) const {
    ProcessResult p = runProcess(command_, input, timeoutMs, workDir_, env_, extraPath_);
    RunResult r;
    r.out = std::move(p.out);
    r.err = std::move(p.err);
    if (p.startFailed) {
        r.error = "Kunde inte starta " + command_.front() + ".";
    } else if (p.timedOut) {
        r.timedOut = true;
        r.error = "Tidsgränsen (" + std::to_string(timeoutMs / 1000) + " s) överskreds. Oändlig loop, eller väntar programmet på mer indata?";
    } else if (p.exitCode != 0) {
        std::string why = crashReason(p);
        r.error = why.empty() ? "Programmet avslutades med kod " + std::to_string(p.exitCode) + "."
                              : "Programmet kraschade: " + why + (why.back() == '?' ? "" : ".");
    } else {
        r.ok = true;
    }
    return r;
}

// ------------------------------------------------------------------------------ LanguageRunner

fs::path LanguageRunner::makeWorkDir() {
    static std::atomic<unsigned> counter{0};
    std::random_device rd;
    fs::path dir = fs::temp_directory_path() / "nollterm" /
                   ("run-" + std::to_string(rd()) + "-" + std::to_string(counter++));
    fs::create_directories(dir);
    return dir;
}

static void writeFile(const fs::path& path, const std::string& text) {
    std::ofstream f(path, std::ios::binary);
    f << text;
}

RunResult LanguageRunner::run(const std::string& code, const std::string& input, int timeoutMs) const {
    BuildResult b = build(code);
    if (!b.ok()) {
        RunResult r;
        r.compileError = true;
        r.error = "Kompileringsfel";
        r.err = b.diagnostics;
        return r;
    }
    RunResult r = b.program->run(input, timeoutMs);
    if (!b.diagnostics.empty()) r.err = b.diagnostics + (r.err.empty() ? "" : "\n" + r.err);  // varningar först
    return r;
}

// ------------------------------------------------------------------------------ C och C++

CompiledRunner::CompiledRunner(Toolchain tc, Language lang) : LanguageRunner(std::move(tc)), lang_(lang) {}

BuildResult CompiledRunner::build(const std::string& code) const {
    fs::path dir = makeWorkDir();
    const bool isC = lang_ == Language::C;
    const std::string source = isC ? "main.c" : "main.cpp";
    const std::string exe = std::string("prog") + kExe;
    writeFile(dir / source, code);

    std::vector<std::string> args = {isC ? tc_.gcc : tc_.gxx, isC ? "-std=c11" : "-std=c++17", "-Wall", "-O0",
                                     source, "-o", exe};
    if (isC) args.push_back("-lm");  // math.h (sqrt, pow) behöver -lm i C
#ifdef _WIN32
    args.push_back("-static");       // .exe-filen ska inte behöva några DLL:er
#endif

    ProcessResult p = runProcess(args, "", 60000, dir, {}, tc_.extraPath);
    BuildResult result;
    result.diagnostics = p.err + p.out;
    if (p.startFailed) {
        result.diagnostics = std::string("Hittade ingen ") + (isC ? "gcc" : "g++") +
                             ". Installera om appen, eller installera MinGW och lägg den i PATH.";
    } else if (p.exitCode == 0) {
        result.program = std::make_unique<Program>(dir, std::vector<std::string>{(dir / exe).string()},
                                                   EnvVars{}, tc_.extraPath);
        return result;
    }
    std::error_code ec;
    fs::remove_all(dir, ec);
    return result;
}

// ------------------------------------------------------------------------------ Python

BuildResult PythonRunner::build(const std::string& code) const {
    fs::path dir = makeWorkDir();
    writeFile(dir / "main.py", code);
    // PYTHONUTF8 gör att å, ä och ö fungerar i in- och utdata även på Windows.
    EnvVars env = {{"PYTHONUTF8", "1"}, {"PYTHONIOENCODING", "utf-8"}, {"PYTHONDONTWRITEBYTECODE", "1"}};
    BuildResult result;
    result.program = std::make_unique<Program>(dir, std::vector<std::string>{tc_.python, "main.py"}, env, tc_.extraPath);
    return result;
}

std::unique_ptr<LanguageRunner> makeRunner(Language lang, const Toolchain& tc) {
    switch (lang) {
        case Language::C:      return std::make_unique<CompiledRunner>(tc, Language::C);
        case Language::Cpp:    return std::make_unique<CompiledRunner>(tc, Language::Cpp);
        case Language::Python: return std::make_unique<PythonRunner>(tc);
    }
    return nullptr;
}

}  // namespace nt
