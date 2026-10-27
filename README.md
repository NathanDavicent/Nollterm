# Nollterm

Kursportal för mina kurser: lektioner, frågor, slumpade prov med rättning och ett kodlabb. Finns i två versioner som byggs från samma filer:

| | Webbversion | Desktop-app (Windows) |
|---|---|---|
| Var | GitHub Pages, funkar på mobilen | Installeras från Releases |
| Kod körs med | C++-tolk i webbläsaren (enklare kod) | **g++** (w64devkit) som följer med appen |
| Full C++ (string, vector, klasser) | Nej, öppna i Compiler Explorer | Ja |
| Flera filer och headers | Nej | Ja, i Kodlabbet |
| Offline | Ja, efter första besöket | Ja |

- **Webb:** https://nathandavicent.github.io/Nollterm/
- **Ladda ner appen:** [Releases](https://github.com/NathanDavicent/Nollterm/releases/latest) → `Nollterm-Setup-x.y.z.exe`

## Kom igång första gången

1. **Slå på GitHub Pages:** *Settings → Pages → Build and deployment → Source: GitHub Actions*. Kör sedan workflowen *Webbversion (GitHub Pages)* under *Actions* (eller pusha en ändring i `web/`).
2. **Bygg första versionen av appen:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
   Workflowen *Desktop-app (Windows)* laddar ner g++, kör ett självtest, bygger installationsfilen och lägger upp den under Releases (tar ca 5–10 min).
3. **Installera:** Windows kan varna eftersom appen inte är signerad. Klicka *Mer information → Kör ändå*.
4. **Mobilen:** öppna webblänken. iPhone: Safari → Dela → *Lägg till på hemskärmen*. Android: Chrome → ⋮ → *Installera app*.

## Struktur

```
src/parts/        Källfilerna för sidan (innehåll, frågor, logik, stil)
src/build.mjs     Bygger web/index.html av delarna
web/              Färdig webbversion (det som publiceras på Pages)
desktop/          Electron-appen
  compiler.js     Kompilerar och kör kod med g++ (tidsgräns, flera filer)
  main.js         Fönstret och kopplingen till compiler.js
  preload.js      Exponerar window.nollterm.run() för sidan
.github/workflows Pages-deploy och Windows-bygget
```

Sidan känner av om den körs i appen (`window.nollterm` finns). Då går all kod till g++, annars till webbtolken.

## Ändra innehåll eller lägga till en kurs

1. Redigera filerna i `src/parts/` (lektioner i `p2_content_*.js`, frågor i `p2_questions.js`, kurslistan i `p3a_core.js`).
2. Bygg: `node src/build.mjs`
3. Commit och push. Webbversionen uppdateras automatiskt.
4. Ny app-version: skapa en ny tagg, t.ex. `git tag v1.1.0 && git push origin v1.1.0`.

## Köra lokalt

```bash
# Webb
node src/build.mjs
npx http-server web -p 8080

# Desktop (kräver g++ i PATH, eller w64devkit i desktop/vendor/w64devkit)
cd desktop
npm install
npm start
npm run selftest   # testar g++-bryggan
```

## Frågetyper

Flerval, flera rätt, fritext och kodfrågor. Kodfrågor rättas mot testfall (indata → förväntad utdata). I appen kompileras de med g++; på webben körs de i tolken [JSCPP](https://github.com/felixhao28/JSCPP), som stöder cout/cin, printf/scanf, funktioner, loopar, arrayer, pekare och C-strängar.

Provläget drar slumpade frågor jämnt fördelat över valda lektioner. Kodfrågor ger 2 poäng, övriga 1. Betygsgränserna (G 50 %, VG 75 %) är satta för självtest.
