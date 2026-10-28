#pragma once
// Startar ett annat program (t.ex. g++ eller ditt kompilerade program),
// skickar in text på stdin, samlar upp stdout/stderr och dödar det om det tar för lång tid.
//
// Windows och Linux gör detta på helt olika sätt (CreateProcess vs fork/exec),
// så Process.cpp har två implementationer bakom samma funktion.

#include <filesystem>
#include <string>
#include <utility>
#include <vector>

namespace nt {

struct ProcessResult {
    int exitCode = -1;          // programmets returvärde (return 0 i main = 0)
    std::string out;            // allt som skrevs till stdout
    std::string err;            // allt som skrevs till stderr
    bool timedOut = false;      // dödat efter tidsgränsen
    bool startFailed = false;   // programmet hittades inte / kunde inte startas
    std::string signalName;     // Linux: t.ex. "SIGSEGV" om programmet kraschade
};

using EnvVars = std::vector<std::pair<std::string, std::string>>;

// args[0] är programmet, resten är argument. Inga skal-tecken tolkas,
// så filnamn med mellanslag fungerar utan citattecken.
ProcessResult runProcess(const std::vector<std::string>& args,
                         const std::string& stdinData,
                         int timeoutMs,
                         const std::filesystem::path& workDir,
                         const EnvVars& extraEnv = {},
                         const std::vector<std::filesystem::path>& extraPath = {});

// Öppnar en webbadress i användarens vanliga webbläsare.
void openUrl(const std::string& url);

}  // namespace nt
