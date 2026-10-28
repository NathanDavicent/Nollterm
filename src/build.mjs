// Bygger web/index.html av src/parts och kursinnehållet i content/. Kör: node src/build.mjs
//
// content/ är samma mapp som C++-appen läser. Här görs JSON-filerna och uppgiftsmapparna om till
// de strukturer som webbsidans JavaScript använder, och läggs in i sidan som const CONTENT.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const part = f => readFileSync(join(root, "src", "parts", f), "utf8");
const readJson = p => JSON.parse(readFileSync(p, "utf8"));

/* ---------------------------------------------------------------- content/ -> webbens format */
const LANGS = ["c", "cpp", "py"];
const webLangsFile = join(root, "src", "web-langs.json");
const webLangs = existsSync(webLangsFile) ? readJson(webLangsFile) : {};   // från tools/web_langs.cjs

const parseTests = text => [...text.matchAll(/--- in\n([\s\S]*?)--- out\n([\s\S]*?)(?=--- in\n|$)/g)]
  .map(m => ({ in: m[1], out: m[2] }));

function loadTask(cid, taskId) {
  const dir = join(root, "content", cid, "tasks", taskId);
  const code = {};
  for (const l of LANGS) {
    const s = join(dir, "starter." + l), sol = join(dir, "solution." + l);
    if (existsSync(s) && existsSync(sol)) code[l] = { starter: readFileSync(s, "utf8"), sol: readFileSync(sol, "utf8") };
  }
  if (!Object.keys(code).length) throw new Error(`Uppgiften ${cid}/${taskId} saknar starter/solution`);
  // Språk som går att köra i webbläsaren. Saknas uppgiften i web-langs.json: anta Python om det finns.
  const web = (webLangs[`${cid}/${taskId}`] || (code.py ? ["py"] : [])).filter(l => code[l]);
  return { tests: parseTests(readFileSync(join(dir, "tests.txt"), "utf8")), code, langs: Object.keys(code), web };
}

const block = b => {
  switch (b.type) {
    case "h": return ["h", b.text];
    case "p": return ["p", b.html];
    case "list": return ["list", b.items];
    case "code": return b.caption ? ["code", b.lang, b.code, b.caption] : ["code", b.lang, b.code];
    case "table": return ["table", b.head, b.rows];
    case "note": return ["note", b.kind, b.html];
    case "widget": return ["widget", b.name];
    case "exercise": return b.solution ? ["ex", b.title, b.html, b.solution, b.lang || "cpp"] : ["ex", b.title, b.html];
  }
  throw new Error("Okänd blocktyp: " + b.type);
};

function question(cid, q) {
  switch (q.type) {
    case "mc": return { t: "mc", q: q.q, o: q.options, a: q.answer, why: q.why };
    case "multi": return { t: "multi", q: q.q, o: q.options, a: q.answers, why: q.why };
    case "text": return { t: "text", q: q.q, accept: q.accept, ph: q.placeholder || "", why: q.why };
    case "code": {
      const task = loadTask(cid, q.task);
      // gpp: går inte att köra i webbläsaren i något språk, bara i appen
      return { t: "code", q: q.q, why: q.why, task: q.task, tests: task.tests, code: task.code, langs: task.langs, web: task.web, gpp: !task.web.length };
    }
  }
  throw new Error("Okänd frågetyp: " + q.type);
}

function loadCourse(cid) {
  const dir = join(root, "content", cid);
  const c = readJson(join(dir, "course.json"));
  const lessons = c.lessons.map(f => {
    const l = readJson(join(dir, "lessons", f));
    const out = { id: l.id, cat: l.category, min: l.minutes, title: l.title, lead: l.lead, src: l.sources || [], goals: l.goals || [],
      blocks: (l.blocks || []).map(block), pool: (l.questions || []).map(q => question(cid, q)) };
    if (l.date) out.date = l.date;
    return out;
  });
  return {
    id: c.id, badge: c.badge, title: c.title, short: c.short, tag: c.tag, desc: c.description, headline: c.headline,
    lessons,
    timeline: (c.timeline || []).map(t => ({ d: t.date, t: t.title, topics: t.lessons })),
    assignments: c.assignments || [],
    sources: (c.sources || []).map(s => ({ k: s.kind, t: s.title, d: s.description, topics: s.lessons })),
    links: (c.links || []).map(l => ({ k: l.kind, t: l.title, u: l.url, d: l.description })),
  };
}

const CONTENT = readJson(join(root, "content", "courses.json")).courses.map(loadCourse);
// </script> i en sträng skulle avsluta skripttaggen, så den escapas.
const contentJs = "const CONTENT = " + JSON.stringify(CONTENT).replace(/<\/(script)/gi, "<\\/$1") + ";\n";

/* ---------------------------------------------------------------- sätt ihop sidan */
const scripts = contentJs + ["p3w_widgets.js", "p3w_widgets_oop.js", "p3a_core.js",
  "p3b_questions.js", "p3c_exam.js", "p3e_lab.js", "p3d_router.js"].map(part).join("\n");
const body = part("p1_head.html") + part("p1c_style2.html") +
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>\n' +
  "<script>\n" + scripts + "\n</script>\n";

// Hela sidan för GitHub Pages
const head = `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0c6a4e">
<meta name="description" content="Kursportal: lektioner, frågor, prov och kod i C, C++ och Python.">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font-size:14px}img{max-width:100%}[hidden]{display:none!important}</style>
`;
writeFileSync(join(root, "web", "index.html"), head + body + "</html>\n");

// Fragment för att publicera sidan som en Claude-artifact (valfritt)
if (process.env.ARTIFACT_OUT) { mkdirSync(dirname(process.env.ARTIFACT_OUT), { recursive: true }); writeFileSync(process.env.ARTIFACT_OUT, body); }

// Ny cacheversion varje gång sidan byggs
const sw = readFileSync(join(root, "web", "sw.js"), "utf8").replace(/const VERSION = "[^"]*";/, `const VERSION = "${Date.now()}";`);
writeFileSync(join(root, "web", "sw.js"), sw);
const nq = CONTENT.reduce((n, c) => n + c.lessons.reduce((k, l) => k + l.pool.length, 0), 0);
console.log(`Byggde web/index.html: ${CONTENT.length} kurser, ${nq} frågor`);
