# Nollterm-appen (C++)

Datorappen är skriven i C++17. Den läser samma kursfiler som webbversionen (`content/`) och kör din kod
med riktig gcc, g++ och Python. Den här filen är en läsguide: i vilken ordning du kan läsa koden, och
varför den ser ut som den gör.

Ungefär 4 000 rader egen kod. Grafiken görs med [Dear ImGui](https://github.com/ocornut/imgui).

## Bibliotek

| Bibliotek | Till vad |
|---|---|
| [GLFW](https://www.glfw.org/) | Skapar fönstret och tar emot tangentbord och mus |
| [Dear ImGui](https://github.com/ocornut/imgui) | Ritar knappar, text och listor. Allt ritas om varje bildruta ("immediate mode") |
| [ImGuiColorTextEdit](https://github.com/BalazsJako/ImGuiColorTextEdit) | Kodredigeraren med syntaxfärgning |
| [nlohmann/json](https://github.com/nlohmann/json) | Läser kursfilerna och sparar dina framsteg |

CMake hämtar dem automatiskt första gången du bygger (`FetchContent` i `CMakeLists.txt`).

## Mapparna

```
src/
  core/   Kursinnehåll, frågor, prov och framsteg. Ingen grafik, ingen kompilator.
  run/    Starta processer, kompilera och köra kod, rätta mot tester.
  ui/     Allt som syns: sidor, frågor, kodredigerare, färger och typsnitt.
  main.cpp         Startpunkten: fönster, huvudloop.
  check_main.cpp   nollterm-check, kommandoradsverktyget som testar allt utan fönster.
assets/   Typsnitt (DejaVu) och ikonen.
```

Lagren beror bara nedåt: `ui` använder `run` och `core`, `run` använder `core`, och `core` beror inte på
något av de andra. Därför kan `nollterm-check` byggas utan grafik och köras på en Linux-server i GitHub Actions.

## Läsordning

1. **`core/Language.h`**: `enum class Language { C, Cpp, Python }`. Liten fil, bra start.
2. **`core/Question.h` och `.cpp`**: frågetyperna. En abstrakt basklass `Question` med fyra subklasser.
3. **`core/QuestionFactory.cpp`**: gör JSON till rätt sorts `Question`.
4. **`core/Content.cpp`**: läser `content/` till `Course` → `Lesson` → frågor.
5. **`run/Process.cpp`**: startar ett program, skickar indata, läser utdata och avbryter efter en tidsgräns.
   Här finns två versioner med `#ifdef _WIN32`: Windows (`CreateProcessW`) och Linux/macOS (`fork` + `exec`).
6. **`run/LanguageRunner.cpp`**: kompilerar med gcc/g++ eller kör med Python.
7. **`run/Judge.cpp`**: kör koden mot alla tester och jämför utdatan.
8. **`core/Exam.cpp`**: slumpar ett prov och räknar ut betyget.
9. **`ui/App.cpp`** och sidorna i `ui/View*.cpp`: hur allt ritas.
10. **`main.cpp`**: huvudloopen som binder ihop allt.

## Designmönster och idéer i koden

Det här är samma saker som i OOP-kursen, så koden går att använda som exempel.

### Polymorfism: `Question`

```cpp
class Question {
public:
    virtual ~Question() = default;
    virtual QuestionType type() const = 0;
    virtual bool isAnswered(const AnswerState& a) const = 0;
    virtual bool grade(const AnswerState& a) const = 0;
    virtual int points() const { return 1; }
};
class CodeQuestion : public Question { /* ... */ int points() const override { return 2; } };
```

Provet rättar med `q->grade(answer)` utan att veta vilken sorts fråga det är. En ny frågetyp betyder en ny
subklass, inte ändringar i provkoden.

### Factory Method: `makeQuestion` och `makeRunner`

```cpp
std::unique_ptr<LanguageRunner> makeRunner(Language lang, const Toolchain& tc) {
    switch (lang) {
        case Language::C:      return std::make_unique<CompiledRunner>(tc, Language::C);
        case Language::Cpp:    return std::make_unique<CompiledRunner>(tc, Language::Cpp);
        case Language::Python: return std::make_unique<PythonRunner>(tc);
    }
    return nullptr;
}
```

Resten av appen frågar bara efter "en runner för det här språket". Vilken klass det blir bestäms på ett ställe.

### Template Method: `LanguageRunner::run`

`run()` finns bara i basklassen och gör alltid samma sak: bygg, och kör om bygget lyckades.
Subklasserna bestämmer bara *hur* man bygger (`build()`): C och C++ kompilerar till en `.exe`, Python
sparar bara `main.py`. Därför ser kod i alla tre språk likadan ut för resten av appen.

### RAII: `Program`

Varje körning får en egen tillfällig mapp. `Program` äger mappen och tar bort den i sin destruktor, så den
städas bort även om något går fel på vägen. Ingen `delete` eller `remove` behövs någon annanstans.

### `std::unique_ptr` för ägarskap

`Lesson` äger sina frågor (`std::vector<std::unique_ptr<Question>>`). `CodeQuestion` delar sin `CodeTask`
med `std::shared_ptr<const CodeTask>`, eftersom samma uppgift kan användas på flera ställen.

### Bakgrundsjobb utan att fönstret fryser

Att kompilera tar en stund. Koden körs därför med `std::async`, och sidan kollar varje bildruta om svaret
är klart:

```cpp
labRun_ = std::async(std::launch::async, [=] { return makeRunner(l, tc)->run(code, input, 10000); });
// ... nästa bildruta:
if (labRun_.valid() && labRun_.wait_for(0ms) == std::future_status::ready) labResult_ = labRun_.get();
```

### Immediate mode-GUI

ImGui har inga knapp-objekt. Varje bildruta anropar du `if (ImGui::Button("Kör")) { ... }`, och funktionen
både ritar knappen och svarar på om den klickades. Därför är sidorna vanliga funktioner (`viewLesson()`,
`viewExam()`) som läser av tillståndet och ritar det. Byte av sida är bara att ändra `route_.screen`,
och `switch` i `App::frame()` väljer vilken funktion som körs.

## Bygga

Du behöver CMake 3.20+ och en C++17-kompilator.

```bash
cmake -S app -B build
cmake --build build --parallel
./build/Nollterm            # Windows: build\Nollterm.exe
```

På Windows fungerar Visual Studio 2022 ("Open folder" på `app/`) eller w64devkit med Ninja.
Appen letar upp `content/` och `assets/` genom att gå uppåt från mappen den ligger i, så den hittar dem
både när du kör från `build/` och i den packade zip-filen.

Bara kärnan, utan fönster (snabbt, och fungerar på en server):

```bash
cmake -S app -B build -DNOLLTERM_GUI=OFF
cmake --build build
./build/nollterm-check --selftest   # kompilatorerna fungerar
./build/nollterm-check --verify     # alla lösningsförslag klarar sina tester
./build/nollterm-check --stats      # antal lektioner och frågor per kurs
```

## Var sakerna sparas

- Framsteg: `%APPDATA%\Nollterm\progress.json` (Windows), `~/.local/share/nollterm/progress.json` (Linux).
- Kompilatorer: i den packade appen ligger de i `toolchain/w64devkit` och `toolchain/python` bredvid
  `Nollterm.exe`. Finns de inte där används `gcc`, `g++` och `python` från PATH.

## Inte gjort än

De interaktiva figurerna i lektionerna (minnesdiagram, pekarlek och liknande) finns bara i webbversionen.
I appen visas en ruta som säger det.
