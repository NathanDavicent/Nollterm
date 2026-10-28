/* ================================================================ C++ runner (Web Worker, lazy) */
let cppWorker = null, cppSeq = 0;
const cppPending = new Map();
function failAllPending(msg) {
  cppPending.forEach(p => { clearTimeout(p.to); p.res({ ok: false, out: "", error: msg }); });
  cppPending.clear();
}
function getCppWorker() {
  if (cppWorker) return cppWorker;
  cppWorker = new Worker("cpp-runner.js");
  cppWorker.onmessage = e => {
    const p = cppPending.get(e.data.id);
    if (!p) return;
    clearTimeout(p.to); cppPending.delete(e.data.id); p.res(e.data);
  };
  cppWorker.onerror = () => { failAllPending("Kodtolken kunde inte laddas här. Öppna koden i Compiler Explorer istället."); try { cppWorker.terminate(); } catch (e) {} cppWorker = null; };
  return cppWorker;
}
/* Gamla Electron-appen exponerade window.nollterm.run. C++-appen kör inte webbsidan, så på webben är NATIVE alltid false. */
const NATIVE = !!(window.nollterm && typeof window.nollterm.run === "function");

/* ================================================================ Python runner (Pyodide i en Web Worker) */
// Pyodide är riktig CPython kompilerad till WebAssembly. Första gången laddas ca 10 MB, sedan cachas det.
let pyWorker = null, pyReady = null, pySeq = 0;
const pyPending = new Map();
function getPyWorker() {
  if (pyWorker) return pyReady;
  pyWorker = new Worker("py-runner.js");
  pyReady = new Promise((ok, fail) => {
    pyWorker.onmessage = e => {
      if (e.data.ready) { ok(pyWorker); return; }
      if (e.data.loadError) { fail(new Error(e.data.loadError)); return; }
      const p = pyPending.get(e.data.id);
      if (!p) return;
      clearTimeout(p.to); pyPending.delete(e.data.id); p.res(e.data);
    };
    pyWorker.onerror = () => fail(new Error("Python kunde inte laddas här."));
  });
  pyReady.catch(() => { try { pyWorker.terminate(); } catch (e) {} pyWorker = null; });
  return pyReady;
}
async function runPy(code, input) {
  let w;
  try { w = await getPyWorker(); }
  catch (e) { return { ok: false, out: "", error: "Python kunde inte laddas. Kolla internetanslutningen (första gången hämtas Pyodide, ca 10 MB)." }; }
  return new Promise(res => {
    const id = ++pySeq;
    const to = setTimeout(() => {
      pyPending.delete(id);
      try { w.terminate(); } catch (e) {}
      pyWorker = null;
      pyPending.forEach(p => { clearTimeout(p.to); p.res({ ok: false, out: "", error: "Avbruten." }); });
      pyPending.clear();
      res({ ok: false, out: "", error: "Tidsgränsen (10 s) överskreds. Har du en oändlig loop, eller väntar programmet på mer indata?" });
    }, 10000);
    pyPending.set(id, { res, to });
    w.postMessage({ id, code, input: input || "" });
  });
}

/* ================================================================ språk */
const LANG_NAME = { c: "C", cpp: "C++", py: "Python" };
const LANG_FILE = { c: "main.c", cpp: "main.cpp", py: "main.py" };
const LANG_HL = { c: "c", cpp: "cpp", py: "python" };
const prefLang = () => state.prefs.lang || "cpp";
// Språket en kodfråga visas i: det sparade svarets språk, annars ditt valda språk om det går på webben.
function langOf(q, a) {
  if (a && a.lang && q.code[a.lang]) return a.lang;
  const pref = prefLang();
  if (q.web.includes(pref)) return pref;
  return q.web[0] || (q.code[pref] ? pref : q.langs[0]);
}
const starterOf = (q, lang) => q.code[lang || langOf(q)].starter;
function runCode(lang, code, input) {
  if (lang === "py") return runPy(code, input);
  return runCpp(code, input);
}
async function runNative(files, input, flags) {
  try {
    const r = await window.nollterm.run({ files, stdin: input || "", flags });
    if (r.stage === "compile" && !r.ok) return { ok: false, out: "", error: "Kompileringsfel:\n" + (r.stderr || r.error || ""), compile: true };
    if (!r.ok) return { ok: false, out: r.out || "", error: r.error || r.stderr || "Programmet avslutades med fel." };
    return { ok: true, out: r.out || "", stderr: r.stderr || "", warnings: r.warnings || "" };
  } catch (e) { return { ok: false, out: "", error: "Kunde inte köra g++: " + (e && e.message || e) }; }
}
function runCpp(code, input) {
  if (NATIVE) return runNative([{ name: /#include\s*<iostream>|std::|\bclass\b|\bcout\b/.test(code) || !/#include\s*<stdio\.h>/.test(code) ? "main.cpp" : "main.c", content: code }], input);
  return runInterp(code, input);
}
function runInterp(code, input) {
  return new Promise(res => {
    let w;
    try { w = getCppWorker(); } catch (e) { res({ ok: false, out: "", error: "Kodtolken är inte tillgänglig i den här vyn. Öppna koden i Compiler Explorer istället." }); return; }
    const id = ++cppSeq;
    const to = setTimeout(() => {
      cppPending.delete(id);
      try { w.terminate(); } catch (e) {}
      cppWorker = null;
      failAllPending("Avbruten.");
      res({ ok: false, out: "", error: "Tidsgränsen överskreds. Har du en oändlig loop, eller väntar programmet på mer indata?" });
    }, 6000);
    cppPending.set(id, { res, to });
    w.postMessage({ id, code, input: input || "" });
  });
}
const normOut = s => String(s || "").replace(/\r/g, "").split("\n").map(l => l.replace(/\s+$/, "")).join("\n").replace(/\n+$/, "").replace(/^\n+/, "");
function explainError(msg) {
  const m = String(msg || "");
  if (!NATIVE && /cannot find library|is not defined|Parsing Failure|not a left value|does not exist/i.test(m))
    return m + "\n\nWebbtolken stöder en del av C/C++: cout/cin, printf/scanf, funktioner, loopar, arrayer, pekare och C-strängar. Använder du string, vector, referenser, struct, klasser eller enum: prova i Compiler Explorer.";
  return m;
}
async function runTests(q, code, lang) {
  const out = [];
  for (const t of q.tests) {
    const r = await runCode(lang || "cpp", code, t.in);
    out.push({ in: t.in, want: t.out, got: r.out || "", error: r.ok ? null : r.error, pass: r.ok && normOut(r.out) === normOut(t.out) });
    if (!r.ok && (r.compile || /Tidsgränsen|inte tillgänglig|kunde inte laddas|Python kunde inte/.test(r.error || ""))) { while (out.length < q.tests.length) out.push({ in: q.tests[out.length].in, want: q.tests[out.length].out, got: "", error: "Hoppades över", pass: false }); break; }
  }
  return out;
}
function godboltUrl(code, stdin, lang) {
  const isC = lang === "c", cid = isC ? "cg132" : "g132";
  const state = { sessions: [{ id: 1, language: isC ? "c" : "c++", source: code, compilers: [{ id: cid, options: "-Wall" }], executors: [{ compiler: { id: cid, libs: [], options: "" }, stdin: stdin || "", stdinVisible: true }] }] };
  const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(state)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return "https://godbolt.org/clientstate/" + b64;
}

/* ================================================================ grading */
const normText = s => String(s || "").toLowerCase().replace(/[’']/g, '"').replace(/\s+/g, "").replace(/;+$/, "");
function gradeSync(q, a) {
  if (!a || a.v === undefined || a.v === null) return false;
  if (q.t === "mc") return a.v === q.a;
  if (q.t === "multi") { const v = (a.v || []).slice().sort().join(","); return v === q.a.slice().sort().join(","); }
  if (q.t === "text") { const v = normText(a.v); return v !== "" && q.accept.some(x => normText(x) === v); }
  return !!a.ok;
}
const usable = q => !(q.gpp && !NATIVE);   // gpp: ingen av uppgiftens språk går att köra på webben
const isAnswered = (q, a) => !!a && (q.t === "multi" ? (a.v || []).length > 0 : q.t === "text" ? String(a.v || "").trim() !== "" : q.t === "code" ? !!a.v && a.v.trimEnd() !== starterOf(q, a.lang).trimEnd() : a.v !== undefined);

/* ================================================================ question component */
function mountQuestion(el, q, o) {
  const mode = o.mode;                      // practice | exam | review
  let a = o.ans ? JSON.parse(JSON.stringify(o.ans)) : null;
  const order = o.perm || q.o && q.o.map((_, i) => i);
  const emit = () => o.onAnswer && o.onAnswer(a);
  const pts = TYPE_POINTS[q.t];

  function head() {
    return `<div class="qhead"><span class="qn">FRÅGA ${o.n} AV ${o.total}${o.from ? " · " + esc(o.from) : ""}${mode !== "practice" ? ` · ${pts} P` : ""}</span><span class="qtype ${q.t === "code" ? "code" : ""}">${TYPE_LABEL[q.t]}</span></div>
      <div class="qt">${q.q}</div>`;
  }
  function whyBox(ok) { return `<div class="why">${ok ? '<b class="r">Rätt.</b>' : '<b class="w">Inte riktigt.</b>'} ${q.why || ""}</div>`; }

  function renderChoice() {
    const multi = q.t === "multi";
    const sel = multi ? (a && a.v) || [] : a && a.v !== undefined ? [a.v] : [];
    const checked = mode === "review" || (mode === "practice" && a && a.checked);
    const opts = order.map((oi, pos) => {
      let cls = "";
      const picked = sel.includes(oi);
      const correct = multi ? q.a.includes(oi) : q.a === oi;
      if (checked) {
        if (correct && picked) cls = "right picked";
        else if (picked) cls = "wrong";
        else if (correct) cls = multi ? "missed" : "right";
      } else if (picked) cls = "sel";
      return `<button type="button" class="opt ${cls}" data-o="${oi}" ${checked ? "disabled" : ""} ${multi ? `role="checkbox" aria-checked="${picked}"` : ""}><span class="l">${multi ? '<span class="box"></span>' : "ABCDEFG"[pos]}</span><span>${q.o[oi]}</span></button>`;
    }).join("");
    let foot = "";
    if (mode === "practice" && multi && !checked) foot = `<div class="qactions"><button type="button" class="btn primary" data-act="check" ${sel.length ? "" : "disabled"}>Kontrollera</button><span class="status" style="color:var(--muted);font-weight:400">Välj alla alternativ som stämmer.</span></div>`;
    if (mode === "exam" && multi) foot = `<div class="qactions"><span class="status" style="color:var(--muted);font-weight:400">Välj alla alternativ som stämmer.</span></div>`;
    if (checked) foot = whyBox(gradeSync(q, a)) + (mode === "practice" ? `<div class="qactions"><button type="button" class="btn" data-act="retry">Försök igen</button></div>` : "");
    el.innerHTML = `<div class="q ${mode === "review" ? (gradeSync(q, a) ? "review-r" : "review-w") : ""}">${head()}<div class="opts">${opts}</div>${foot}</div>`;
    $$(".opt", el).forEach(b => b.addEventListener("click", () => {
      const oi = +b.dataset.o;
      if (multi) {
        const cur = new Set((a && a.v) || []);
        cur.has(oi) ? cur.delete(oi) : cur.add(oi);
        a = { v: [...cur] };
      } else {
        a = { v: oi };
        if (mode === "practice") { a.checked = true; a.ok = gradeSync(q, a); }
      }
      emit(); renderChoice();
    }));
    const ck = $('[data-act="check"]', el);
    if (ck) ck.addEventListener("click", () => { a.checked = true; a.ok = gradeSync(q, a); emit(); renderChoice(); });
    const rt = $('[data-act="retry"]', el);
    if (rt) rt.addEventListener("click", () => { a = null; emit(); renderChoice(); });
  }

  function renderText() {
    const checked = mode === "review" || (mode === "practice" && a && a.checked);
    const ok = gradeSync(q, a);
    const cls = checked ? (ok ? "right" : "wrong") : "";
    el.innerHTML = `<div class="q ${mode === "review" ? (ok ? "review-r" : "review-w") : ""}">${head()}
      <input class="tin ${cls}" type="text" id="tin-${o.uid}" placeholder="${esc(q.ph || "Ditt svar")}" value="${esc((a && a.v) || "")}" autocomplete="off" spellcheck="false" ${mode === "review" ? "readonly" : ""} aria-label="Ditt svar">
      ${mode === "practice" ? `<div class="qactions"><button type="button" class="btn primary" data-act="check">Kontrollera</button>${checked ? `<span class="status ${ok ? "r" : "w"}">${ok ? "Rätt" : "Inte riktigt, försök igen eller läs förklaringen"}</span>` : '<span class="status" style="color:var(--muted);font-weight:400">Enter för att kontrollera. Stora/små bokstäver och mellanslag spelar ingen roll.</span>'}</div>` : ""}
      ${checked ? `${whyBox(ok)}<div class="accepted">Godkända svar: ${q.accept.map(x => `<code>${esc(x)}</code>`).join(", ")}</div>` : ""}
    </div>`;
    const inp = $(".tin", el);
    if (mode === "review") return;
    inp.addEventListener("input", () => { a = { v: inp.value }; if (mode === "exam") emit(); });
    const check = () => { a = { v: inp.value, checked: true }; a.ok = gradeSync(q, a); emit(); renderText(); const n = $(".tin", el); n.focus(); n.setSelectionRange(n.value.length, n.value.length); };
    if (mode === "practice") {
      $('[data-act="check"]', el).addEventListener("click", check);
      inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); check(); } });
    }
  }

  function renderCode() {
    const lang = langOf(q, a);
    const blocked = !q.web.includes(lang) && !NATIVE;   // språket går inte att köra i webbläsaren
    const code = a && a.v !== undefined && (a.lang || "cpp") === lang ? a.v : starterOf(q, lang);
    const ex = q.tests[0];
    const res = a && a.res;
    const ok = !!(a && a.ok);
    const showSol = mode === "review" || (mode === "practice" && (res || blocked));
    // I provet går bara språk som kan rättas här att välja. När du övar syns alla, med en notis.
    const choices = mode === "exam" ? q.langs.filter(l => q.web.includes(l)) : q.langs;
    const langBar = mode === "review" ? "" : `<div class="langbar" role="group" aria-label="Språk">${choices.map(l =>
      `<button type="button" class="chip" data-lang="${l}" aria-pressed="${l === lang}">${LANG_NAME[l]}${q.web.includes(l) || NATIVE ? "" : ' <small>appen</small>'}</button>`).join("")}</div>`;
    const note = lang === "py"
      ? "Python körs med Pyodide, riktig CPython i webbläsaren. Första körningen laddar ner Python (ca 10 MB)."
      : 'C och C++ körs i en tolk i webbläsaren som stöder cout/cin, printf/scanf, funktioner, loopar, arrayer, pekare och C-strängar. För full C++: öppna i Compiler Explorer, eller använd <a href="#app">appen med riktig gcc och g++</a>.';
    el.innerHTML = `<div class="q ${mode === "review" ? (ok ? "review-r" : "review-w") : ""}">${head()}
      <div class="example">Exempel: indata <pre>${esc(ex.in)}</pre> ger utdata <pre>${esc(ex.out)}</pre></div>
      ${langBar}
      <div class="editor">
        <div class="bar2"><span>${LANG_FILE[lang]}</span><span style="display:flex;gap:6px;flex-wrap:wrap">${mode !== "review" ? '<button type="button" data-act="reset">Återställ</button>' : ""}${lang !== "py" ? '<a href="https://godbolt.org/" target="_blank" rel="noopener" data-act="gb">Öppna i Compiler Explorer ↗</a>' : ""}</span></div>
        <div class="ed"><div class="gut" aria-hidden="true"></div><textarea spellcheck="false" autocapitalize="off" autocomplete="off" id="ed-${o.uid}" aria-label="Kodredigerare" ${mode === "review" ? "readonly" : ""}>${esc(code)}</textarea></div>
      </div>
      ${blocked && mode !== "review" ? `<div class="note warn" style="margin-top:10px"><span class="tag">app</span><div><p>Den här uppgiften i ${LANG_NAME[lang]} använder delar av språket som webbtolken inte klarar. Byt till ${q.web.length ? q.web.map(l => LANG_NAME[l]).join(" eller ") : "ett annat språk"}, kör den i <a href="#app">appen</a> eller öppna den i Compiler Explorer.</p></div></div>` : ""}
      ${mode !== "review" && !blocked ? `<div class="ioarea"><div><label for="in-${o.uid}">Indata (stdin)</label><textarea id="in-${o.uid}" spellcheck="false">${esc(ex.in)}</textarea></div><div><label>Utdata</label><div class="term" data-out aria-live="polite"><span class="dim">Tryck Kör för att köra programmet.</span></div></div></div>
      <div class="qactions"><button type="button" class="btn" data-act="run">Kör ▶</button>${mode === "practice" ? '<button type="button" class="btn primary" data-act="test">Kör testerna</button>' : '<span class="status" style="color:var(--muted);font-weight:400">Dolda tester körs när du lämnar in.</span>'}<span class="status" data-st></span></div>` : ""}
      <div class="tests" data-tests>${res ? testsHtml(res) : ""}</div>
      ${res && mode !== "exam" ? whyBox(ok) : ""}
      ${showSol ? `<details class="sol" style="margin-top:10px"><summary style="cursor:pointer;color:var(--mask);font-weight:700;font-size:.9rem">Visa lösningsförslag (${LANG_NAME[lang]})</summary>${codeBlock(LANG_HL[lang], q.code[lang].sol, "lösningsförslag")}</details>` : ""}
      ${mode !== "review" ? `<p class="runner-note">${NATIVE ? "Koden kompileras på din dator." : note}</p>` : ""}
    </div>`;
    const ta = $("textarea[id^='ed-']", el), gut = $(".gut", el);
    const syncGut = () => { const n = ta.value.split("\n").length; gut.textContent = Array.from({ length: n }, (_, i) => i + 1).join("\n"); ta.style.height = "auto"; ta.style.height = Math.max(220, ta.scrollHeight + 4) + "px"; };
    syncGut();
    $$("pre code", el).forEach(c => { try { window.hljs && hljs.highlightElement(c); } catch (e) {} });
    const gb = $('[data-act="gb"]', el);
    if (gb) gb.addEventListener("click", e => { e.currentTarget.href = godboltUrl(ta.value, ($("textarea[id^='in-']", el) || {}).value || ex.in, lang); });
    if (mode === "review") return;
    // Byt språk: koden i varje språk sparas i a.codes så att inget försvinner när du byter fram och tillbaka.
    $$("[data-lang]", el).forEach(b => b.addEventListener("click", () => {
      const to = b.dataset.lang;
      if (to === lang) return;
      const codes = Object.assign({}, a && a.codes, { [lang]: ta.value });
      a = { lang: to, v: codes[to] !== undefined ? codes[to] : starterOf(q, to), codes };
      state.prefs.lang = to; save();
      emit(); renderCode();
    }));
    ta.addEventListener("input", () => { a = Object.assign({}, a, { v: ta.value, lang }); delete a.res; delete a.ok; syncGut(); emit(); });
    ta.addEventListener("keydown", e => {
      if (e.key === "Tab" && !e.shiftKey) { e.preventDefault(); ta.setRangeText("    ", ta.selectionStart, ta.selectionEnd, "end"); ta.dispatchEvent(new Event("input")); }
      else if (e.key === "Enter") {
        const before = ta.value.slice(0, ta.selectionStart);
        const line = before.slice(before.lastIndexOf("\n") + 1);
        let ind = (line.match(/^\s*/) || [""])[0];
        if (/\{\s*$/.test(line) || (lang === "py" && /:\s*$/.test(line))) ind += "    ";
        e.preventDefault(); ta.setRangeText("\n" + ind, ta.selectionStart, ta.selectionEnd, "end"); ta.dispatchEvent(new Event("input"));
      }
    });
    $('[data-act="reset"]', el).addEventListener("click", () => {
      const codes = Object.assign({}, a && a.codes); delete codes[lang];
      a = { lang, v: starterOf(q, lang), codes }; emit(); renderCode();
    });
    if (blocked) return;
    const outEl = $("[data-out]", el), st = $("[data-st]", el);
    $('[data-act="run"]', el).addEventListener("click", async () => {
      outEl.innerHTML = `<span class="dim">${lang === "py" && !pyWorker ? "Laddar Python…" : "Kör…"}</span>`;
      const r = await runCode(lang, ta.value, $("textarea[id^='in-']", el).value);
      outEl.innerHTML = (r.out ? esc(r.out) : "") + (r.ok ? (r.out ? "" : '<span class="dim">(ingen utdata)</span>') : `<span class="err">${r.out ? "\n" : ""}${esc(explainError(r.error))}</span>`);
    });
    const tb = $('[data-act="test"]', el);
    if (tb) tb.addEventListener("click", async () => {
      st.textContent = lang === "py" && !pyWorker ? "Laddar Python…" : "Kör testerna…"; st.className = "status";
      const r = await runTests(q, ta.value, lang);
      a = Object.assign({}, a, { v: ta.value, lang, res: r, ok: r.every(x => x.pass), checked: true });
      emit(); renderCode();
      const s2 = $("[data-st]", el); const p = r.filter(x => x.pass).length;
      s2.textContent = `${p} av ${r.length} tester godkända`; s2.className = "status " + (p === r.length ? "r" : "w");
    });
  }
  if (q.t === "mc" || q.t === "multi") renderChoice();
  else if (q.t === "text") renderText();
  else renderCode();
}
function testsHtml(res) {
  return res.map((r, i) => `<div class="test ${r.pass ? "pass" : "fail"}"><span class="tag">${r.pass ? "OK" : "FEL"}</span><div>Test ${i + 1}: indata <code>${esc(r.in.replace(/\n/g, " ⏎ "))}</code>${r.pass ? "" : `<pre>Förväntat:\n${esc(r.want)}\n\nFick:\n${esc(r.got || "")}${r.error ? "\n" + esc(explainError(r.error)) : ""}</pre>`}</div></div>`).join("");
}
