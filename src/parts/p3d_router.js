/* ================================================================ search */
const INDEX = [
  { href: "lab", title: "Kodlabb", sub: "Fri editor med flera filer", text: "kodlabb editor kod kör kompilera g++ sandlåda playground flera filer", w: 3 },
  { href: "app", title: "Appen", sub: "Desktop med g++, mobil", text: "app desktop windows ladda ner installera g++ kompilator mobil telefon offline", w: 3 },
];
COURSES.forEach(c => {
  INDEX.push({ href: c.id, title: c.title, sub: "Kurs", text: (c.title + " " + c.desc + " kurs").toLowerCase(), w: 4 });
  INDEX.push({ href: c.id + "-prov", title: "Prov: " + c.short, sub: "Slumpat prov med rättning", text: "prov tenta test slumpa betyg rättning quiz frågor " + c.short.toLowerCase(), w: 3 });
  INDEX.push({ href: c.id + "-uppgifter", title: "Uppgifter: " + c.short, sub: "Inlämningar och labbar", text: "uppgifter inlämning inlämningsuppgift datainsamlare gruppuppgift device manager labb miniräknare repetition betyg", w: 2 });
  INDEX.push({ href: c.id + "-resurser", title: "Resurser: " + c.short, sub: "Kursdokument och länkar", text: "resurser källor pdf cppreference github dokument", w: 1 });
  c.lessons.forEach((t, ti) => {
    const href = c.id + "-" + t.id;
    INDEX.push({ href, title: t.title, sub: `${c.short} · Lektion ${nn(ti)} · ${t.cat}`, text: (t.title + " " + t.lead + " " + t.cat).toLowerCase(), w: 3 });
    let si = 0, buf = "", curH = null;
    const flush = () => { if (curH) INDEX.push({ href, sec: `${t.id}-s${si}`, title: curH, sub: `${c.short} · Lektion ${nn(ti)} · ${t.title}`, text: (curH + " " + buf).toLowerCase(), w: 2 }); };
    t.blocks.forEach(b => {
      if (b[0] === "h") { flush(); si++; curH = b[1]; buf = ""; }
      else if (b[0] === "p" || b[0] === "note") buf += " " + strip(b[0] === "p" ? b[1] : b[2]);
      else if (b[0] === "list") buf += " " + strip(b[1].join(" "));
      else if (b[0] === "code") buf += " " + b[2];
      else if (b[0] === "table") buf += " " + strip(b[2].flat().join(" "));
      else if (b[0] === "ex") buf += " " + b[1] + " " + strip(b[2]);
    });
    flush();
  });
});

let sSel = 0;
function openSearch() { $("#scrim").hidden = false; $("#sq").value = ""; runSearch(); setTimeout(() => $("#sq").focus(), 10); }
function closeSearch() { $("#scrim").hidden = true; }
function runSearch() {
  const q = $("#sq").value.trim().toLowerCase();
  let hits;
  if (!q) hits = INDEX.filter(e => e.w >= 3 && !e.sec).slice(0, 14);
  else {
    const words = q.split(/\s+/);
    hits = INDEX.map(e => words.every(w => e.text.includes(w)) ? Object.assign({ s: e.w * 10 + (e.title.toLowerCase().includes(q) ? 20 : 0) }, e) : null)
      .filter(Boolean).sort((a, b) => b.s - a.s).slice(0, 12);
  }
  sSel = 0;
  $("#sres").innerHTML = hits.length ? hits.map((h, i) => `<a href="#${h.href}" data-sec="${h.sec || ""}" class="${i === 0 ? "act" : ""}"><b>${esc(h.title)}</b><small>${esc(h.sub)}</small></a>`).join("")
    : `<div class="empty">Inget matchade "${esc(q)}". Prova ett annat ord, t.ex. pekare, vector eller exception.</div>`;
}
let pendingSec = null;
$("#sres").addEventListener("click", e => {
  const a = e.target.closest("a"); if (!a) return;
  pendingSec = a.dataset.sec || null; closeSearch();
  if (location.hash === a.getAttribute("href")) { e.preventDefault(); route(); }
});
$("#sq").addEventListener("input", runSearch);
$("#sq").addEventListener("keydown", e => {
  const links = $$("#sres a");
  if ((e.key === "ArrowDown" || e.key === "ArrowUp") && links.length) {
    e.preventDefault();
    sSel = (sSel + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
    links.forEach((l, i) => l.classList.toggle("act", i === sSel));
    links[sSel].scrollIntoView({ block: "nearest" });
  } else if (e.key === "Enter" && links[sSel]) links[sSel].click();
});
$("#searchbtn").addEventListener("click", openSearch);
$("#sclose").addEventListener("click", closeSearch);
$("#scrim").addEventListener("click", e => { if (e.target.id === "scrim") closeSearch(); });
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); $("#scrim").hidden ? openSearch() : closeSearch(); }
  else if (e.key === "Escape") { closeSearch(); toggleMenu(false); }
});

/* ================================================================ menu (mobile) */
function toggleMenu(open) {
  const side = $("#side");
  const o = open === undefined ? !side.classList.contains("open") : open;
  side.classList.toggle("open", o);
  $("#menubtn").setAttribute("aria-expanded", o);
}
$("#menubtn").addEventListener("click", () => toggleMenu());
$("#side").addEventListener("click", e => { if (e.target.closest("a")) toggleMenu(false); });

/* ================================================================ router */
function parseHash() {
  const h = decodeURIComponent(location.hash.slice(1));
  if (!h || h === "hem") return { view: "home" };
  if (h === "lab") return { view: "lab" };
  if (h === "app") return { view: "app" };
  const cid = h.split("-")[0];
  const c = courseById(cid);
  if (!c) {
    // links from the first version (#loopar, #uppgifter, ...)
    const legacy = COURSES[0];
    if (lessonIdx(legacy, h) >= 0) return { redirect: legacy.id + "-" + h };
    if (h === "uppgifter" || h === "resurser") return { redirect: legacy.id + "-" + h };
    return { view: "home" };
  }
  const rest = h.slice(cid.length + 1);
  if (!rest) return { view: "course", course: c };
  if (rest === "prov") return { view: "exam", course: c };
  if (rest === "uppgifter") return { view: "assign", course: c };
  if (rest === "resurser") return { view: "res", course: c };
  if (lessonIdx(c, rest) >= 0) return { view: "lesson", course: c, lesson: rest };
  return { view: "course", course: c };
}
function route() {
  clearInterval(examTimer);
  const ctx = parseHash();
  if (ctx.redirect) { location.replace("#" + ctx.redirect); return; }
  const main = $("#main"), c = ctx.course;
  if (ctx.view === "home") main.innerHTML = viewHome();
  else if (ctx.view === "course") main.innerHTML = viewCourse(c);
  else if (ctx.view === "lesson") main.innerHTML = viewLesson(c, ctx.lesson);
  else if (ctx.view === "assign") { main.innerHTML = viewAssign(c); bindAssign(); }
  else if (ctx.view === "res") main.innerHTML = viewRes(c);
  else if (ctx.view === "exam") { main.innerHTML = viewExamShell(c); examConfirm = false; renderExam(c); }
  else if (ctx.view === "lab") { main.innerHTML = viewLab(); renderLab(); }
  else if (ctx.view === "app") { main.innerHTML = viewApp(); bindApp(); }
  renderChrome(ctx);
  document.title = ctx.view === "home" ? "Nollterm Kurser"
    : ctx.view === "lesson" ? `${c.lessons[lessonIdx(c, ctx.lesson)].title} · ${c.short}`
    : ctx.view === "exam" ? `Prov · ${c.short}` : ctx.view === "lab" ? "Kodlabb · Nollterm" : ctx.view === "app" ? "Appen · Nollterm" : `${c.short} · Nollterm`;
  $$(".article pre code[class^='language-']", main).forEach(el => { try { window.hljs && hljs.highlightElement(el); } catch (e) {} });
  if (ctx.view === "lesson") bindLesson(c, ctx.lesson);
  if (pendingSec && document.getElementById(pendingSec)) {
    const el = document.getElementById(pendingSec); pendingSec = null;
    setTimeout(() => el.scrollIntoView({ block: "start" }), 30);
  } else window.scrollTo(0, 0);
}
function bindCopy(root) {
  root.addEventListener("click", e => {
    const b = e.target.closest(".copy"); if (!b) return;
    const code = b.closest(".codewrap").querySelector("code");
    const ok = () => { b.textContent = "Kopierat"; setTimeout(() => (b.textContent = "Kopiera"), 1400); };
    const fallback = () => { const r = document.createRange(); r.selectNodeContents(code); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = "Markerat, tryck Ctrl+C"; };
    try { navigator.clipboard.writeText(code.innerText).then(ok, fallback); } catch (err) { fallback(); }
  });
}
bindCopy($("#main"));
window.addEventListener("hashchange", route);
route();
