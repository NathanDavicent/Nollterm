const WIDGETS = {
  offbyone(el) {
    const arr = [21, 22, 20, 19, 23];
    let op = "<", timer = null, cur = -1;
    el.innerHTML = `<div class="wt"><b>Off-by-one i praktiken</b><span>interaktiv</span></div>
      <div class="controls"><code id="ob-code"></code><span class="seg" role="group" aria-label="Jämförelse">
      <button type="button" data-op="<" aria-pressed="true">&lt;</button><button type="button" data-op="<=" aria-pressed="false">&lt;=</button></span>
      <button type="button" class="btn" id="ob-run" style="padding:5px 12px">Kör loopen ▶</button></div>
      <div class="cells" id="ob-cells"></div><div class="readout" id="ob-out"></div>`;
    const draw = () => {
      const last = op === "<" ? 4 : 5;
      $("#ob-code", el).textContent = `for (int i = 0; i ${op} 5; i++)  sum += temps[i];`;
      $("#ob-cells", el).innerHTML = [0, 1, 2, 3, 4, 5].map(i => {
        let c;
        if (i === 5) c = cur === 5 ? "out" : "junk";
        else if (i === cur) c = "cur";
        else if (cur > i) c = "hit";
        else c = "";
        return `<div class="cellbox ${c}"><span class="v">${i === 5 ? "??" : arr[i]}</span><span class="i">temps[${i}]</span></div>`;
      }).join("");
      const out = $("#ob-out", el);
      if (cur < 0) out.innerHTML = `<span>Arrayen har 5 element, index 0–4. Rutan längst till höger är minnet efter arrayen.</span>`;
      else if (cur > last) out.innerHTML = op === "<"
        ? `<span class="ok">5 varv: i = 0, 1, 2, 3, 4. Alla element lästes exakt en gång.</span>`
        : `<span class="bad">6 varv: i = 0 … 5. temps[5] ligger utanför arrayen. Summan får ett skräpvärde, eller så kraschar programmet.</span>`;
      else out.innerHTML = `<span>i = ${cur}: villkoret ${cur} ${op} 5 är sant → läser temps[${cur}]${cur === 5 ? ' <b class="bad">utanför arrayen!</b>' : ` = ${arr[cur]}`}</span>`;
    };
    $$(".seg button", el).forEach(b => b.addEventListener("click", () => {
      op = b.dataset.op; clearInterval(timer); cur = -1;
      $$(".seg button", el).forEach(x => x.setAttribute("aria-pressed", x === b)); draw();
    }));
    $("#ob-run", el).addEventListener("click", () => {
      clearInterval(timer); cur = 0; draw();
      const last = op === "<" ? 4 : 5;
      timer = setInterval(() => { cur++; draw(); if (cur > last) clearInterval(timer); }, 650);
    });
    draw();
  },

  stack(el) {
    const code = [
      "float average(float a, float b) {",
      "    float sum = a + b;",
      "    return sum / 2;",
      "}",
      "",
      "int main() {",
      "    float t1 = 21.5;",
      "    float t2 = 23.5;",
      "    float avg = average(t1, t2);",
      "    printf(\"%.1f\\n\", avg);",
      "}",
    ];
    const S = [
      { l: 5, f: [["main", "t1 = ?", "t2 = ?", "avg = ?"]], c: "Programmet startar. main() får en stack frame med plats för sina lokala variabler." },
      { l: 6, f: [["main", "t1 = 21.5", "t2 = ?", "avg = ?"]], c: "t1 tilldelas ett värde i main:s frame." },
      { l: 7, f: [["main", "t1 = 21.5", "t2 = 23.5", "avg = ?"]], c: "t2 tilldelas." },
      { l: 0, f: [["main", "t1 = 21.5", "t2 = 23.5", "avg = ?"], ["average", "a = 21.5", "b = 23.5", "sum = ?"]], c: "average() anropas. En ny frame läggs överst. a och b är kopior av t1 och t2 (call by value)." },
      { l: 1, f: [["main", "t1 = 21.5", "t2 = 23.5", "avg = ?"], ["average", "a = 21.5", "b = 23.5", "sum = 45.0"]], c: "sum är en lokal variabel. Den finns bara i average():s frame." },
      { l: 2, f: [["main", "t1 = 21.5", "t2 = 23.5", "avg = ?"], ["average", "a = 21.5", "b = 23.5", "sum = 45.0", "→ returnerar 22.5"]], c: "return lämnar tillbaka 22.5 till den som anropade." },
      { l: 8, f: [["main", "t1 = 21.5", "t2 = 23.5", "avg = 22.5"]], c: "average():s frame är borta. a, b och sum finns inte längre. Returvärdet hamnar i avg." },
      { l: 9, f: [["main", "t1 = 21.5", "t2 = 23.5", "avg = 22.5"]], c: "printf skriver ut värdet.", o: "22.5" },
      { l: 10, f: [], c: "main() returnerar och dess frame tas bort. Stacken är tom igen." },
    ];
    let s = 0;
    el.innerHTML = `<div class="wt"><b>Anropsstacken steg för steg</b><span>interaktiv</span></div>
      <div class="stackw"><pre id="st-code"></pre><div><div class="eyebrow" style="margin-bottom:6px">Stacken (överst = aktiv)</div><div class="frames" id="st-frames"></div><div class="out-term" id="st-out" aria-label="Utskrift"></div></div></div>
      <div class="stack-caption" id="st-cap" aria-live="polite"></div>
      <div class="stepbtns"><button type="button" id="st-prev">← Föregående</button><button type="button" id="st-next">Nästa steg →</button><button type="button" id="st-reset">Börja om</button></div>`;
    const draw = () => {
      const st = S[s];
      $("#st-code", el).innerHTML = code.map((c, i) => `<span class="ln ${i === st.l ? "now" : ""}">${esc(c) || " "}</span>`).join("");
      $("#st-frames", el).innerHTML = st.f.length ? st.f.map((f, i) => `<div class="frame ${i === st.f.length - 1 ? "top" : ""}"><b>${f[0]}()</b>${f.slice(1).map(esc).join("<br>")}</div>`).join("") : `<div style="color:var(--muted);font-size:.85rem;margin:auto">tom</div>`;
      $("#st-cap", el).textContent = `Steg ${s + 1}/${S.length}: ${st.c}`;
      $("#st-out", el).textContent = s >= 7 ? "$ ./program\n22.5" : "$ ./program";
      $("#st-prev", el).disabled = s === 0;
      $("#st-next", el).disabled = s === S.length - 1;
    };
    $("#st-prev", el).addEventListener("click", () => { if (s > 0) { s--; draw(); } });
    $("#st-next", el).addEventListener("click", () => { if (s < S.length - 1) { s++; draw(); } });
    $("#st-reset", el).addEventListener("click", () => { s = 0; draw(); });
    $("#st-out", el).style.whiteSpace = "pre";
    draw();
  },

  pointer(el) {
    const arr = [21, 22, 20, 19, 23], base = 0x7ffe1000;
    el.innerHTML = `<div class="wt"><b>Pekararitmetik: p + i</b><span>interaktiv</span></div>
      <div class="controls"><code>int temps[5] = {21, 22, 20, 19, 23};  int* p = temps;</code></div>
      <div class="controls"><label for="pt-i">i =</label><input type="range" id="pt-i" min="0" max="5" value="0"><b id="pt-iv" style="font-family:var(--f-mono)">0</b></div>
      <div class="cells" id="pt-cells"></div><div class="readout" id="pt-out"></div>`;
    const draw = () => {
      const i = +$("#pt-i", el).value;
      $("#pt-iv", el).textContent = i;
      $("#pt-cells", el).innerHTML = [0, 1, 2, 3, 4, 5].map(k => `<div class="cellbox ${k === 5 ? (k === i ? "out" : "junk") : k === i ? "cur" : ""}"><span class="v">${k === 5 ? "??" : arr[k]}</span><span class="i">0x…${(base + k * 4).toString(16).slice(-3)}</span></div>`).join("");
      const a = "0x" + (base + i * 4).toString(16);
      $("#pt-out", el).innerHTML = `<span>p + ${i} = 0x${base.toString(16)} + ${i} × sizeof(int) = ${a}</span>` +
        (i < 5 ? `<span>*(p + ${i}) = temps[${i}] = <b class="ok">${arr[i]}</b></span>` : `<span class="bad">*(p + 5) pekar precis efter arrayen. Adressen är giltig att räkna fram, men att läsa där är odefinierat beteende.</span>`);
    };
    $("#pt-i", el).addEventListener("input", draw);
    draw();
  },

  cstring(el) {
    el.innerHTML = `<div class="wt"><b>Strängen i minnet</b><span>interaktiv</span></div>
      <div class="controls"><label for="cs-t">Text</label><input type="text" id="cs-t" value="Hello" maxlength="14">
      <label for="cs-n">char buf[</label><input type="number" id="cs-n" value="5" min="1" max="16"><span style="font-family:var(--f-mono)">];</span></div>
      <div class="cells" id="cs-cells"></div><div class="readout" id="cs-out"></div>`;
    const draw = () => {
      const t = $("#cs-t", el).value;
      let n = Math.max(1, Math.min(16, parseInt($("#cs-n", el).value, 10) || 1));
      const need = t.length + 1;
      const total = Math.max(n, need);
      const chars = [...t, "\\0"];
      $("#cs-cells", el).innerHTML = Array.from({ length: total }, (_, i) => {
        const inBuf = i < n;
        const ch = i < chars.length ? chars[i] : "?";
        let cls = !inBuf ? "out" : ch === "\\0" ? "nul" : ch === "?" ? "junk" : "";
        const shown = ch === " " ? "␣" : ch;
        return `<div class="cellbox ${cls}"><span class="v">${esc(shown)}</span><span class="i">${inBuf ? `buf[${i}]` : "utanför"}</span></div>`;
      }).join("");
      $("#cs-out", el).innerHTML = `<span>strlen = ${t.length} · sizeof(buf) = ${n} · behöver ${need} bytes</span>` +
        (need <= n ? `<span class="ok">Får plats, inklusive '\\0'.</span>` : `<span class="bad">Buffer overflow: ${need - n} byte${need - n > 1 ? "s" : ""} skrivs utanför bufferten och förstör annat minne.${need - n === 1 ? " Det är nolltecknet som inte fick plats." : ""}</span>`);
    };
    $("#cs-t", el).addEventListener("input", draw);
    $("#cs-n", el).addEventListener("input", draw);
    draw();
  },
};

