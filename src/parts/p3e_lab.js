/* ================================================================ app config */
const APP = {
  repo: "https://github.com/NathanDavicent/Nollterm",
  pages: "https://nathandavicent.github.io/Nollterm/",
};

/* ================================================================ code lab */
const LAB_EXAMPLES = {
  hello: { label: "Loop + indata (funkar på webben)", files: [{ name: "main.cpp", content: R`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        cout << i << " * " << i << " = " << i * i << endl;
    }
    return 0;
}` }], stdin: "5" },
  greet: { label: "std::string + getline (desktop)", files: [{ name: "main.cpp", content: R`#include <iostream>
#include <string>
using namespace std;

int main() {
    string name;
    cout << "Vad heter du? ";
    getline(cin, name);
    cout << "Hej " << name << "!" << endl;
    return 0;
}` }], stdin: "Nathanael" },
  sensor: { label: "Sensor-klass i tre filer (desktop)", files: [
    { name: "main.cpp", content: R`#include "sensor.h"

int main() {
    Sensor s1(1, "TempSensor", 22.5f);
    s1.printInfo();
    s1.setValue(23.1f);
    s1.printInfo();
    return 0;
}` },
    { name: "sensor.h", content: R`#ifndef SENSOR_H
#define SENSOR_H

#include <string>

class Sensor {
private:
    int id;
    std::string name;
    float value;
public:
    Sensor(int i, std::string n, float v);
    void setValue(float v);
    void printInfo() const;
};

#endif` },
    { name: "sensor.cpp", content: R`#include <iostream>
#include "sensor.h"

Sensor::Sensor(int i, std::string n, float v)
    : id(i), name(n), value(v) {}

void Sensor::setValue(float v) {
    value = v;
}

void Sensor::printInfo() const {
    std::cout << "Sensor " << id << " (" << name << "): " << value << "\n";
}` },
  ], stdin: "" },
  stats: { label: "vector + statistik (desktop)", files: [{ name: "main.cpp", content: R`#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm>
using namespace std;

int main() {
    vector<double> v;
    double x;
    while (cin >> x) v.push_back(x);
    if (v.empty()) { cout << "Inga värden\n"; return 1; }

    double sum = 0;
    for (double d : v) sum += d;
    double mean = sum / v.size();
    double var = 0;
    for (double d : v) var += (d - mean) * (d - mean);
    var /= v.size();

    sort(v.begin(), v.end());
    cout << "Antal: " << v.size() << "\n"
         << "Min: " << v.front() << "  Max: " << v.back() << "\n"
         << "Medel: " << mean << "  Std: " << sqrt(var) << "\n";
    return 0;
}` }], stdin: "21.5 22.0 19.8 23.4 20.1" },
};
function labState() {
  if (!state.lab || !state.lab.files || !state.lab.files.length) {
    const e = LAB_EXAMPLES.hello;
    state.lab = { files: JSON.parse(JSON.stringify(e.files)), cur: 0, stdin: e.stdin, flags: "-std=c++17 -Wall" };
  }
  if (state.lab.cur >= state.lab.files.length) state.lab.cur = 0;
  return state.lab;
}
function viewLab() {
  return `<nav class="crumbs"><a href="#hem">Kurser</a><span>/</span><span>Kodlabb</span></nav>
  <header class="thead"><div class="eyebrow">Kodlabb · ${NATIVE ? "g++ på din dator" : "webbtolk"}</div><h1>Skriv vad du vill och kör det.</h1>
  <p class="lead">${NATIVE ? "Fri kodmiljö med riktig g++: flera filer, headers, string, vector, klasser och kompilatorflaggor." : "Fri kodmiljö. På webben körs main.cpp i en förenklad tolk. Flera filer och full C++ kräver desktop-appen."}</p></header>
  <div id="lab" style="margin-top:20px"></div>`;
}
function renderLab() {
  const L = labState(), box = $("#lab"); if (!box) return;
  const f = L.files[L.cur];
  box.innerHTML = `
  <div class="controls" style="justify-content:space-between">
    <label for="lab-ex">Exempel <select id="lab-ex"><option value="">Välj…</option>${Object.entries(LAB_EXAMPLES).map(([k, e]) => `<option value="${k}">${esc(e.label)}</option>`).join("")}</select></label>
    ${NATIVE ? `<label for="lab-flags">Flaggor <input type="text" id="lab-flags" value="${esc(L.flags)}" style="width:220px"></label>` : `<a class="chip" href="#app">Skaffa desktop-appen för full C++ →</a>`}
  </div>
  <div class="editor">
    <div class="bar2" style="padding:0 6px 0 0;align-items:stretch">
      <div class="labtabs" role="tablist">${L.files.map((x, i) => `<button type="button" role="tab" aria-selected="${i === L.cur}" data-tab="${i}">${esc(x.name)}${L.files.length > 1 ? `<span data-del="${i}" title="Ta bort ${esc(x.name)}" aria-label="Ta bort ${esc(x.name)}">×</span>` : ""}</button>`).join("")}
        <button type="button" data-new title="Ny fil">+ fil</button></div>
      <span style="display:flex;gap:6px;align-items:center"><a href="https://godbolt.org/" target="_blank" rel="noopener" data-gb>Compiler Explorer ↗</a></span>
    </div>
    <div id="lab-newfile" hidden style="padding:8px 10px;border-bottom:1px solid var(--code-line);display:flex;gap:8px;flex-wrap:wrap;align-items:center">
      <input type="text" id="lab-fname" placeholder="t.ex. sensor.h" style="font-family:var(--f-mono);font-size:.82rem;padding:4px 8px;border-radius:5px;border:1px solid var(--code-line);background:transparent;color:var(--code-fg)">
      <button type="button" data-create>Skapa</button><span data-ferr style="color:var(--bad);font-size:.75rem;font-family:var(--f-mono)"></span>
    </div>
    <div class="ed"><div class="gut" aria-hidden="true"></div><textarea spellcheck="false" autocapitalize="off" autocomplete="off" id="lab-ed" aria-label="Kodredigerare">${esc(f.content)}</textarea></div>
  </div>
  <div class="ioarea"><div><label for="lab-in">Indata (stdin)</label><textarea id="lab-in" spellcheck="false">${esc(L.stdin)}</textarea></div>
    <div><label>Utdata</label><div class="term" id="lab-out" aria-live="polite"><span class="dim">Tryck Kör (Ctrl+Enter).</span></div></div></div>
  <div class="qactions"><button type="button" class="btn primary" id="lab-run">Kör ▶</button><span class="status" id="lab-st" style="font-weight:400;color:var(--muted)"></span></div>
  ${NATIVE ? "" : `<p class="runner-note">Webbtolken stöder cout/cin, printf/scanf, funktioner, loopar, arrayer, pekare och C-strängar. Exemplen med flera filer, string och vector körs bara i desktop-appen eller i Compiler Explorer.</p>`}`;
  const ta = $("#lab-ed"), gut = $(".gut", box);
  const syncGut = () => { gut.textContent = Array.from({ length: ta.value.split("\n").length }, (_, i) => i + 1).join("\n"); ta.style.height = "auto"; ta.style.height = Math.max(320, ta.scrollHeight + 4) + "px"; };
  syncGut();
  ta.addEventListener("input", () => { L.files[L.cur].content = ta.value; syncGut(); save(); });
  ta.addEventListener("keydown", e => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); $("#lab-run").click(); return; }
    if (e.key === "Tab" && !e.shiftKey) { e.preventDefault(); ta.setRangeText("    ", ta.selectionStart, ta.selectionEnd, "end"); ta.dispatchEvent(new Event("input")); }
    else if (e.key === "Enter") {
      const before = ta.value.slice(0, ta.selectionStart); const line = before.slice(before.lastIndexOf("\n") + 1);
      let ind = (line.match(/^\s*/) || [""])[0]; if (/\{\s*$/.test(line)) ind += "    ";
      e.preventDefault(); ta.setRangeText("\n" + ind, ta.selectionStart, ta.selectionEnd, "end"); ta.dispatchEvent(new Event("input"));
    }
  });
  $("#lab-in").addEventListener("input", e => { L.stdin = e.target.value; save(); });
  const fl = $("#lab-flags"); if (fl) fl.addEventListener("input", () => { L.flags = fl.value; save(); });
  $$("[data-tab]", box).forEach(b => b.addEventListener("click", e => {
    if (e.target.dataset.del !== undefined) {
      const i = +e.target.dataset.del; L.files.splice(i, 1); L.cur = Math.max(0, Math.min(L.cur, L.files.length - 1)); save(); renderLab(); return;
    }
    L.cur = +b.dataset.tab; save(); renderLab();
  }));
  $("[data-new]", box).addEventListener("click", () => { const nf = $("#lab-newfile"); nf.hidden = !nf.hidden; if (!nf.hidden) $("#lab-fname").focus(); });
  const create = () => {
    const n = $("#lab-fname").value.trim();
    if (!/^[\w-]+\.(cpp|cc|c|h|hpp)$/.test(n)) { $("[data-ferr]", box).textContent = "Namn som sensor.h eller utils.cpp"; return; }
    if (L.files.some(x => x.name === n)) { $("[data-ferr]", box).textContent = "Filen finns redan"; return; }
    const guard = n.replace(/\W/g, "_").toUpperCase();
    L.files.push({ name: n, content: /\.(h|hpp)$/.test(n) ? `#ifndef ${guard}\n#define ${guard}\n\n\n\n#endif\n` : `#include <iostream>\n\n` });
    L.cur = L.files.length - 1; save(); renderLab();
  };
  $("[data-create]", box).addEventListener("click", create);
  $("#lab-fname").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); create(); } });
  $("#lab-ex").addEventListener("change", e => {
    const ex = LAB_EXAMPLES[e.target.value]; if (!ex) return;
    L.files = JSON.parse(JSON.stringify(ex.files)); L.cur = 0; L.stdin = ex.stdin; save(); renderLab();
  });
  $("[data-gb]", box).addEventListener("click", e => { e.currentTarget.href = godboltUrl(L.files.filter(x => /\.(cpp|cc|c)$/.test(x.name)).map(x => x.content)[0] || ta.value, L.stdin); });
  $("#lab-run").addEventListener("click", async () => {
    const out = $("#lab-out"), st = $("#lab-st");
    out.innerHTML = `<span class="dim">${NATIVE ? "Kompilerar…" : "Kör…"}</span>`; st.textContent = "";
    const t0 = performance.now();
    let r;
    if (NATIVE) r = await runNative(L.files, L.stdin, L.flags.split(/\s+/).filter(Boolean));
    else {
      const srcs = L.files.filter(x => /\.(cpp|cc|c)$/.test(x.name));
      const main = L.files.find(x => /^main\.(cpp|cc|c)$/.test(x.name)) || srcs[0];
      if (!main) { out.innerHTML = '<span class="err">Ingen .cpp-fil att köra.</span>'; return; }
      if (srcs.length > 1 || /#include\s*"/.test(main.content)) { out.innerHTML = '<span class="err">Flera filer och egna headers kräver desktop-appen (riktig g++). Öppna gärna i Compiler Explorer.</span>'; return; }
      r = await runInterp(main.content, L.stdin);
    }
    const ms = Math.round(performance.now() - t0);
    out.innerHTML = (r.warnings ? `<span class="dim">${esc(r.warnings)}</span>\n` : "") + esc(r.out || "") + (r.stderr ? `<span class="err">${esc(r.stderr)}</span>` : "") +
      (r.ok ? (r.out || r.stderr ? "" : '<span class="dim">(ingen utdata)</span>') : `<span class="err">${r.out ? "\n" : ""}${esc(explainError(r.error))}</span>`);
    st.textContent = `${r.ok ? "Klart" : "Fel"} på ${ms} ms`;
  });
}

/* ================================================================ app page */
function viewApp() {
  const rel = APP.repo + "/releases/latest";
  return `<nav class="crumbs"><a href="#hem">Kurser</a><span>/</span><span>Appen</span></nav>
  <header class="thead"><div class="eyebrow">Desktop och mobil</div><h1>${NATIVE ? "Du kör desktop-appen." : "Nollterm som app."}</h1>
  <p class="lead">Samma kurser överallt. Desktop-appen för Windows har riktig g++ inbyggd. Webbversionen funkar på mobilen och kan installeras som en app.</p></header>
  <div class="courses" style="margin-top:22px">
    <div class="ccard"><span class="code-badge">g++</span><div><div class="eyebrow">Windows</div><h3>Desktop-appen</h3></div>
      <p>All kod kompileras med g++ (MinGW, w64devkit) som följer med installationen. Full C++, flera filer och headers i Kodlabbet, inga tidsgränser från en webbtjänst.</p>
      ${NATIVE ? `<p id="cinfo" style="font-family:var(--f-mono);font-size:.8rem">Kollar kompilatorn…</p>` : `<div class="cta"><a class="btn primary" href="${rel}" target="_blank" rel="noopener">Ladda ner för Windows ↗</a></div>
      <ol style="margin:0;padding-left:20px;font-size:.9rem;color:var(--muted)"><li>Ladda ner <code>Nollterm-Setup-….exe</code> under Assets.</li><li>Windows kan varna eftersom appen inte är signerad: klicka <b>Mer information → Kör ändå</b>.</li><li>Följ installationen. Appen uppdateras när du laddar ner en ny version.</li></ol>`}
    </div>
    <div class="ccard"><span class="code-badge">web</span><div><div class="eyebrow">Mobil och webb</div><h3>Webbversionen</h3></div>
      <p>Teori, frågor, prov och enklare kod i webbläsarens tolk. Fungerar offline efter första besöket.</p>
      <p style="font-family:var(--f-mono);font-size:.8rem;overflow-wrap:anywhere">${esc(APP.pages)}</p>
      <ol style="margin:0;padding-left:20px;font-size:.9rem;color:var(--muted)"><li><b>iPhone:</b> öppna länken i Safari → Dela → Lägg till på hemskärmen.</li><li><b>Android:</b> öppna i Chrome → menyn ⋮ → Installera app.</li></ol>
    </div>
  </div>
  <p class="sub" style="margin-top:22px;color:var(--muted);font-size:.88rem">Framsteg sparas per enhet. Källkoden finns på <a href="${APP.repo}" target="_blank" rel="noopener">GitHub ↗</a>.</p>`;
}
function bindApp() {
  const el = $("#cinfo"); if (!el || !window.nollterm || !window.nollterm.info) return;
  window.nollterm.info().then(i => { el.textContent = i && i.version ? `${i.version}\n${i.path}` : "Hittade ingen g++. Installera om appen."; el.style.whiteSpace = "pre-wrap"; }).catch(() => (el.textContent = "Kunde inte läsa kompilatorn."));
}

/* ================================================================ offline (PWA) */
if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol) && !NATIVE && !/^localhost$|^127\./.test(location.hostname)) {
  window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });
}
