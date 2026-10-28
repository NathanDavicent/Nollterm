// Kollar vilka språk varje koduppgift kan köras i på webben och sparar svaret i src/web-langs.json.
//
// Python fungerar alltid (Pyodide är riktig CPython). C och C++ körs på webben i JSCPP, en tolk som
// bara klarar en del av språket. Därför kör vi lösningsförslaget i JSCPP mot testerna: går alla
// igenom får uppgiften köras på webben i det språket. Annars visas den bara i appen.
//
// Kör: npm install && node tools/web_langs.cjs
const fs = require("fs");
const path = require("path");
const mod = require("JSCPP");
const JSCPP = mod.default || mod;

const root = path.join(__dirname, "..");
const content = path.join(root, "content");

// Samma förberedelse som webbtolken gör (src/worker-src.js)
const prep = code => {
  const c = code.replace(/static_cast\s*<\s*([\w\s]+?)\s*>\s*\(/g, "($1)(").replace(/\bstd::(cout|cin|endl|cerr)\b/g, "$1");
  return /using\s+namespace\s+std/.test(code) || !/std::/.test(code) ? c : c.replace(/(#include\s*<iostream>)/, "$1\nusing namespace std;");
};
const norm = s => String(s).replace(/\r/g, "").split("\n").map(l => l.replace(/\s+$/, "")).join("\n").replace(/\n+$/, "");
const parseTests = text => {
  const tests = [];
  for (const m of text.matchAll(/--- in\n([\s\S]*?)--- out\n([\s\S]*?)(?=--- in\n|$)/g))
    tests.push({ in: m[1], out: m[2] });
  return tests;
};

const result = {};
const { courses } = JSON.parse(fs.readFileSync(path.join(content, "courses.json"), "utf8"));
for (const cid of courses) {
  const tasksDir = path.join(content, cid, "tasks");
  if (!fs.existsSync(tasksDir)) continue;
  for (const task of fs.readdirSync(tasksDir).sort()) {
    const dir = path.join(tasksDir, task);
    const tests = parseTests(fs.readFileSync(path.join(dir, "tests.txt"), "utf8"));
    const langs = [];
    for (const lang of ["c", "cpp"]) {
      const file = path.join(dir, "solution." + lang);
      if (!fs.existsSync(file)) continue;
      const code = prep(fs.readFileSync(file, "utf8"));
      const ok = tests.every(t => {
        let out = "";
        try { JSCPP.run(code, t.in, { stdio: { write: s => (out += s) }, maxTimeout: 3000 }); } catch (e) { return false; }
        return norm(out) === norm(t.out);
      });
      if (ok) langs.push(lang);
    }
    if (fs.existsSync(path.join(dir, "solution.py"))) langs.push("py");
    result[`${cid}/${task}`] = langs;
    console.log(`${cid}/${task}: ${langs.join(", ") || "bara appen"}`);
  }
}
fs.writeFileSync(path.join(root, "src", "web-langs.json"), JSON.stringify(result, null, 2) + "\n");
console.log("Sparade src/web-langs.json");
