// Kör Python i webbläsaren med Pyodide (CPython kompilerat till WebAssembly), i en Web Worker
// så att sidan inte fryser. Sidan skickar {id, code, input} och får tillbaka {id, ok, out, error}.
const PYODIDE = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";

let pyodide = null;
try {
  importScripts(PYODIDE + "pyodide.js");
  loadPyodide({ indexURL: PYODIDE }).then(p => { pyodide = p; self.postMessage({ ready: true }); },
    e => self.postMessage({ loadError: String(e && e.message || e) }));
} catch (e) {
  self.postMessage({ loadError: String(e && e.message || e) });
}

// Utdata samlas byte för byte och avkodas som UTF-8 på slutet, så att å, ä och ö och print(..., end="") blir rätt.
self.onmessage = e => {
  const { id, code, input } = e.data;
  const out = [], err = [];
  pyodide.setStdout({ raw: b => out.push(b) });
  pyodide.setStderr({ raw: b => err.push(b) });
  const text = bytes => new TextDecoder().decode(new Uint8Array(bytes));
  try {
    // Indata läses från sys.stdin, så input() och sys.stdin.read() fungerar som vanligt.
    pyodide.globals.set("__nollterm_input", input || "");
    pyodide.runPython("import sys, io\nsys.stdin = io.StringIO(__nollterm_input)\ndel __nollterm_input");
    // Varje körning får ett eget, tomt namnrum så att variabler inte följer med mellan körningar.
    const ns = pyodide.toPy({ __name__: "__main__" });
    try { pyodide.runPython(code, { globals: ns, filename: "main.py" }); } finally { ns.destroy(); }
    pyodide.runPython("import sys; sys.stdout.flush(); sys.stderr.flush()");
    self.postMessage({ id, ok: true, out: text(out), stderr: text(err) });
  } catch (ex) {
    // Visa bara den intressanta delen av tracebacken: raderna från main.py och felet.
    const msg = String(ex && ex.message || ex);
    const lines = msg.split("\n");
    const start = lines.findIndex(l => l.includes('File "main.py"'));
    const tb = start >= 0 ? "Traceback (most recent call last):\n" + lines.slice(start).join("\n") : msg;
    self.postMessage({ id, ok: false, out: text(out), error: tb.trim() });
  }
};
