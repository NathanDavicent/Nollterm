const mod = require('JSCPP');
const JSCPP = mod.default || mod;
function prep(code) {
  // light compatibility layer for the interpreter
  return code
    .replace(/static_cast\s*<\s*([\w\s]+?)\s*>\s*\(/g, '($1)(')
    .replace(/\bstd::(cout|cin|endl|cerr)\b/g, '$1');
}
self.onmessage = (e) => {
  const { id, code, input } = e.data;
  let out = '';
  try {
    const src = /using\s+namespace\s+std/.test(code) || !/std::/.test(code) ? prep(code) : prep(code).replace(/(#include\s*<iostream>)/, '$1\nusing namespace std;');
    const exit = JSCPP.run(src, input || '', { stdio: { write: (s) => { out += s; } }, maxTimeout: 2500 });
    self.postMessage({ id, ok: true, out, exit });
  } catch (err) {
    self.postMessage({ id, ok: false, out, error: String((err && err.message) || err) });
  }
};
