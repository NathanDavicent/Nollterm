// Assembles web/index.html from src/parts. Run: node src/build.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const part = f => readFileSync(join(root, "src", "parts", f), "utf8");
const scripts = ["p2_content_a.js", "p2_content_b.js", "p2_questions.js",
  "c2_oop_content.js", "c2_oop_content_b.js", "c2_oop_questions.js",
  "p3w_widgets.js", "p3w_widgets_oop.js", "p3a_core.js",
  "p3b_questions.js", "p3c_exam.js", "p3e_lab.js", "p3d_router.js"].map(part).join("\n");
const body = part("p1_head.html") + part("p1c_style2.html") +
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>\n' +
  "<script>\n" + scripts + "\n</script>\n";

// Full page for GitHub Pages and the desktop app
const head = `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0c6a4e">
<meta name="description" content="Kursportal: lektioner, frågor, prov och kod i C/C++.">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font-size:14px}img{max-width:100%}[hidden]{display:none!important}</style>
`;
writeFileSync(join(root, "web", "index.html"), head + body.replace("</title>", "</title>") + "</html>\n");

// Fragment used when publishing the page as a Claude artifact (optional)
if (process.env.ARTIFACT_OUT) { mkdirSync(dirname(process.env.ARTIFACT_OUT), { recursive: true }); writeFileSync(process.env.ARTIFACT_OUT, body); }

// Bump the offline cache whenever the site is rebuilt
const sw = readFileSync(join(root, "web", "sw.js"), "utf8").replace(/const VERSION = "[^"]*";/, `const VERSION = "${Date.now()}";`);
writeFileSync(join(root, "web", "sw.js"), sw);
console.log("Built web/index.html");
