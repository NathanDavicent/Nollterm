/* ================================================================ exam */
let examTimer = null;
let examResultIdx = null;   // index into history to show, or null for setup
let examConfirm = false;

function examPrefs(c) {
  const p = state.prefs[c.id] || {};
  return {
    lessons: (p.lessons && p.lessons.length ? p.lessons : c.lessons.map(l => l.id)).filter(id => lessonIdx(c, id) >= 0),
    types: p.types && p.types.length ? p.types : ["mc", "multi", "text", "code"],
    count: p.count || 15,
    time: p.time === undefined ? 0 : p.time,
  };
}
function eligible(c, pr) {
  const out = [];
  pr.lessons.forEach(lid => { const l = c.lessons[lessonIdx(c, lid)]; l.pool.forEach((q, i) => { if (pr.types.includes(q.t) && usable(q)) out.push({ l: lid, i }); }); });
  return out;
}
function drawItems(c, pr) {
  const byL = {};
  eligible(c, pr).forEach(x => (byL[x.l] = byL[x.l] || []).push(x));
  Object.keys(byL).forEach(k => (byL[k] = shuffle(byL[k])));
  const total = Object.values(byL).reduce((n, a) => n + a.length, 0);
  const want = pr.count === "all" ? total : Math.min(pr.count, total);
  const picked = []; let keys = shuffle(Object.keys(byL));
  while (picked.length < want && keys.length) {
    keys = keys.filter(k => byL[k].length);
    for (const k of keys) { if (picked.length >= want) break; picked.push(byL[k].pop()); }
  }
  return shuffle(picked).map(x => { const q = qOf(c, x); return Object.assign(x, q.o ? { perm: shuffle(q.o.map((_, i) => i)) } : {}); });
}
const qOf = (c, it) => c.lessons[lessonIdx(c, it.l)].pool[it.i];
function startExam(c, items, pr) {
  state.run[c.id] = { items, ans: {}, flags: {}, cur: 0, start: Date.now(), limit: pr.time || 0, label: pr.label || "" };
  examResultIdx = null; examConfirm = false; save();
  renderExam(c);
  window.scrollTo(0, 0);
}

function viewExamShell(c) { return `${courseHead(c, "exam")}<div id="exam"></div>`; }
function renderExam(c) {
  clearInterval(examTimer);
  const box = $("#exam"); if (!box) return;
  const run = state.run[c.id];
  if (run) return renderRun(c, box, run);
  if (examResultIdx !== null && (state.exams[c.id] || [])[examResultIdx]) return renderResult(c, box, state.exams[c.id][examResultIdx]);
  renderSetup(c, box);
}

/* ---------------- setup */
function renderSetup(c, box) {
  const pr = examPrefs(c);
  const hist = state.exams[c.id] || [];
  const pool = eligible(c, pr);
  const n = pr.count === "all" ? pool.length : Math.min(pr.count, pool.length);
  box.innerHTML = `
  <header class="thead" style="border:0;padding-bottom:6px"><div class="eyebrow">Prov · ${esc(c.short)}</div><h1>Slumpat prov med rättning.</h1>
  <p class="lead">Välj lektioner och frågetyper. Frågorna dras slumpvis och jämnt fördelat från poolen, och du får inget facit förrän du lämnat in.</p></header>
  <div class="exam-setup">
    <form class="panel" id="exform">
      <fieldset class="fieldset"><legend>Lektioner</legend>
        <div class="checkgrid">${c.lessons.map((l, i) => { const cnt = l.pool.filter(q => pr.types.includes(q.t) && usable(q)).length; return `<label><input type="checkbox" id="exl-${l.id}" name="l" value="${l.id}" ${pr.lessons.includes(l.id) ? "checked" : ""}><span>${nn(i)} ${esc(l.title)}</span><small>${cnt}</small></label>`; }).join("")}</div>
        <div class="linkbtns"><button type="button" data-all="1">Välj alla</button><button type="button" data-all="0">Välj inga</button></div>
      </fieldset>
      <fieldset class="fieldset"><legend>Frågetyper</legend>
        <div class="pills">${["mc", "multi", "text", "code"].map(t => `<label><input type="checkbox" id="ext-${t}" name="t" value="${t}" ${pr.types.includes(t) ? "checked" : ""}><span>${TYPE_LABEL[t]}${t === "code" ? " (2 p)" : ""}</span></label>`).join("")}</div>
      </fieldset>
      <fieldset class="fieldset"><legend>Antal frågor</legend>
        <div class="pills">${[10, 15, 20, 30, "all"].map(v => `<label><input type="radio" id="exc-${v}" name="c" value="${v}" ${String(pr.count) === String(v) ? "checked" : ""}><span>${v === "all" ? "Alla" : v}</span></label>`).join("")}</div>
      </fieldset>
      <fieldset class="fieldset"><legend>Tidsgräns</legend>
        <div class="pills">${[0, 10, 20, 30, 45, 60].map(v => `<label><input type="radio" id="exm-${v}" name="m" value="${v}" ${pr.time === v ? "checked" : ""}><span>${v ? v + " min" : "Ingen"}</span></label>`).join("")}</div>
      </fieldset>
      <p class="poolinfo"><b>${pool.length}</b> frågor matchar. Provet drar <b>${n}</b> av dem.${(() => { const g = c.lessons.reduce((k, l) => k + l.pool.filter(q => q.gpp && !NATIVE && pr.types.includes(q.t)).length, 0); return g ? ` <br>${g} kodfrågor kräver g++ och är bara med i <a href="#app">desktop-appen</a>.` : ""; })()}</p>
      <button class="btn primary" type="submit" ${n ? "" : "disabled"}>Starta provet →</button>
    </form>
    <div>
      <div class="panel"><h3>Så rättas provet</h3>
        <ul style="margin:0;padding-left:20px;font-size:.92rem">
          <li>Flerval, flera rätt och fritext: 1 poäng. Flera rätt kräver exakt rätt kombination.</li>
          <li>Kodfrågor: 2 poäng om alla dolda tester går igenom.</li>
          <li>Fritext rättas utan hänsyn till stora/små bokstäver och mellanslag.</li>
        </ul>
        <div class="grade" style="margin-top:12px;grid-template-columns:repeat(3,minmax(0,1fr))"><div><b>IG</b>under 50 %</div><div><b>G</b>från 50 %</div><div><b>VG</b>från 75 %</div></div>
        <p style="font-size:.8rem;color:var(--muted);margin:10px 0 0">Gränserna är satta för självtest, inte av läraren.</p>
      </div>
      <div class="panel"><h3>Tidigare prov</h3>
        ${hist.length ? `<div class="tablewrap" style="margin:0"><table class="hist"><thead><tr><th>Datum</th><th>Poäng</th><th>Betyg</th><th></th></tr></thead><tbody>
        ${hist.map((h, i) => `<tr><td>${esc(fmtDate(h.ts))}</td><td>${h.pts}/${h.max} · ${h.pct}%</td><td><span class="gbadge ${h.grade}">${h.grade}</span></td><td><button type="button" class="chip" data-view="${i}">Visa</button></td></tr>`).join("")}
        </tbody></table></div>` : `<p style="margin:0;color:var(--muted);font-size:.92rem">Inga prov än. Ditt första resultat hamnar här.</p>`}
      </div>
    </div>
  </div>`;
  const form = $("#exform", box);
  const read = () => {
    const fd = new FormData(form);
    const cv = fd.get("c");
    state.prefs[c.id] = { lessons: fd.getAll("l"), types: fd.getAll("t"), count: cv === "all" ? "all" : +cv, time: +fd.get("m") };
    save();
  };
  form.addEventListener("change", () => { read(); renderSetup(c, box); });
  $$("[data-all]", box).forEach(b => b.addEventListener("click", () => {
    $$('input[name="l"]', form).forEach(x => (x.checked = b.dataset.all === "1")); read(); renderSetup(c, box);
  }));
  form.addEventListener("submit", e => { e.preventDefault(); read(); const p = examPrefs(c); startExam(c, drawItems(c, p), p); });
  $$("[data-view]", box).forEach(b => b.addEventListener("click", () => { examResultIdx = +b.dataset.view; renderExam(c); window.scrollTo(0, 0); }));
}

/* ---------------- running */
function renderRun(c, box, run) {
  const N = run.items.length;
  const it = run.items[run.cur], q = qOf(c, it);
  const answered = run.items.filter((x, i) => isAnswered(qOf(c, x), run.ans[i])).length;
  box.innerHTML = `
  <div class="exambar">
    <div class="row1"><b>Prov${run.label ? " · " + esc(run.label) : ""} · fråga ${run.cur + 1} av ${N}</b><span style="display:flex;gap:10px;align-items:center"><span style="font-size:.85rem;color:var(--muted)">${answered}/${N} besvarade</span><span class="timer" id="timer"></span></span></div>
    <div class="qnav" role="group" aria-label="Hoppa till fråga">${run.items.map((x, i) => `<button type="button" data-go="${i}" class="${i === run.cur ? "cur" : ""} ${isAnswered(qOf(c, x), run.ans[i]) ? "ans" : ""} ${run.flags[i] ? "flag" : ""}" aria-label="Fråga ${i + 1}">${i + 1}</button>`).join("")}</div>
  </div>
  <div id="exq"></div>
  <div class="exnav">
    <div class="grp"><button type="button" class="btn" data-nav="-1" ${run.cur === 0 ? "disabled" : ""}>← Föregående</button><button type="button" class="btn" data-flag>${run.flags[run.cur] ? "Ta bort markering" : "Markera för senare"}</button></div>
    <div class="grp">${run.cur < N - 1 ? `<button type="button" class="btn" data-nav="1">Nästa →</button>` : ""}<button type="button" class="btn primary" data-submit>Lämna in</button></div>
  </div>
  <div id="confirm"></div>
  <p style="margin-top:22px"><button type="button" class="chip" data-abort>Avbryt provet utan att spara</button></p>`;
  mountQuestion($("#exq", box), q, {
    mode: "exam", n: run.cur + 1, total: N, uid: "ex" + run.cur, perm: it.perm,
    from: "Lektion " + nn(lessonIdx(c, it.l)), ans: run.ans[run.cur],
    onAnswer: a => {
      run.ans[run.cur] = a; save();
      const b = $(`[data-go="${run.cur}"]`, box); if (b) b.classList.toggle("ans", isAnswered(q, a));
      const cnt = run.items.filter((x, i) => isAnswered(qOf(c, x), run.ans[i])).length;
      $(".row1 span span", box).textContent = `${cnt}/${N} besvarade`;
    },
  });
  const go = i => { run.cur = i; examConfirm = false; save(); renderRun(c, box, run); };
  $$("[data-go]", box).forEach(b => b.addEventListener("click", () => go(+b.dataset.go)));
  $$("[data-nav]", box).forEach(b => b.addEventListener("click", () => go(run.cur + +b.dataset.nav)));
  $("[data-flag]", box).addEventListener("click", () => { run.flags[run.cur] = !run.flags[run.cur]; save(); renderRun(c, box, run); });
  $("[data-abort]", box).addEventListener("click", () => {
    $("#confirm", box).innerHTML = `<div class="confirm"><p>Avbryta provet? Dina svar sparas inte.</p><button type="button" class="btn" data-no>Fortsätt provet</button><button type="button" class="btn primary" data-yes>Avbryt provet</button></div>`;
    $("[data-no]", box).addEventListener("click", () => ($("#confirm", box).innerHTML = ""));
    $("[data-yes]", box).addEventListener("click", () => { delete state.run[c.id]; save(); renderExam(c); });
  });
  const showConfirm = () => {
    const left = N - run.items.filter((x, i) => isAnswered(qOf(c, x), run.ans[i])).length;
    const flagged = Object.values(run.flags).filter(Boolean).length;
    $("#confirm", box).innerHTML = `<div class="confirm"><p><b>Lämna in provet?</b> ${left ? `${left} fråg${left === 1 ? "a" : "or"} är obesvarad${left === 1 ? "" : "e"}.` : "Alla frågor är besvarade."}${flagged ? ` ${flagged} är markerad${flagged === 1 ? "" : "e"} för senare.` : ""}</p><button type="button" class="btn" data-no>Fortsätt skriva</button><button type="button" class="btn primary" data-yes>Lämna in</button></div>`;
    $("[data-no]", box).addEventListener("click", () => { examConfirm = false; $("#confirm", box).innerHTML = ""; });
    $("[data-yes]", box).addEventListener("click", () => submitExam(c));
    $("#confirm", box).scrollIntoView({ behavior: "smooth", block: "nearest" });
  };
  $("[data-submit]", box).addEventListener("click", () => { examConfirm = true; showConfirm(); });
  if (examConfirm) showConfirm();
  const tick = () => {
    const el = $("#timer"); if (!el) return clearInterval(examTimer);
    const elapsed = Math.floor((Date.now() - run.start) / 1000);
    if (run.limit) {
      const left = run.limit * 60 - elapsed;
      if (left <= 0) { clearInterval(examTimer); submitExam(c, true); return; }
      el.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")} kvar`;
      el.classList.toggle("low", left <= 60);
    } else el.textContent = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`;
  };
  tick(); clearInterval(examTimer); examTimer = setInterval(tick, 1000);
}

async function submitExam(c, timeout) {
  clearInterval(examTimer);
  const run = state.run[c.id]; if (!run) return;
  const box = $("#exam");
  if (box) box.innerHTML = `<div class="panel" style="margin-top:20px"><h3>${timeout ? "Tiden är ute. " : ""}Rättar provet…</h3><p style="margin:0;color:var(--muted)" id="gprog">Kodfrågorna körs mot dolda tester.</p></div>`;
  const per = [];
  for (let i = 0; i < run.items.length; i++) {
    const it = run.items[i], q = qOf(c, it);
    let a = run.ans[i] ? JSON.parse(JSON.stringify(run.ans[i])) : null;
    let ok = false;
    if (q.t === "code") {
      if (a && isAnswered(q, a)) {
        const p = $("#gprog"); if (p) p.textContent = `Kör tester för fråga ${i + 1}…`;
        const r = await runTests(q, a.v);
        ok = r.every(x => x.pass); a = Object.assign(a, { res: r, ok });
      }
    } else ok = gradeSync(q, a);
    per.push({ l: it.l, i: it.i, perm: it.perm, ans: a, ok, pts: ok ? TYPE_POINTS[q.t] : 0, max: TYPE_POINTS[q.t] });
  }
  const pts = per.reduce((n, x) => n + x.pts, 0), max = per.reduce((n, x) => n + x.max, 0);
  const pct = max ? Math.round(pts / max * 100) : 0;
  const res = { ts: Date.now(), secs: Math.round((Date.now() - run.start) / 1000), pts, max, pct, grade: gradeOf(pct), per, label: run.label };
  state.exams[c.id] = [res, ...(state.exams[c.id] || [])].slice(0, 15);
  delete state.run[c.id];
  examResultIdx = 0; save();
  renderChrome({ view: "exam", course: c });
  renderExam(c); window.scrollTo(0, 0);
}

/* ---------------- result */
let reviewOnlyWrong = false;
function renderResult(c, box, r) {
  const right = r.per.filter(x => x.ok).length;
  const byL = {}, byT = {};
  r.per.forEach(x => {
    const q = qOf(c, x);
    (byL[x.l] = byL[x.l] || { p: 0, m: 0 }); byL[x.l].p += x.pts; byL[x.l].m += x.max;
    (byT[q.t] = byT[q.t] || { p: 0, m: 0 }); byT[q.t].p += x.pts; byT[q.t].m += x.max;
  });
  const bar = (p, m) => { const v = m ? p / m * 100 : 0; return `<span class="mini-bar"><i class="${v < 50 ? "lowv" : v < 75 ? "midv" : ""}" style="width:${v}%"></i></span>`; };
  const R = 52, C = 2 * Math.PI * R, off = C * (1 - r.pct / 100);
  const missed = r.per.filter(x => !x.ok);
  const weakest = Object.entries(byL).filter(([, v]) => v.m && v.p / v.m < .5).sort((a, b) => (a[1].p / a[1].m) - (b[1].p / b[1].m) || b[1].m - a[1].m).slice(0, 4).map(([k]) => k);
  box.innerHTML = `
  <div class="result-hero">
    <svg class="ring" viewBox="0 0 130 130" role="img" aria-label="${r.pct} procent">
      <circle cx="65" cy="65" r="${R}" fill="none" stroke="var(--line)" stroke-width="12"></circle>
      <circle cx="65" cy="65" r="${R}" fill="none" stroke="${r.grade === "IG" ? "var(--bad)" : r.grade === "G" ? "var(--mask)" : "var(--ok)"}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${off}" transform="rotate(-90 65 65)"></circle>
      <text x="65" y="62" text-anchor="middle" font-size="28" fill="var(--ink)">${r.pct}%</text>
      <text x="65" y="86" text-anchor="middle" font-size="15" fill="var(--muted)">${r.grade}</text>
    </svg>
    <div>
      <div class="eyebrow">Resultat · ${esc(fmtDate(r.ts))}${r.label ? " · " + esc(r.label) : ""}</div>
      <h2>${r.grade === "VG" ? "Väl godkänt." : r.grade === "G" ? "Godkänt." : "Inte godkänt än."} ${r.pts} av ${r.max} poäng.</h2>
      <p>${right} av ${r.per.length} frågor rätt på ${Math.floor(r.secs / 60)} min ${r.secs % 60} s.</p>
      ${weakest.length ? `<p>Repetera: ${weakest.map(id => `<a href="#${c.id}-${id}">${esc(c.lessons[lessonIdx(c, id)].title)}</a>`).join(", ")}.</p>` : ""}
      <div class="cta" style="margin-top:12px">
        <button type="button" class="btn primary" data-again>Nytt prov</button>
        ${missed.length ? `<button type="button" class="btn" data-missed>Öva på de ${missed.length} du missade</button>` : ""}
        <button type="button" class="btn" data-setup>Inställningar och historik</button>
      </div>
    </div>
  </div>
  <div class="exam-setup">
    <div class="panel"><h3>Per lektion</h3><div class="breakdown">${Object.entries(byL).map(([lid, v]) => `<div class="brow"><span>${nn(lessonIdx(c, lid))} ${esc(c.lessons[lessonIdx(c, lid)].title)}</span>${bar(v.p, v.m)}<span>${v.p}/${v.m}</span></div>`).join("")}</div></div>
    <div class="panel"><h3>Per frågetyp</h3><div class="breakdown">${Object.entries(byT).map(([t, v]) => `<div class="brow"><span>${TYPE_LABEL[t]}</span>${bar(v.p, v.m)}<span>${v.p}/${v.m}</span></div>`).join("")}</div></div>
  </div>
  <div class="review-head"><h3>Genomgång</h3><div class="pfilter" style="margin:0"><button type="button" data-rf="0" aria-pressed="${!reviewOnlyWrong}">Alla · ${r.per.length}</button><button type="button" data-rf="1" aria-pressed="${reviewOnlyWrong}">Bara fel · ${missed.length}</button></div></div>
  <div id="review"></div>`;
  const rv = $("#review", box);
  r.per.forEach((x, i) => {
    if (reviewOnlyWrong && x.ok) return;
    const q = qOf(c, x);
    const el = document.createElement("div"); rv.appendChild(el);
    mountQuestion(el, q, { mode: "review", n: i + 1, total: r.per.length, uid: "rv" + i, perm: x.perm, from: "Lektion " + nn(lessonIdx(c, x.l)), ans: x.ans || (q.t === "code" ? { v: q.starter, res: null } : null) });
    if (!x.ans || !isAnswered(q, x.ans)) el.querySelector(".q").insertAdjacentHTML("beforeend", `<p class="yours"><b>Obesvarad.</b></p>`);
    else if (q.t === "code" && !x.ans.res) el.querySelector(".q").insertAdjacentHTML("beforeend", `<p class="yours">Koden rättades inte.</p>`);
    if (q.t === "code" && x.ans && x.ans.res) el.querySelector("[data-tests]").innerHTML = testsHtml(x.ans.res);
  });
  $$("[data-rf]", box).forEach(b => b.addEventListener("click", () => { reviewOnlyWrong = b.dataset.rf === "1"; renderResult(c, box, r); }));
  $("[data-again]", box).addEventListener("click", () => { const p = examPrefs(c); startExam(c, drawItems(c, p), p); });
  const mb = $("[data-missed]", box);
  if (mb) mb.addEventListener("click", () => startExam(c, shuffle(missed.map(x => { const q = qOf(c, x); return Object.assign({ l: x.l, i: x.i }, q.o ? { perm: shuffle(q.o.map((_, k) => k)) } : {}); })), { time: 0, label: "missade frågor" }));
  $("[data-setup]", box).addEventListener("click", () => { examResultIdx = null; renderExam(c); window.scrollTo(0, 0); });
}
