// Compiles and runs user code with g++ (bundled w64devkit on Windows, or g++ on PATH).
const { spawn, execFile } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const IS_WIN = process.platform === "win32";
const MAX_OUT = 2 * 1024 * 1024; // 2 MB of output is plenty for exercises

function candidates() {
  const list = [];
  const exe = IS_WIN ? "g++.exe" : "g++";
  if (process.resourcesPath) list.push(path.join(process.resourcesPath, "w64devkit", "bin", exe)); // installed app
  list.push(path.join(__dirname, "vendor", "w64devkit", "bin", exe));                               // dev checkout
  return list;
}
function findCompiler() {
  for (const c of candidates()) if (fs.existsSync(c)) return { gxx: c, bin: path.dirname(c), bundled: true };
  return { gxx: IS_WIN ? "g++.exe" : "g++", bin: null, bundled: false }; // fall back to PATH
}
function envFor(bin) {
  const env = { ...process.env };
  if (bin) {
    const key = Object.keys(env).find(k => k.toUpperCase() === "PATH") || "PATH";
    env[key] = bin + path.delimiter + (env[key] || "");
  }
  return env;
}
function info() {
  const c = findCompiler();
  return new Promise(resolve => {
    execFile(c.gxx, ["--version"], { env: envFor(c.bin), timeout: 10000 }, (err, stdout) => {
      resolve(err ? { ok: false, path: c.gxx, error: String(err.message || err) } : { ok: true, path: c.gxx, bundled: c.bundled, version: stdout.split(/\r?\n/)[0] });
    });
  });
}

const SAFE_NAME = /^[\w-]+\.(cpp|cc|cxx|c|h|hpp|hh|txt|csv)$/i;
function collect(proc, limit) {
  let buf = "", over = false;
  return { push: d => { if (over) return; buf += d.toString(); if (buf.length > limit) { buf = buf.slice(0, limit) + "\n… (utdata kapad)"; over = true; try { proc.kill(); } catch (e) {} } }, get: () => buf };
}

/**
 * run({ files: [{name, content}], stdin, flags, timeoutMs })
 * -> { ok, stage: "compile"|"run", out, stderr, warnings, exitCode, timedOut, error }
 */
async function run(opts) {
  const files = (opts && opts.files) || [];
  if (!files.length) return { ok: false, stage: "compile", error: "Inga filer att kompilera." };
  for (const f of files) if (!SAFE_NAME.test(f.name)) return { ok: false, stage: "compile", error: `Ogiltigt filnamn: ${f.name}` };

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "nollterm-"));
  try {
    for (const f of files) fs.writeFileSync(path.join(dir, f.name), String(f.content || ""));
    const sources = files.map(f => f.name).filter(n => /\.(cpp|cc|cxx|c)$/i.test(n));
    if (!sources.length) return { ok: false, stage: "compile", error: "Ingen .cpp- eller .c-fil att kompilera." };

    const pureC = sources.every(n => /\.c$/i.test(n));
    const c = findCompiler();
    const compiler = pureC ? c.gxx.replace(/g\+\+(\.exe)?$/, (m, e) => "gcc" + (e || "")) : c.gxx;
    const userFlags = Array.isArray(opts.flags) && opts.flags.length ? opts.flags.filter(f => /^-[\w=+.:,-]+$/.test(f))
      : pureC ? ["-std=c11", "-Wall"] : ["-std=c++17", "-Wall"];
    const exe = path.join(dir, IS_WIN ? "prog.exe" : "prog");
    const args = [...userFlags, ...sources, "-o", exe, ...(IS_WIN ? ["-static"] : []), ...(pureC ? ["-lm"] : [])];
    const env = envFor(c.bin);

    const comp = await new Promise(resolve => {
      execFile(compiler, args, { cwd: dir, env, timeout: 60000, maxBuffer: MAX_OUT }, (err, stdout, stderr) => {
        resolve({ err, stderr: String(stderr || "").replaceAll(dir + path.sep, "") });
      });
    });
    if (comp.err) {
      const missing = comp.err.code === "ENOENT";
      return { ok: false, stage: "compile", stderr: comp.stderr, error: missing ? "Hittade ingen g++. Installera om appen, eller installera MinGW och lägg g++ i PATH." : comp.stderr || String(comp.err.message) };
    }

    const timeoutMs = Math.min(Math.max(+opts.timeoutMs || 5000, 500), 30000);
    return await new Promise(resolve => {
      const p = spawn(exe, [], { cwd: dir, env, windowsHide: true });
      const out = collect(p, MAX_OUT), err = collect(p, MAX_OUT);
      let timedOut = false;
      const t = setTimeout(() => { timedOut = true; try { p.kill("SIGKILL"); } catch (e) {} }, timeoutMs);
      p.stdout.on("data", out.push); p.stderr.on("data", err.push);
      p.on("error", e => { clearTimeout(t); resolve({ ok: false, stage: "run", out: out.get(), error: String(e.message || e) }); });
      p.on("close", (code, signal) => {
        clearTimeout(t);
        const base = { stage: "run", out: out.get(), stderr: err.get(), warnings: comp.stderr, exitCode: code, timedOut };
        if (timedOut) resolve({ ...base, ok: false, error: `Tidsgränsen (${timeoutMs / 1000} s) överskreds. Oändlig loop, eller väntar programmet på mer indata?` });
        else if (signal) resolve({ ...base, ok: false, error: `Programmet kraschade (${signal}${signal === "SIGSEGV" ? ": minnesfel/segfault" : signal === "SIGILL" ? ": ofta en funktion som saknar return" : signal === "SIGFPE" ? ": division med noll" : ""}).` });
        else if (code !== 0) resolve({ ...base, ok: false, error: `Programmet avslutades med kod ${code}${code === 3221225477 || code === -1073741819 ? " (minnesfel/segfault)" : code === 3221225501 || code === -1073741795 ? " (ogiltig instruktion: saknas ett return?)" : code === 3221225620 || code === -1073741676 ? " (division med noll)" : ""}.` });
        else resolve({ ...base, ok: true });
      });
      p.stdin.on("error", () => {});
      p.stdin.end(String(opts.stdin || ""));
    });
  } finally {
    setTimeout(() => { try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {} }, 1500);
  }
}

module.exports = { run, info, findCompiler };
