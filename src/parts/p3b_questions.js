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
/* In the desktop app, preload exposes window.nollterm with a real g++ bridge. */
const NATIVE = !!(window.nollterm && typeof window.nollterm.run === "function");
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
async function runTests(q, code) {
  const out = [];
  for (const t of q.tests) {
    const r = await runCpp(code, t.in);
    out.push({ in: t.in, want: t.out, got: r.out || "", error: r.ok ? null : r.error, pass: r.ok && normOut(r.out) === normOut(t.out) });
    if (!r.ok && (r.compile || /Tidsgränsen|inte tillgänglig|kunde inte laddas/.test(r.error || ""))) { while (out.length < q.tests.length) out.push({ in: q.tests[out.length].in, want: q.tests[out.length].out, got: "", error: "Hoppades över", pass: false }); break; }
  }
  return out;
}
function godboltUrl(code, stdin) {
  const state = { sessions: [{ id: 1, language: "c++", source: code, compilers: [{ id: "g132", options: "-Wall" }], executors: [{ compiler: { id: "g132", libs: [], options: "" }, stdin: stdin || "", stdinVisible: true }] }] };
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
const usable = q => !(q.gpp && !NATIVE);
const isAnswered = (q, a) => !!a && (q.t === "multi" ? (a.v || []).length > 0 : q.t === "text" ? String(a.v || "").trim() !== "" : q.t === "code" ? !!a.v && a.v !== q.starter : a.v !== undefined);

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
    const blocked = q.gpp && !NATIVE;      // needs real g++: only in the desktop app
    const code = (a && a.v) || q.starter;
    const ex = q.tests[0];
    const res = a && a.res;
    const ok = !!(a && a.ok);
    const showSol = mode === "review" || (mode === "practice" && (res || blocked));
    el.innerHTML = `<div class="q ${mode === "review" ? (ok ? "review-r" : "review-w") : ""}">${head()}
      <div class="example">Exempel: indata <pre>${esc(ex.in)}</pre> ger utdata <pre>${esc(ex.out)}</pre></div>
      <div class="editor">
        <div class="bar2"><span>main.cpp</span><span style="display:flex;gap:6px;flex-wrap:wrap">${mode !== "review" ? '<button type="button" data-act="reset">Återställ</button>' : ""}<a href="https://godbolt.org/" target="_blank" rel="noopener" data-act="gb">Öppna i Compiler Explorer ↗</a></span></div>
        <div class="ed"><div class="gut" aria-hidden="true"></div><textarea spellcheck="false" autocapitalize="off" autocomplete="off" id="ed-${o.uid}" aria-label="Kodredigerare" ${mode === "review" ? "readonly" : ""}>${esc(code)}</textarea></div>
      </div>
      ${blocked && mode !== "review" ? `<div class="note warn" style="margin-top:10px"><span class="tag">g++</span><div><p>Den här uppgiften använder klasser, string eller smarta pekare och kräver riktig C++. Kör den i <a href="#app">desktop-appen</a>, eller öppna den i Compiler Explorer och jämför med lösningsförslaget.</p></div></div>` : ""}
      ${mode !== "review" && !blocked ? `<div class="ioarea"><div><label for="in-${o.uid}">Indata (stdin)</label><textarea id="in-${o.uid}" spellcheck="false">${esc(ex.in)}</textarea></div><div><label>Utdata</label><div class="term" data-out aria-live="polite"><span class="dim">Tryck Kör för att köra programmet.</span></div></div></div>
      <div class="qactions"><button type="button" class="btn" data-act="run">Kör ▶</button>${mode === "practice" ? '<button type="button" class="btn primary" data-act="test">Kör testerna</button>' : '<span class="status" style="color:var(--muted);font-weight:400">Dolda tester körs när du lämnar in.</span>'}<span class="status" data-st></span></div>` : ""}
      <div class="tests" data-tests>${res ? testsHtml(res) : ""}</div>
      ${res && mode !== "exam" ? whyBox(ok) : ""}
      ${showSol ? `<details class="sol" style="margin-top:10px"><summary style="cursor:pointer;color:var(--mask);font-weight:700;font-size:.9rem">Visa lösningsförslag</summary>${codeBlock("cpp", q.sol, "lösningsförslag")}</details>` : ""}
      <p class="runner-note">${NATIVE ? "Koden kompileras med g++ på din dator (desktop-appen)." : 'Koden körs i en C++-tolk i webbläsaren som stöder cout/cin, printf/scanf, funktioner, loopar, arrayer, pekare och C-strängar. För full C++: öppna i Compiler Explorer, eller använd <a href="#app">desktop-appen med g++</a>.'}</p>
    </div>`;
    const ta = $("textarea[id^='ed-']", el), gut = $(".gut", el);
    const syncGut = () => { const n = ta.value.split("\n").length; gut.textContent = Array.from({ length: n }, (_, i) => i + 1).join("\n"); ta.style.height = "auto"; ta.style.height = Math.max(220, ta.scrollHeight + 4) + "px"; };
    syncGut();
    $$("pre code", el).forEach(c => { try { window.hljs && hljs.highlightElement(c); } catch (e) {} });
    $('[data-act="gb"]', el).addEventListener("click", e => { e.currentTarget.href = godboltUrl(ta.value, ($("textarea[id^='in-']", el) || {}).value || ex.in); });
    if (mode === "review") return;
    ta.addEventListener("input", () => { a = Object.assign({}, a, { v: ta.value }); if (mode === "exam") delete a.ok; syncGut(); emit(); });
    ta.addEventListener("keydown", e => {
      if (e.key === "Tab" && !e.shiftKey) { e.preventDefault(); ta.setRangeText("    ", ta.selectionStart, ta.selectionEnd, "end"); ta.dispatchEvent(new Event("input")); }
      else if (e.key === "Enter") {
        const before = ta.value.slice(0, ta.selectionStart);
        const line = before.slice(before.lastIndexOf("\n") + 1);
        let ind = (line.match(/^\s*/) || [""])[0];
        if (/\{\s*$/.test(line)) ind += "    ";
        e.preventDefault(); ta.setRangeText("\n" + ind, ta.selectionStart, ta.selectionEnd, "end"); ta.dispatchEvent(new Event("input"));
      }
    });
    $('[data-act="reset"]', el).addEventListener("click", () => { a = null; emit(); renderCode(); });
    if (blocked) return;
    const outEl = $("[data-out]", el), st = $("[data-st]", el);
    $('[data-act="run"]', el).addEventListener("click", async () => {
      outEl.innerHTML = '<span class="dim">Kör…</span>';
      const r = await runCpp(ta.value, $("textarea[id^='in-']", el).value);
      outEl.innerHTML = (r.out ? esc(r.out) : "") + (r.ok ? (r.out ? "" : '<span class="dim">(ingen utdata)</span>') : `<span class="err">${r.out ? "\n" : ""}${esc(explainError(r.error))}</span>`);
    });
    const tb = $('[data-act="test"]', el);
    if (tb) tb.addEventListener("click", async () => {
      st.textContent = "Kör testerna…"; st.className = "status";
      const r = await runTests(q, ta.value);
      a = { v: ta.value, res: r, ok: r.every(x => x.pass), checked: true };
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
