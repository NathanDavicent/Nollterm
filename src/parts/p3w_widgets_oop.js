/* Widgets for the OOP course */
Object.assign(WIDGETS, {
  ctororder(el) {
    const chains = {
      2: ["Sensor", "TemperatureSensor"],
      3: ["Sensor", "TemperatureSensor", "SmartThermo"],
    };
    let depth = 2, alive = false, busy = false, log = [];
    el.innerHTML = `<div class="wt"><b>Bygg och riv ett objekt</b><span>interaktiv</span></div>
      <div class="controls"><span class="seg" role="group" aria-label="Antal nivåer">
        <button type="button" data-d="2" aria-pressed="true">2 nivåer</button><button type="button" data-d="3" aria-pressed="false">3 nivåer</button></span>
        <button type="button" class="btn" id="co-make" style="padding:5px 12px">Skapa objekt</button>
        <button type="button" class="btn" id="co-kill" style="padding:5px 12px" disabled>Förstör objekt</button></div>
      <div class="stackw"><div id="co-layers" class="layers"></div><div class="out-term" id="co-log" style="min-height:150px;white-space:pre;margin:0"></div></div>
      <div class="stack-caption" id="co-cap" aria-live="polite"></div>`;
    const draw = (activeIdx = -1) => {
      const ch = chains[depth];
      $("#co-layers", el).innerHTML = ch.map((n, i) => `<div class="layer ${alive || i < activeIdx ? "on" : ""} ${i === activeIdx ? "now" : ""}" style="margin-left:${i * 14}px"><b>${n}</b><span>${i === 0 ? "basklass" : ": public " + ch[i - 1]}</span></div>`).join("");
      $("#co-log", el).textContent = log.length ? log.join("\n") : "$ ./program";
      $("#co-make", el).disabled = alive || busy;
      $("#co-kill", el).disabled = !alive || busy;
    };
    const steps = async (names, built) => {
      busy = true;
      for (let k = 0; k < names.length; k++) {
        const i = built ? k : names.length - 1 - k;
        const n = chains[depth][i];
        log.push(built ? `${n}()` : `~${n}()`);
        if (!built && k === names.length - 1) alive = false;
        draw(built ? i + 1 : i);
        if (built) $$(".layer", el)[i].classList.add("on");
        else $$(".layer", el).slice(i).forEach(x => x.classList.remove("on"));
        await new Promise(r => setTimeout(r, 550));
      }
      busy = false;
    };
    $$(".seg button", el).forEach(b => b.addEventListener("click", () => {
      if (busy) return;
      depth = +b.dataset.d; alive = false; log = [];
      $$(".seg button", el).forEach(x => x.setAttribute("aria-pressed", x === b));
      $("#co-cap", el).textContent = ""; draw();
    }));
    $("#co-make", el).addEventListener("click", async () => {
      log = []; await steps(chains[depth], true); alive = true; draw();
      $("#co-cap", el).textContent = "Basen byggs först, sedan varje subklass utåt. Varje konstruktor kan lita på att delarna under den redan finns.";
    });
    $("#co-kill", el).addEventListener("click", async () => {
      await steps(chains[depth], false); alive = false; draw();
      $("#co-cap", el).textContent = "Destruktorerna körs i omvänd ordning: den mest specifika klassen rivs först, basen sist.";
    });
    draw();
  },

  dispatch(el) {
    let virt = true, via = "ref";
    const code = () => `struct Base {
    ${virt ? "virtual " : ""}void f() const { cout << "Base::f\\n"; }
    virtual ~Base() = default;
};
struct Der : Base {
    void f() const${virt ? " override" : ""} { cout << "Der::f\\n"; }
};

Der d;
${via === "ref" ? "const Base& b = d;   // referens" : via === "ptr" ? "const Base* b = &d;  // pekare" : "Base b = d;          // kopia av bastyp"}
b${via === "ptr" ? "->" : "."}f();`;
    el.innerHTML = `<div class="wt"><b>Vilken f() körs?</b><span>interaktiv</span></div>
      <div class="controls">
        <span class="seg" role="group" aria-label="virtual"><button type="button" data-v="1" aria-pressed="true">virtual</button><button type="button" data-v="0" aria-pressed="false">utan virtual</button></span>
        <span class="seg" role="group" aria-label="Åtkomst"><button type="button" data-w="ref" aria-pressed="true">Base&amp;</button><button type="button" data-w="ptr" aria-pressed="false">Base*</button><button type="button" data-w="copy" aria-pressed="false">Base (kopia)</button></span>
      </div>
      <div class="stackw"><pre style="margin:0"><code class="language-cpp" id="dp-code"></code></pre>
        <div><div class="eyebrow" style="margin-bottom:6px">Utdata</div><div class="out-term" id="dp-out" style="font-size:1rem;margin:0 0 10px"></div><div id="dp-why" style="font-size:.9rem"></div></div></div>`;
    const draw = () => {
      const c = $("#dp-code", el);
      c.textContent = code(); c.removeAttribute("data-highlighted"); c.className = "language-cpp";
      try { window.hljs && hljs.highlightElement(c); } catch (e) {}
      const der = virt && via !== "copy";
      $("#dp-out", el).textContent = der ? "Der::f" : "Base::f";
      $("#dp-why", el).innerHTML = via === "copy"
        ? `<b class="bad" style="color:var(--bad)">Object slicing.</b> <code>b</code> är en ny <code>Base</code>, kopierad från d. Der-delen är bortskuren, så det finns ingen Der att anropa${virt ? ", trots virtual" : ""}.`
        : virt ? `<b style="color:var(--ok)">Virtuell dispatch.</b> Anropet går via objektets vtable och hittar <code>Der::f</code>, fast variabeln har typen ${via === "ref" ? "<code>Base&amp;</code>" : "<code>Base*</code>"}.`
        : `<b style="color:var(--copper)">Statisk bindning.</b> Utan <code>virtual</code> väljer kompilatorn funktion utifrån variabelns typ (<code>Base</code>), inte objektets.`;
      $$("[data-v]", el).forEach(b => b.setAttribute("aria-pressed", (b.dataset.v === "1") === virt));
      $$("[data-w]", el).forEach(b => b.setAttribute("aria-pressed", b.dataset.w === via));
    };
    $$("[data-v]", el).forEach(b => b.addEventListener("click", () => { virt = b.dataset.v === "1"; draw(); }));
    $$("[data-w]", el).forEach(b => b.addEventListener("click", () => { via = b.dataset.w; draw(); }));
    draw();
  },
});
