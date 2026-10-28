# Nollterm

Kursportal för mina kurser: lektioner, frågor, slumpade prov med rättning och ett kodlabb.
Kodfrågorna löser du i **C, C++ eller Python**, och byter språk med ett klick som på LeetCode.

Skapad av **Nathanael** ([@NathanDavicent](https://github.com/NathanDavicent)), byggd tillsammans med Claude.
Finns i två versioner som läser samma kursfiler i `content/`:

| | Webbversion | Datorappen (Windows) |
|---|---|---|
| Skriven i | HTML och JavaScript | **C++17** (Dear ImGui) |
| Var | GitHub Pages, funkar på mobilen | Zip-fil från Releases |
| Python | Riktig Python (Pyodide) i webbläsaren | Python 3.12, följer med |
| C och C++ | Tolk i webbläsaren (enklare kod) | Riktig **gcc** och **g++** (w64devkit), följer med |
| Offline | Ja, efter första besöket | Ja |

- **Webb:** https://nathandavicent.github.io/Nollterm/
- **Ladda ner appen:** [Releases](https://github.com/NathanDavicent/Nollterm/releases/latest) → `Nollterm-Windows.zip`.
  Packa upp hela mappen och starta `Nollterm.exe`.
- **Läs koden:** [`app/README.md`](app/README.md) är en läsguide genom C++-appen.

## Kurser

| Kurs | Lektioner | Frågor | Kodfrågor |
|---|---|---|---|
| Programmering C/C++ (IoT) | 11 | 135 | 17, i C, C++ och Python |
| Objektorienterad programmering och design | 10 | 104 | 15, i C++ och Python |

## Kom igång första gången

1. **Slå på GitHub Pages:** *Settings → Pages → Build and deployment → Source: GitHub Actions*. Kör sedan
   *Webbversion (GitHub Pages)* under *Actions* (eller pusha en ändring i `web/`).
2. **Bygg appen:** *Actions → App (Windows) → Run workflow*. Den laddar ner gcc, g++ och Python, bygger
   appen, rättar alla lösningsförslag och lägger upp `Nollterm-Windows.zip` under Releases (ca 10 min).
3. **Starta:** Windows kan varna eftersom appen inte är signerad. Klicka *Mer information → Kör ändå*.
4. **Mobilen:** öppna webblänken. iPhone: Safari → Dela → *Lägg till på hemskärmen*. Android: Chrome → ⋮ → *Installera app*.

## Struktur

```
content/                  Kursinnehållet. Både appen och webben läser härifrån.
  courses.json            Vilka kurser som finns, i ordning
  <kurs>/course.json      Titel, schema, inlämningsuppgifter, källor och länkar
  <kurs>/lessons/*.json   En fil per lektion: text, kodexempel och frågor
  <kurs>/tasks/<id>/      En mapp per koduppgift (se nedan)
app/                      C++-appen. Läsguide i app/README.md
src/                      Webbversionen: src/parts/ är sidans delar, src/build.mjs bygger den
web/                      Färdig webbversion (det som publiceras på Pages)
tools/check_tasks.py      Kör alla lösningsförslag i alla språk mot testerna
tools/web_langs.cjs       Kollar vilka uppgifter webbens C/C++-tolk klarar
.github/workflows/        Pages, Windows-appen och kontrollen av uppgifterna
```

## Lägga till innehåll

### En koduppgift

Skapa en mapp i `content/<kurs>/tasks/`, till exempel `03-loopar-4/`:

```
tests.txt         Testfallen
starter.cpp       Koden studenten börjar med
solution.cpp      Lösningsförslaget
starter.py        (valfritt) samma uppgift i Python
solution.py
starter.c         (valfritt) samma uppgift i C
solution.c
```

Varje språk som har både `starter` och `solution` går att välja i appen. `tests.txt` ser ut så här:

```
--- in
5
--- out
1 4 9 16 25
--- in
1
--- out
1
```

Lägg sedan till frågan i lektionens JSON-fil under `questions`:

```json
{ "type": "code", "q": "Skriv ut kvadraterna 1..n.", "task": "03-loopar-4", "why": "En for-loop från 1 till n." }
```

Kontrollera med `python tools/check_tasks.py` (eller `nollterm-check --verify` i appen) att alla
lösningsförslag klarar testerna och att startkoden inte gör det.

### Andra frågetyper

```json
{ "type": "mc",    "q": "…", "options": ["a", "b", "c"], "answer": 1, "why": "…" }
{ "type": "multi", "q": "…", "options": ["a", "b", "c"], "answers": [0, 2], "why": "…" }
{ "type": "text",  "q": "…", "accept": ["svar", "annat svar"], "placeholder": "…", "why": "…" }
```

### En ny kurs

Skapa `content/<id>/course.json` och `content/<id>/lessons/`, kopiera gärna strukturen från `content/oop/`,
och lägg till id:t i `content/courses.json`. Appen hittar kursen direkt. För webben:

```bash
npm install
npm run web-langs   # vilka C/C++-uppgifter som går att köra i webbläsaren
npm run build       # bygger web/index.html
```

Commit och push. Webbversionen uppdateras automatiskt. För en ny app-version: höj `VERSION` i
`app/CMakeLists.txt` och kör *App (Windows)* igen.

## Köra lokalt

```bash
# Webb
npm run build
npx http-server web -p 8080

# Appen (se app/README.md)
cmake -S app -B build
cmake --build build --parallel
./build/Nollterm
```

## Rättning och prov

Kodfrågor rättas mot testfall: indata in, utdatan jämförs rad för rad (mellanslag i slutet av raderna
spelar ingen roll). Provläget drar slumpade frågor jämnt fördelat över valda lektioner. Kodfrågor ger 2
poäng, övriga 1. Betygsgränserna (G 50 %, VG 75 %) är satta för självtest.

På webben körs Python med [Pyodide](https://pyodide.org/), och C och C++ i tolken
[JSCPP](https://github.com/felixhao28/JSCPP), som stöder cout/cin, printf/scanf, funktioner, loopar,
arrayer, pekare och C-strängar. Uppgifter som behöver mer (klasser, string, vector) kör du i Python på
webben, eller i C++ i appen.
