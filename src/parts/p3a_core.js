/* ================================================================ courses */
const R = String.raw;
// CONTENT kommer från content/ (läggs in av src/build.mjs). Kurser med ett eget kort på startsidan
// listas i HERO_CARDS; övriga kurser får ett enkelt standardkort.
const HERO_CARDS = {
  cpp: () => {
      const cells = [..."C/C++", "\\0"].map((ch, i) => `<div><span class="cell ${ch === "\\0" ? "z" : ""}" style="animation-delay:${i * 90}ms">${esc(ch)}</span><span class="ad">…${(0x10 + i).toString(16)}</span></div>`).join("");
      return `<div class="memcard" aria-label="Exempel: en C-sträng i minnet">
        <div class="decl"><span class="k">char</span> kurs[] = <span class="s">"C/C++"</span>;</div>
        <div class="mem">${cells}</div>
        <div class="foot">sizeof(kurs) == 6, strlen(kurs) == 5.<br>Det sista tecknet, nolltecknet, gav sajten dess namn.</div></div>`;
    },
  oop: () => `<div class="memcard" aria-label="UML: Device med två subklasser">
        <div class="decl"><span class="k">for</span> (<span class="k">auto</span>&amp; d : devices) d-&gt;tick();</div>
        <div class="uml">
          <div class="ubox abs"><i>«abstract»</i><b>Device</b><span>+ tick() = 0</span></div>
          <div class="ulines" aria-hidden="true"><span></span></div>
          <div class="urow"><div class="ubox" style="animation-delay:.15s"><b>TempSensor</b><span>+ tick() override</span></div><div class="ubox" style="animation-delay:.3s"><b>LedActuator</b><span>+ tick() override</span></div></div>
        </div>
        <div class="foot">Samma anrop, olika beteende.<br>Polymorfism via en virtuell funktion i basklassen.</div></div>`,
};
const COURSES = CONTENT.map(c => Object.assign(c, {
  card: HERO_CARDS[c.id] || (() => `<div class="memcard"><div class="decl">${esc(c.badge)}</div><div class="foot">${c.lessons.length} lektioner.</div></div>`),
}));
const courseById = id => COURSES.find(c => c.id === id);
const lessonIdx = (c, id) => c.lessons.findIndex(l => l.id === id);
const TYPE_LABEL = { mc: "Flerval", multi: "Flera rätt", text: "Fritext", code: "Kod" };
const TYPE_POINTS = { mc: 1, multi: 1, text: 1, code: 2 };

/* ================================================================ state */
const STORE_KEY = "nollterm-v2";
const state = { done: {}, practice: {}, checks: {}, exams: {}, run: {}, prefs: {} };
try {
  const raw = localStorage.getItem(STORE_KEY);
  if (raw) Object.assign(state, JSON.parse(raw));
  else {
    const old = JSON.parse(localStorage.getItem("nollterm-cpp-v1") || "null");   // carry over v1 progress
    if (old) {
      state.done.cpp = old.done || [];
      Object.entries(old.checks || {}).forEach(([k, v]) => (state.checks["cpp:" + k] = v));
    }
  }
} catch (e) { /* storage unavailable: start fresh */ }
function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {} }
const doneList = cid => (state.done[cid] = state.done[cid] || []);
const isDone = (cid, lid) => doneList(cid).includes(lid);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const strip = s => String(s).replace(/<[^>]+>/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const nn = i => String(i + 1).padStart(2, "0");
const addr = (ti, si) => "0x" + ((ti + 1) * 0x100 + si * 0x10).toString(16).toUpperCase().padStart(4, "0");
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const fmtDate = ts => { try { return new Date(ts).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" }); } catch (e) { return ""; } };
const gradeOf = pct => pct >= 75 ? "VG" : pct >= 50 ? "G" : "IG";

function practiceStats(c, l) {
  const p = state.practice[c.id + ":" + l.id] || {};
  const right = Object.entries(p).filter(([i, a]) => a && a.ok && l.pool[i] && usable(l.pool[i])).length;
  return { right, total: l.pool.filter(usable).length };
}

/* ================================================================ chrome: top nav + sidebar */
function renderChrome(ctx) {
  const c = ctx.course;
  $("#topnav").innerHTML = `<a href="#hem" ${ctx.view === "home" ? 'aria-current="page"' : ""}>Kurser</a>` +
    (c ? `<a href="#${c.id}" ${ctx.view === "course" || ctx.view === "lesson" ? 'aria-current="page"' : ""}>${esc(c.short)}</a><a href="#${c.id}-prov" ${ctx.view === "exam" ? 'aria-current="page"' : ""}>Prov</a>` : "") +
    `<a href="#lab" ${ctx.view === "lab" ? 'aria-current="page"' : ""}>Kodlabb</a><a href="#app" ${ctx.view === "app" ? 'aria-current="page"' : ""}>${NATIVE ? "g++ ✓" : "App"}</a>`;
  const side = $("#side");
  if (!c) {
    side.innerHTML = `<p class="ctitle">Dina kurser</p><div class="tabs">${COURSES.map(x => `<a href="#${x.id}"><b>${esc(x.title)}</b><span>${x.lessons.length} lekt.</span></a>`).join("")}</div>
      <div class="tabs"><a href="#lab" ${ctx.view === "lab" ? 'aria-current="page"' : ""}>Kodlabb <span>${NATIVE ? "g++" : "tolk"}</span></a><a href="#app" ${ctx.view === "app" ? 'aria-current="page"' : ""}>Appen <span>ladda ner</span></a></div>
      <div class="journey"><strong>Fler kurser</strong><p style="margin-top:6px">Skicka materialet från nästa kurs så byggs den in här på samma sätt.</p></div>`;
    return;
  }
  const d = doneList(c.id).filter(id => lessonIdx(c, id) >= 0).length;
  const qcount = c.lessons.reduce((n, l) => n + l.pool.length, 0);
  const grouped = c.timeline.map(g => ({ g, ls: g.topics.filter(id => lessonIdx(c, id) >= 0) }));
  const used = new Set(grouped.flatMap(x => x.ls));
  const rest = c.lessons.filter(l => !used.has(l.id)).map(l => l.id);
  side.innerHTML = `
    <a class="back" href="#hem">← Alla kurser</a>
    <p class="ctitle">${esc(c.title)}</p>
    <nav class="tabs" aria-label="Kursens delar">
      <a href="#${c.id}" ${ctx.view === "course" ? 'aria-current="page"' : ""}>Lektioner <span>${c.lessons.length}</span></a>
      <a href="#${c.id}-prov" ${ctx.view === "exam" ? 'aria-current="page"' : ""}>Prov <span>${qcount} frågor</span></a>
      <a href="#${c.id}-uppgifter" ${ctx.view === "assign" ? 'aria-current="page"' : ""}>Uppgifter <span>${c.assignments.length}</span></a>
      <a href="#${c.id}-resurser" ${ctx.view === "res" ? 'aria-current="page"' : ""}>Resurser <span>${c.sources.length}</span></a>
    </nav>
    <h2><span>Lektioner</span><span>${String(c.lessons.length).padStart(2, "0")}</span></h2>
    <ol class="toc">${c.lessons.map((l, i) => `
      <li><a href="#${c.id}-${l.id}" ${ctx.lesson === l.id ? 'aria-current="page"' : ""}>
        <span class="n">${nn(i)}</span><span>${esc(l.title)}</span><span class="ck ${isDone(c.id, l.id) ? "on" : ""}" title="${isDone(c.id, l.id) ? "Klar" : "Inte klar"}"></span>
      </a></li>`).join("")}</ol>
    <div class="journey">
      <strong>Din lärresa</strong>
      <div class="bar"><i style="width:${d / c.lessons.length * 100}%"></i></div>
      <p>${d === c.lessons.length ? `Alla ${c.lessons.length} lektioner klara.` : `${d} av ${c.lessons.length} lektioner klara.`}</p>
    </div>`;
  void rest;
}

/* ================================================================ home */
function viewHome() {
  const cards = COURSES.map(c => {
    const d = doneList(c.id).length, q = c.lessons.reduce((n, l) => n + l.pool.length, 0);
    const last = (state.exams[c.id] || [])[0];
    return `<a class="ccard" href="#${c.id}">
      <span class="code-badge">${esc(c.badge)}</span>
      <div><div class="eyebrow">${esc(c.tag)}</div><h3>${esc(c.title)}</h3></div>
      <p>${esc(c.desc)}</p>
      <div class="bar" style="margin:0"><i style="width:${d / c.lessons.length * 100}%"></i></div>
      <div class="meta"><span>${c.lessons.length} lektioner</span><span>${q} frågor</span><span>${d}/${c.lessons.length} klara</span>${last ? `<span>Senaste prov: ${last.grade} (${last.pct}%)</span>` : ""}</div>
    </a>`;
  }).join("");
  return `
  <section class="hero" style="grid-template-columns:minmax(0,1fr)">
    <div>
      <div class="eyebrow">Nollterm · din kursportal</div>
      <h1>Välj en kurs. Läs, öva, <em>testa dig</em>.</h1>
      <p class="lead">Varje kurs är uppdelad i lektioner med genomgång, kod du kan köra och frågor. Gör ett slumpat prov när du vill veta var du står.</p>
    </div>
  </section>
  <section class="block">
    <div class="eyebrow">Kurser</div>
    <h2>Dina kurser</h2>
    <p class="sub">Framsteg, övningssvar och provresultat sparas i den här webbläsaren.</p>
    <div class="courses">${cards}
      <div class="ccard add"><span class="code-badge">+</span><div><div class="eyebrow">Nästa kurs</div><h3>Lägg till en kurs</h3></div>
      <p>Har du material från en annan kurs? Skicka PDF:erna till Claude, så byggs kursen in här med lektioner, frågor och prov på samma sätt.</p></div>
    </div>
  </section>
  <section class="block">
    <div class="eyebrow">Verktyg</div>
    <h2>Skriv egen kod</h2>
    <p class="sub">${NATIVE ? "Du kör desktop-appen: all kod kompileras med g++ på din dator." : "På webben körs Python fullt ut och enklare C/C++ i en tolk. Datorappen för Windows har riktig gcc, g++ och Python."}</p>
    <div class="courses">
      <a class="ccard" href="#lab"><span class="code-badge">{ }</span><div><div class="eyebrow">${NATIVE ? "g++" : "Webbtolk"}</div><h3>Kodlabb</h3></div><p>Fri editor med flera filer, indata och utdata, i C++ eller Python. Prova exemplen eller skriv eget.</p></a>
      <a class="ccard" href="#app"><span class="code-badge">g++</span><div><div class="eyebrow">${NATIVE ? "Installerad" : "Windows och mobil"}</div><h3>${NATIVE ? "Om appen" : "Skaffa appen"}</h3></div><p>${NATIVE ? "Se vilken kompilator appen använder." : "Datorappen i C++ med inbyggd gcc, g++ och Python, och hur du installerar webbversionen på mobilen."}</p></a>
    </div>
  </section>`;
}

/* ================================================================ course */
function courseHead(c, cur) {
  return `<nav class="crumbs" aria-label="Brödsmulor"><a href="#hem">Kurser</a><span>/</span>${cur === "course" ? `<span>${esc(c.short)}</span>` : `<a href="#${c.id}">${esc(c.short)}</a>`}</nav>
  <nav class="ctabs" aria-label="Kursens delar">
    <a href="#${c.id}" ${cur === "course" ? 'aria-current="page"' : ""}>Lektioner</a>
    <a href="#${c.id}-prov" ${cur === "exam" ? 'aria-current="page"' : ""}>Prov</a>
    <a href="#${c.id}-uppgifter" ${cur === "assign" ? 'aria-current="page"' : ""}>Uppgifter</a>
    <a href="#${c.id}-resurser" ${cur === "res" ? 'aria-current="page"' : ""}>Resurser</a>
  </nav>`;
}
function lessonRow(c, l) {
  const i = lessonIdx(c, l.id), ps = practiceStats(c, l);
  return `<a class="lrow" href="#${c.id}-${l.id}">
    <span class="num">LEKTION<b>${nn(i)}</b></span>
    <div><h4>${esc(l.title)}</h4><p>${esc(l.lead)}</p></div>
    <div class="right">${isDone(c.id, l.id) ? '<span class="done-pill">klar</span>' : `<span>${l.min} min</span>`}
      <span>${ps.right}/${ps.total} rätt</span><span class="mini-bar"><i style="width:${ps.right / ps.total * 100}%"></i></span></div>
  </a>`;
}
function viewCourse(c) {
  const next = c.lessons.find(l => !isDone(c.id, l.id)) || c.lessons[0];
  const started = doneList(c.id).length > 0;
  const q = c.lessons.reduce((n, l) => n + l.pool.length, 0);
  const codeQ = c.lessons.reduce((n, l) => n + l.pool.filter(x => x.t === "code").length, 0);
  const used = new Set();
  const groups = c.timeline.map(g => {
    const ls = g.topics.filter(id => !used.has(id) && lessonIdx(c, id) >= 0);
    ls.forEach(id => used.add(id));
    return ls.length ? `<section class="lgroup"><header><span class="d">${esc(g.d)}</span><h3>${esc(g.t)}</h3></header><div class="lrows">${ls.map(id => lessonRow(c, c.lessons[lessonIdx(c, id)])).join("")}</div></section>` : "";
  }).join("");
  const rest = c.lessons.filter(l => !used.has(l.id));
  return `${courseHead(c, "course")}
  <section class="hero" style="padding-top:0">
    <div>
      <div class="eyebrow">${esc(c.title)} · ${esc(c.tag)}</div>
      <h1>${c.headline}</h1>
      <p class="lead">${esc(c.desc)}</p>
      <div class="cta">
        <a class="btn primary" href="#${c.id}-${next.id}">${started ? "Fortsätt" : "Börja"} med lektion ${nn(lessonIdx(c, next.id))} →</a>
        <a class="btn" href="#${c.id}-prov">Gör ett prov</a>
      </div>
    </div>
    ${c.card()}
    </section>
  <div class="stats">
    <div><b>${c.lessons.length}</b><span>lektioner</span></div>
    <div><b>${q}</b><span>frågor i poolen</span></div>
    <div><b>${codeQ}</b><span>kodfrågor att köra</span></div>
    <div><b>${c.assignments.length}</b><span>uppgifter</span></div>
  </div>
  <section class="block">
    <div class="eyebrow">Lektioner</div>
    <h2>Lektionerna, i kursens ordning.</h2>
    <p class="sub">Grupperade efter lektionstillfälle. Varje lektion har genomgång, övningar och frågor.</p>
    ${groups}
    ${rest.length ? `<section class="lgroup"><header><span class="d">Fler</span><h3>Övriga lektioner</h3></header><div class="lrows">${rest.map(l => lessonRow(c, l)).join("")}</div></section>` : ""}
  </section>`;
}

/* ================================================================ lesson */
function codeBlock(lang, src, cap) {
  const label = cap || (lang === "c" ? "C" : lang === "cpp" ? "C++" : lang === "bash" ? "terminal" : lang);
  return `<div class="codewrap"><div class="cap"><span>${esc(label)}</span><button class="copy" type="button">Kopiera</button></div><pre><code class="language-${lang === "c" ? "c" : lang === "bash" ? "bash" : "cpp"}">${esc(src)}</code></pre></div>`;
}
function renderBlocks(t, ti) {
  let si = 0, exn = 0;
  return t.blocks.map(b => {
    switch (b[0]) {
      case "h": si++; return `<h2 id="${t.id}-s${si}"><span class="addr">${addr(ti, si)}</span><span>${esc(b[1])}</span></h2>`;
      case "p": return `<p>${b[1]}</p>`;
      case "list": return `<ul>${b[1].map(x => `<li>${x}</li>`).join("")}</ul>`;
      case "code": return codeBlock(b[1], b[2], b[3]);
      case "table": return `<div class="tablewrap"><table><thead><tr>${b[1].map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${b[2].map(r => `<tr>${r.map((cell, ci) => ci === 0 && b[1][0] === "" ? `<th scope="row" style="background:transparent;text-transform:none;letter-spacing:0;font-family:var(--f-body);font-size:.9rem;color:var(--ink)">${cell}</th>` : `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
      case "note": return `<div class="note ${b[1]}"><span class="tag">${b[1] === "tip" ? "Tips" : b[1] === "warn" ? "Se upp" : "Felsök"}</span><div><p>${b[2]}</p></div></div>`;
      case "widget": return `<div class="widget" data-widget="${b[1]}"></div>`;
      case "ex": exn++; return `<details class="ex"><summary><span class="n">ÖVN ${String(exn).padStart(2, "0")}</span><b>${esc(b[1])}</b><span class="chev">›</span></summary><div class="body">${b[2]}${b[3] ? `<details class="sol"><summary>Visa ett lösningsförslag</summary>${codeBlock(b[4] || "cpp", b[3], "lösningsförslag")}</details>` : ""}</div></details>`;
    }
    return "";
  }).join("");
}
let practiceFilter = "alla";
function viewLesson(c, id) {
  const ti = lessonIdx(c, id), t = c.lessons[ti];
  const prev = c.lessons[ti - 1], next = c.lessons[ti + 1];
  return `
  <nav class="crumbs" aria-label="Brödsmulor"><a href="#hem">Kurser</a><span>/</span><a href="#${c.id}">${esc(c.short)}</a><span>/</span><span>Lektion ${nn(ti)}</span></nav>
  <header class="thead">
    <div class="eyebrow">Lektion ${nn(ti)} · ${esc(t.cat)}</div>
    <h1>${esc(t.title)}</h1>
    <p class="lead">${esc(t.lead)}</p>
    <div class="meta"><span>≈ ${t.min} min</span><span>${t.pool.length} frågor</span>${t.date ? `<span>Lektionstillfälle ${esc(t.date)}</span>` : ""}<span>Källa: ${t.src.map(esc).join(" · ")}</span></div>
  </header>
  <div class="article">
    <section class="goals"><h2>Efter lektionen kan du</h2><ul>${t.goals.map(g => `<li>${g}</li>`).join("")}</ul></section>
    ${renderBlocks(t, ti)}
  </div>
  <section class="quiz" id="quiz"></section>
  <div class="complete" id="complete"></div>
  <nav class="pager" aria-label="Föregående och nästa lektion">
    ${prev ? `<a href="#${c.id}-${prev.id}"><small>← Lektion ${nn(ti - 1)}</small><b>${esc(prev.title)}</b></a>` : "<span></span>"}
    ${next ? `<a class="next" href="#${c.id}-${next.id}"><small>Lektion ${nn(ti + 1)} →</small><b>${esc(next.title)}</b></a>` : `<a class="next" href="#${c.id}-prov"><small>Nästa →</small><b>Gör ett prov på hela kursen</b></a>`}
  </nav>`;
}
function renderPractice(c, t) {
  const key = c.id + ":" + t.id;
  const store = (state.practice[key] = state.practice[key] || {});
  const counts = { alla: t.pool.length };
  t.pool.forEach(q => (counts[q.t] = (counts[q.t] || 0) + 1));
  const ps = practiceStats(c, t);
  const list = t.pool.map((q, qi) => ({ q, qi })).filter(x => practiceFilter === "alla" || x.q.t === practiceFilter);
  const box = $("#quiz");
  box.innerHTML = `<h2>Testa din förståelse</h2>
    <p>${t.pool.length} frågor: flerval, flera rätt, fritext${counts.code ? " och kod du kör direkt i webbläsaren" : ""}. Svaren sparas.</p>
    <div class="pfilter" role="group" aria-label="Filtrera frågetyp">
      ${["alla", "mc", "multi", "text", "code"].filter(k => counts[k]).map(k => `<button type="button" data-f="${k}" aria-pressed="${practiceFilter === k}">${k === "alla" ? "Alla" : TYPE_LABEL[k]} · ${counts[k]}</button>`).join("")}
      <span class="score">${ps.right}/${ps.total} rätt</span>
    </div>
    <div id="qlist"></div>
    <div class="qscore"><b>${ps.right} av ${ps.total} rätt</b><span>Vill du testa dig på riktigt? Gör ett slumpat prov på den här lektionen.</span>
      <span style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" id="qreset">Nollställ svaren</button><button type="button" id="qexam">Prov på lektionen →</button></span></div>`;
  const ql = $("#qlist", box);
  list.forEach(({ q, qi }) => {
    const el = document.createElement("div");
    ql.appendChild(el);
    mountQuestion(el, q, {
      mode: "practice", n: qi + 1, total: t.pool.length, uid: t.id + "-" + qi,
      ans: store[qi],
      onAnswer: a => { store[qi] = a; save(); const s = practiceStats(c, t); $(".pfilter .score", box).textContent = `${s.right}/${s.total} rätt`; $(".qscore b", box).textContent = `${s.right} av ${s.total} rätt`; },
    });
  });
  $$(".pfilter button", box).forEach(b => b.addEventListener("click", () => { practiceFilter = b.dataset.f; renderPractice(c, t); }));
  $("#qreset", box).addEventListener("click", () => { state.practice[key] = {}; save(); renderPractice(c, t); });
  $("#qexam", box).addEventListener("click", () => { state.prefs[c.id] = Object.assign({}, state.prefs[c.id] || {}, { lessons: [t.id], count: 10 }); save(); location.hash = c.id + "-prov"; });
}
function completeInner(c, t) {
  return isDone(c.id, t.id)
    ? `<p><strong>Lektionen är markerad som klar.</strong> Det syns i din lärresa i sidomenyn.</p><button class="btn" id="donebtn" type="button">Ångra</button>`
    : `<p>Har du läst igenom lektionen och svarat på frågorna? Markera den som klar.</p><button class="btn primary" id="donebtn" type="button">Markera som klar</button>`;
}
function bindLesson(c, id) {
  const t = c.lessons[lessonIdx(c, id)];
  renderPractice(c, t);
  const bindDone = () => {
    $("#complete").innerHTML = completeInner(c, t);
    $("#donebtn").addEventListener("click", () => {
      const l = doneList(c.id);
      if (isDone(c.id, id)) state.done[c.id] = l.filter(x => x !== id); else l.push(id);
      save(); bindDone(); renderChrome({ view: "lesson", course: c, lesson: id });
    });
  };
  bindDone();
  $$("[data-widget]").forEach(w => WIDGETS[w.dataset.widget] && WIDGETS[w.dataset.widget](w));
}

/* ================================================================ assignments */
function viewAssign(c) {
  return `${courseHead(c, "assign")}
  <header class="thead"><div class="eyebrow">Uppgifter och inlämningar</div><h1>Bocka av kraven medan du bygger.</h1>
  <p class="lead">Alla uppgifter från materialet, uppdelade i krav du kan bocka av. Bockarna sparas i den här webbläsaren.</p></header>
  <div style="display:grid;gap:4px;margin-top:22px">
  ${c.assignments.map(a => {
    const keys = a.groups.flatMap((g, gi) => g.items.map((_, ii) => `${c.id}:${a.id}:${gi}:${ii}`));
    const doneN = keys.filter(k => state.checks[k]).length;
    return `<article class="assign" id="${a.id}">
      <div class="eyebrow">${esc(a.kind)} · <span data-count="${a.id}">${doneN}/${keys.length}</span> klara</div>
      <h2>${esc(a.title)}</h2>
      <div class="bar"><i data-bar="${a.id}" style="width:${doneN / keys.length * 100}%"></i></div>
      <p>${a.intro}</p>
      ${a.groups.map((g, gi) => `<h3>${esc(g.h)}</h3><ul class="checks">${g.items.map((it, ii) => { const k = `${c.id}:${a.id}:${gi}:${ii}`; return `<li><label><input type="checkbox" id="c-${k.replace(/:/g, "-")}" data-a="${a.id}" data-k="${k}" ${state.checks[k] ? "checked" : ""}><span>${it}</span></label></li>`; }).join("")}</ul>`).join("")}
      ${a.grade ? `<div class="grade">${a.grade.map(([g, d]) => `<div><b>${g}</b>${esc(d)}</div>`).join("")}</div>` : ""}
      ${a.hint ? `<div class="note tip" style="margin-top:14px"><span class="tag">Tips</span><div><p>${a.hint}</p></div></div>` : ""}
      <h3>Lektioner du behöver</h3><div style="display:flex;flex-wrap:wrap;gap:6px">${a.topics.map(id => `<a class="chip" href="#${c.id}-${id}">${nn(lessonIdx(c, id))} ${esc(c.lessons[lessonIdx(c, id)].title)}</a>`).join("")}</div>
    </article>`;
  }).join("")}
  </div>`;
}
function bindAssign() {
  $$(".checks input").forEach(cb => cb.addEventListener("change", () => {
    state.checks[cb.dataset.k] = cb.checked; save();
    const aid = cb.dataset.a;
    const all = $$(`.checks input[data-a="${aid}"]`);
    const n = all.filter(x => x.checked).length;
    $(`[data-count="${aid}"]`).textContent = `${n}/${all.length}`;
    $(`[data-bar="${aid}"]`).style.width = (n / all.length * 100) + "%";
  }));
}

/* ================================================================ resources */
function viewRes(c) {
  return `${courseHead(c, "res")}
  <header class="thead"><div class="eyebrow">Resursbibliotek</div><h1>Källorna bakom varje lektion.</h1>
  <p class="lead">Lektionerna är byggda från de här dokumenten från kursen. Gå tillbaka till originalet när du vill se lärarens exakta formuleringar.</p></header>
  <section class="block"><h2 style="font-size:1.3rem;margin-bottom:12px">Kursdokument</h2>
  <div class="reslist">${c.sources.map(s => `<div class="res"><span class="k">${esc(s.k)}</span><div><b>${esc(s.t)}</b><p>${esc(s.d)}</p><div class="chips">${s.topics.map(id => `<a class="chip" href="#${c.id}-${id}">${nn(lessonIdx(c, id))} ${esc(c.lessons[lessonIdx(c, id)].title)}</a>`).join("")}</div></div></div>`).join("")}</div></section>
  <section class="block"><h2 style="font-size:1.3rem;margin-bottom:12px">Läs vidare</h2>
  <div class="reslist">${c.links.map(l => `<div class="res"><span class="k">${esc(l.k)}</span><div><b><a href="${l.u}" target="_blank" rel="noopener">${esc(l.t)} ↗</a></b><p>${esc(l.d)}</p></div></div>`).join("")}</div></section>`;
}
