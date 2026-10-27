// Copies the built web version into the desktop app before packaging.
const fs = require("node:fs");
const path = require("node:path");
const src = path.join(__dirname, "..", "..", "web");
const dst = path.join(__dirname, "..", "web");
fs.rmSync(dst, { recursive: true, force: true });
fs.cpSync(src, dst, { recursive: true });
console.log("Copied web/ into desktop/web");
