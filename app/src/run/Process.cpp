#include "Process.h"

#include <chrono>
#include <cstdlib>
#include <thread>

namespace nt {

static constexpr size_t kMaxOutput = 2 * 1024 * 1024;  // 2 MB räcker gott för övningar

}  // namespace nt

// =====================================================================================
#ifdef _WIN32
// =====================================================================================
#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN
#endif
#ifndef NOMINMAX
#define NOMINMAX
#endif
#include <windows.h>
#include <shellapi.h>

namespace nt {

// Windows-API:t vill ha UTF-16 (wchar_t). Vi använder UTF-8 överallt annars.
static std::wstring widen(const std::string& s) {
    if (s.empty()) return {};
    int n = MultiByteToWideChar(CP_UTF8, 0, s.data(), (int)s.size(), nullptr, 0);
    std::wstring w(n, L'\0');
    MultiByteToWideChar(CP_UTF8, 0, s.data(), (int)s.size(), w.data(), n);
    return w;
}

// Bygger en kommandorad enligt Windows regler för citattecken.
static std::wstring quoteArg(const std::wstring& a) {
    if (!a.empty() && a.find_first_of(L" \t\"") == std::wstring::npos) return a;
    std::wstring q = L"\"";
    size_t backslashes = 0;
    for (wchar_t c : a) {
        if (c == L'\\') { backslashes++; continue; }
        if (c == L'"') q.append(backslashes * 2 + 1, L'\\');
        else q.append(backslashes, L'\\');
        backslashes = 0;
        q.push_back(c);
    }
    q.append(backslashes * 2, L'\\');
    q.push_back(L'"');
    return q;
}

// Läser allt från ett rör (pipe) tills det stängs. Körs i en egen tråd.
static void drain(HANDLE pipe, std::string& target) {
    char buf[4096];
    DWORD n = 0;
    while (ReadFile(pipe, buf, sizeof buf, &n, nullptr) && n > 0)
        if (target.size() < kMaxOutput) target.append(buf, n);
}

ProcessResult runProcess(const std::vector<std::string>& args, const std::string& stdinData, int timeoutMs,
                         const std::filesystem::path& workDir, const EnvVars& extraEnv,
                         const std::vector<std::filesystem::path>& extraPath) {
    ProcessResult res;

    // Tre rör: vi skriver till barnets stdin och läser från dess stdout/stderr.
    SECURITY_ATTRIBUTES sa{sizeof(sa), nullptr, TRUE};
    HANDLE inR, inW, outR, outW, errR, errW;
    CreatePipe(&inR, &inW, &sa, 0);
    CreatePipe(&outR, &outW, &sa, 0);
    CreatePipe(&errR, &errW, &sa, 0);
    // Våra ändar av rören ska inte ärvas av barnet.
    SetHandleInformation(inW, HANDLE_FLAG_INHERIT, 0);
    SetHandleInformation(outR, HANDLE_FLAG_INHERIT, 0);
    SetHandleInformation(errR, HANDLE_FLAG_INHERIT, 0);

    // Miljövariabler: kopiera våra egna och lägg till extra (t.ex. PYTHONUTF8=1 och PATH).
    std::wstring env;
    {
        std::wstring prefix;
        for (auto& p : extraPath) prefix += p.wstring() + L";";
        LPWCH block = GetEnvironmentStringsW();
        for (LPWCH v = block; *v; v += wcslen(v) + 1) {
            std::wstring var = v;
            if (_wcsnicmp(var.c_str(), L"PATH=", 5) == 0) var = L"PATH=" + prefix + var.substr(5);
            env += var;
            env.push_back(L'\0');
        }
        FreeEnvironmentStringsW(block);
        for (auto& [k, val] : extraEnv) {
            env += widen(k) + L"=" + widen(val);
            env.push_back(L'\0');
        }
        env.push_back(L'\0');
    }

    std::wstring cmd;
    for (size_t i = 0; i < args.size(); i++) cmd += (i ? L" " : L"") + quoteArg(widen(args[i]));

    STARTUPINFOW si{};
    si.cb = sizeof(si);
    si.dwFlags = STARTF_USESTDHANDLES;
    si.hStdInput = inR;
    si.hStdOutput = outW;
    si.hStdError = errW;
    PROCESS_INFORMATION pi{};

    BOOL started = CreateProcessW(nullptr, cmd.data(), nullptr, nullptr, TRUE,
                                  CREATE_NO_WINDOW | CREATE_UNICODE_ENVIRONMENT, env.data(),
                                  workDir.wstring().c_str(), &si, &pi);
    CloseHandle(inR);
    CloseHandle(outW);
    CloseHandle(errW);
    if (!started) {
        CloseHandle(inW); CloseHandle(outR); CloseHandle(errR);
        res.startFailed = true;
        return res;
    }

    std::thread tOut(drain, outR, std::ref(res.out));
    std::thread tErr(drain, errR, std::ref(res.err));
    // Skriv indata i en egen tråd så att ett program som inte läser stdin inte låser oss.
    std::thread tIn([&] {
        DWORD written = 0;
        if (!stdinData.empty()) WriteFile(inW, stdinData.data(), (DWORD)stdinData.size(), &written, nullptr);
        CloseHandle(inW);
    });

    if (WaitForSingleObject(pi.hProcess, timeoutMs) == WAIT_TIMEOUT) {
        res.timedOut = true;
        TerminateProcess(pi.hProcess, 1);
        WaitForSingleObject(pi.hProcess, 2000);
    }
    DWORD code = 0;
    GetExitCodeProcess(pi.hProcess, &code);
    res.exitCode = (int)code;

    tIn.join();
    tOut.join();
    tErr.join();
    CloseHandle(outR);
    CloseHandle(errR);
    CloseHandle(pi.hThread);
    CloseHandle(pi.hProcess);
    return res;
}

void openUrl(const std::string& url) {
    ShellExecuteW(nullptr, L"open", widen(url).c_str(), nullptr, nullptr, SW_SHOWNORMAL);
}

}  // namespace nt

// =====================================================================================
#else  // Linux / macOS
// =====================================================================================
#include <csignal>
#include <cstring>
#include <fcntl.h>
#include <poll.h>
#include <sys/wait.h>
#include <unistd.h>

namespace nt {

ProcessResult runProcess(const std::vector<std::string>& args, const std::string& stdinData, int timeoutMs,
                         const std::filesystem::path& workDir, const EnvVars& extraEnv,
                         const std::vector<std::filesystem::path>& extraPath) {
    ProcessResult res;
    int inPipe[2], outPipe[2], errPipe[2];
    if (pipe(inPipe) || pipe(outPipe) || pipe(errPipe)) { res.startFailed = true; return res; }
    // Ett extra rör som stängs automatiskt vid exec: får vi data här misslyckades exec.
    int execPipe[2];
    if (pipe(execPipe)) { res.startFailed = true; return res; }
    fcntl(execPipe[1], F_SETFD, FD_CLOEXEC);

    pid_t pid = fork();
    if (pid == 0) {
        // ---- barnprocessen ----
        dup2(inPipe[0], 0);
        dup2(outPipe[1], 1);
        dup2(errPipe[1], 2);
        close(inPipe[1]); close(outPipe[0]); close(errPipe[0]); close(execPipe[0]);
        if (chdir(workDir.c_str()) != 0) _exit(127);
        for (auto& [k, v] : extraEnv) setenv(k.c_str(), v.c_str(), 1);
        if (!extraPath.empty()) {
            std::string p;
            for (auto& d : extraPath) p += d.string() + ":";
            const char* old = getenv("PATH");
            setenv("PATH", (p + (old ? old : "")).c_str(), 1);
        }
        std::vector<char*> argv;
        for (auto& a : args) argv.push_back(const_cast<char*>(a.c_str()));
        argv.push_back(nullptr);
        execvp(argv[0], argv.data());
        char fail = 1;
        (void)!write(execPipe[1], &fail, 1);
        _exit(127);
    }
    // ---- föräldern (vi) ----
    close(inPipe[0]); close(outPipe[1]); close(errPipe[1]); close(execPipe[1]);
    if (pid < 0) { res.startFailed = true; return res; }

    char execFailed = 0;
    if (read(execPipe[0], &execFailed, 1) == 1) res.startFailed = true;
    close(execPipe[0]);

    signal(SIGPIPE, SIG_IGN);  // programmet kan stänga stdin innan vi skrivit klart
    size_t written = 0;
    if (stdinData.empty()) { close(inPipe[1]); inPipe[1] = -1; }
    else fcntl(inPipe[1], F_SETFL, O_NONBLOCK);  // skriv i bitar, utan att blockera

    auto deadline = std::chrono::steady_clock::now() + std::chrono::milliseconds(timeoutMs);
    bool outOpen = true, errOpen = true;
    char buf[4096];
    while (outOpen || errOpen) {
        int left = (int)std::chrono::duration_cast<std::chrono::milliseconds>(deadline - std::chrono::steady_clock::now()).count();
        if (left <= 0) { res.timedOut = true; kill(pid, SIGKILL); break; }
        pollfd fds[3];
        int n = 0;
        if (outOpen) fds[n++] = {outPipe[0], POLLIN, 0};
        if (errOpen) fds[n++] = {errPipe[0], POLLIN, 0};
        if (inPipe[1] >= 0) fds[n++] = {inPipe[1], POLLOUT, 0};
        if (poll(fds, n, left) <= 0) continue;
        for (int i = 0; i < n; i++) {
            if (!fds[i].revents) continue;
            if (fds[i].fd == inPipe[1]) {
                ssize_t w = write(inPipe[1], stdinData.data() + written, stdinData.size() - written);
                if (w > 0) written += (size_t)w;
                if (w < 0 || written >= stdinData.size()) { close(inPipe[1]); inPipe[1] = -1; }
                continue;
            }
            ssize_t r = read(fds[i].fd, buf, sizeof buf);
            std::string& target = fds[i].fd == outPipe[0] ? res.out : res.err;
            if (r > 0) { if (target.size() < kMaxOutput) target.append(buf, (size_t)r); }
            else { if (fds[i].fd == outPipe[0]) outOpen = false; else errOpen = false; }
        }
    }
    if (inPipe[1] >= 0) close(inPipe[1]);
    close(outPipe[0]);
    close(errPipe[0]);

    int status = 0;
    waitpid(pid, &status, 0);
    if (WIFEXITED(status)) res.exitCode = WEXITSTATUS(status);
    else if (WIFSIGNALED(status)) {
        res.exitCode = 128 + WTERMSIG(status);
        int sig = WTERMSIG(status);
        res.signalName = sig == SIGSEGV ? "SIGSEGV" : sig == SIGFPE ? "SIGFPE" : sig == SIGILL ? "SIGILL"
                       : sig == SIGABRT ? "SIGABRT" : sig == SIGKILL ? "SIGKILL" : "signal " + std::to_string(sig);
    }
    return res;
}

void openUrl(const std::string& url) {
#ifdef __APPLE__
    std::string cmd = "open '" + url + "' &";
#else
    std::string cmd = "xdg-open '" + url + "' >/dev/null 2>&1 &";
#endif
    (void)!std::system(cmd.c_str());
}

}  // namespace nt
#endif
