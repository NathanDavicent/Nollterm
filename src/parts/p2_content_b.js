TOPICS.push(
/* ================================================================ 07 */
{
  id: "klasser", cat: "Objekt", min: 12,
  title: "Structs, klasser och objekt",
  lead: "Samla data som hör ihop, välj mellan stack och heap och skydda dina värden med inkapsling och konstruktorer.",
  src: ["Torsdag 16/10 – Klasser, structs, objekt"],
  date: "Tors 16/10",
  goals: [
    "Skapa structs i C och C++ och förklara vad en medlem är",
    "Skilja på objekt på stacken och på heapen, och använda . och ->",
    "Förklara skillnaden mellan struct och class, och public/private",
    "Skriva konstruktorer med initieringslista",
  ],
  blocks: [
    ["h", "Structs: data som hör ihop"],
    ["p", R`En <strong>struct</strong> samlar flera värden, ofta av olika typer, under ett namn. Varje värde kallas <strong>medlem</strong> (eller fält).`],
    ["code", "c", R`struct Device {
    int id;            // data-medlem
    char name[20];     // data-medlem
    float temperature; // data-medlem
};

struct Device d = {1, "Sensor A", 23.5f};   // i C skriver du "struct Device"
printf("%s: %.1f\n", d.name, d.temperature);`, "C"],
    ["p", R`I C++ kan en struct dessutom innehålla <strong>metoder</strong> (funktioner som hör till structen), och du behöver inte skriva <code>struct</code> framför typnamnet.`],
    ["code", "cpp", R`struct Device {
    int id;
    std::string name;
    float temperature;

    void printInfo() const {              // metod (funktionsmedlem)
        std::cout << "Device " << id << " (" << name << ") -> "
                  << temperature << " °C\n";
    }
};

Device d1 = {1, "Sensor A", 23.5f};       // en instans, ett objekt
d1.printInfo();`, "C++"],
    ["p", R`Definitionen av <code>Device</code> är en ritning. Varje <strong>instans</strong> (objekt) du skapar har sina egna värden på <code>id</code>, <code>name</code> och <code>temperature</code>.`],
    ["h", "Stack och heap"],
    ["p", R`All data i ett program lagras någonstans i minnet. Två områden är viktiga att känna till:`],
    ["table", ["", "Stack", "Heap"], [
      ["Skapas", R`automatiskt: <code>Device d1;</code>`, R`manuellt: <code>new Device{...}</code> eller <code>malloc</code>`],
      ["Frigörs", "automatiskt när funktionen avslutas", R`när du anropar <code>delete</code> (eller <code>free</code>)`],
      ["Används till", "lokala variabler, parametrar, temporära objekt", "objekt som ska leva längre än funktionen, eller när antalet är okänt"],
      ["Egenskaper", "snabb men begränsad i storlek", "flexibel, men du ansvarar för att frigöra"],
    ]],
    ["p", R`När du har en <strong>pekare</strong> till ett objekt använder du <code>-&gt;</code> istället för punkt. <code>d2-&gt;name</code> är kortform för <code>(*d2).name</code>.`],
    ["code", "cpp", R`Device d1 = {1, "Sensor A", 22.5f};              // stack
Device* d2 = new Device{2, "Sensor B", 25.0f};   // heap

std::cout << d1.name  << "\n";    // punkt för objekt
std::cout << d2->name << "\n";    // pil för pekare
std::cout << &d1 << " " << d2 << "\n";   // jämför adresserna

delete d2;          // annars minnesläcka
d2 = nullptr;`],
    ["note", "tip", R`I inbyggda system med lite RAM undviker man ofta heapen helt efter uppstart. Statisk eller stackbaserad allokering är förutsägbar och kan inte fragmentera minnet.`],
    ["h", "Från struct till class"],
    ["p", R`I C++ är <code>struct</code> och <code>class</code> nästan samma sak. Den enda skillnaden är standardåtkomsten:`],
    ["list", [
      R`I en <code>struct</code> är medlemmarna <strong>public</strong> om inget annat anges.`,
      R`I en <code>class</code> är medlemmarna <strong>private</strong> om inget annat anges.`,
    ]],
    ["p", R`Konventionen är att använda struct för enkla datapaket och class när objektet har regler för hur datan får användas.`],
    ["table", ["Åtkomst", "Vem kommer åt medlemmen"], [
      [R`<code>public</code>`, "alla, även kod utanför klassen"],
      [R`<code>private</code>`, "bara klassens egna metoder"],
      [R`<code>protected</code>`, "klassen och klasser som ärver från den (arv kommer senare)"],
    ]],
    ["h", "Inkapsling"],
    ["p", R`<strong>Inkapsling</strong> (encapsulation) betyder att klassen själv bestämmer hur dess data används. Gör <code>value</code> privat och låt ändringar gå via <code>setValue()</code>, så kan klassen garantera att värdet alltid är rimligt.`],
    ["code", "cpp", R`class Sensor {
private:
    float value = 0.0f;
public:
    bool setValue(float v) {
        if (v < 0.0f || v > 100.0f) return false;   // avvisa orimliga värden
        value = v;
        return true;
    }
    float getValue() const { return value; }
};`],
    ["list", [
      "Färre buggar: ingen utanför kan ändra känsliga värden direkt.",
      "Lättare att underhålla: gränssnittet är tydligt.",
      "Du kan byta implementation utan att resten av programmet påverkas.",
    ]],
    ["h", "Konstruktorer"],
    ["p", R`En <strong>konstruktor</strong> har samma namn som klassen och körs automatiskt när ett objekt skapas. Den sätter startvärden, så att ett objekt aldrig existerar i ett halvfärdigt läge. Initieringslistan efter kolonet sätter medlemmarna direkt.`],
    ["code", "cpp", R`class Device {
private:
    int id;
    std::string type;
    float value;
public:
    Device(int i, std::string t, float v)
        : id(i), type(t), value(v) {}           // initieringslista

    void setValue(float v) { value = v; }
    void print() const {
        std::cout << "Device " << id << " (" << type << "): " << value << "\n";
    }
};

int main() {
    Device d1(1, "Sensor A", 23.5f);   // konstruktorn anropas här
    d1.print();
}`],
    ["p", R`En klass kan ha flera konstruktorer (överlagring), så att objekt kan skapas på olika sätt:`],
    ["code", "cpp", R`Device() : id(0), type("Unnamed"), value(0.0f) {}                  // standard
Device(int i, std::string t) : id(i), type(t), value(0.0f) {}           // delvis
Device(int i, std::string t, float v) : id(i), type(t), value(v) {}     // full

Device a;                         // standard
Device b(2, "TempSensor");        // delvis
Device c(3, "Pressure", 101.3f);  // full`],
    ["note", "warn", R`Metoder som bara läser, som <code>print()</code>, markeras med <code>const</code> efter parentesen. Då kan de anropas på konstanta objekt och kompilatorn stoppar oavsiktliga ändringar.`],
    ["h", "Övningar"],
    ["ex", "struct Device", R`<p>Skapa en struct med <code>int id</code>, <code>string type</code>, <code>bool active</code> och <code>float value</code>. Skriv <code>void printDevice(Device d)</code>, skapa två objekt i <code>main</code> och skriv ut dem. Extra: läs in värden med <code>cin</code>.</p>`],
    ["ex", "Stack och heap", R`<ol><li>Skapa en Device på stacken och en på heapen.</li><li>Ändra <code>value</code> för båda.</li><li>Skriv ut <code>&amp;d1</code> och <code>d2</code> och jämför adresserna.</li><li>Diskutera: vilken allokering passar inbyggda system med lite minne?</li></ol>`],
    ["ex", "class Sensor", R`<p>Skapa en klass <code>Sensor</code> med privata medlemmar <code>id</code>, <code>unit</code> och <code>value</code>, en konstruktor som tar alla tre och en metod <code>printInfo()</code>. Skapa två sensorer i <code>main</code>.</p>`,
      R`class Sensor {
private:
    int id;
    std::string unit;
    float value;
public:
    Sensor(int i, std::string u, float v) : id(i), unit(u), value(v) {}
    void printInfo() const {
        std::cout << "Sensor " << id << ": " << value << " " << unit << "\n";
    }
};

int main() {
    Sensor s1(1, "°C", 22.5f);
    Sensor s2(2, "%RH", 41.0f);
    s1.printInfo();
    s2.printInfo();
}`, "cpp"],
    ["ex", "vector av devices", R`<p>Skapa en <code>vector&lt;Device&gt;</code> med flera objekt och en funktion som skriver ut alla. Tips: ta listan som <code>const vector&lt;Device&gt;&amp;</code>.</p>`],
    ["ex", "Utmaning: statusmeddelande", R`<p>Lägg till en metod som returnerar ett statusmeddelande beroende på <code>value</code>, till exempel "Sensor normal", "Warning: High value" eller "Offline".</p>`],
  ],
  quiz: [
    { q: R`Vad är den enda skillnaden mellan <code>struct</code> och <code>class</code> i C++?`, o: ["Structs kan inte ha metoder", "Standardåtkomsten: public i struct, private i class", "Klasser lagras alltid på heapen", "Structs kan inte ha konstruktorer"], a: 1,
      why: "I C++ kan båda ha metoder, konstruktorer och arv. Bara standardåtkomsten skiljer." },
    { q: R`<code>Device* d2 = new Device{2, "B", 25.0f};</code> Hur når du namnet?`, o: [R`<code>d2.name</code>`, R`<code>d2-&gt;name</code>`, R`<code>&amp;d2.name</code>`, R`<code>d2::name</code>`], a: 1,
      why: R`d2 är en pekare, så du använder <code>-&gt;</code>. Det är kortform för <code>(*d2).name</code>.` },
    { q: R`Vad händer om du glömmer <code>delete d2;</code>?`, o: ["Kompileringsfel", "Objektet raderas automatiskt när main slutar köra rader", "Minnet frigörs aldrig under körningen: en minnesläcka", "d2 flyttas till stacken"], a: 2,
      why: R`Heapminne frigörs bara när du gör det själv. I ett program som körs länge, som en IoT-enhet, kan läckor till slut ta slut på minnet.` },
    { q: "När körs en konstruktor?", o: ["När du anropar den manuellt med obj.Konstruktor()", "Automatiskt när objektet skapas", "När objektet förstörs", "Bara för objekt på heapen"], a: 1,
      why: R`<code>Device d1(1, "A", 23.5f);</code> anropar konstruktorn direkt. Det gör också <code>new Device(...)</code>.` },
    { q: R`Varför göra <code>value</code> private och ha en <code>setValue()</code>-metod?`, o: ["Det gör programmet snabbare", "Klassen kan kontrollera att värdet alltid är giltigt", "Private-medlemmar tar mindre minne", "Det krävs för att kunna använda konstruktorer"], a: 1,
      why: "Det är inkapsling: all ändring går via en metod som kan validera, logga eller avvisa värden." },
  ],
},

/* ================================================================ 08 */
{
  id: "headerfiler", cat: "Objekt", min: 8,
  title: "Headerfiler och projektstruktur",
  lead: "Dela upp koden i .h- och .cpp-filer så att projektet går att läsa, återanvända och jobba i tillsammans.",
  src: ["Torsdag 16/10 – Klasser, structs, objekt (del 4)", "Startkod för klasser och structs"],
  date: "Tors 16/10",
  goals: [
    "Skilja på deklarationer i headerfiler och definitioner i källfiler",
    "Skriva include guards och förstå varför de behövs",
    "Strukturera inlämningsuppgiften med DataManager och Measurement",
  ],
  blocks: [
    ["h", "Varför flera filer?"],
    ["p", R`När programmet växer blir en enda <code>main.cpp</code> svår att hitta i. Uppdelningen följer en enkel regel:`],
    ["list", [
      R`<strong>Headerfiler</strong> (<code>.h</code>/<code>.hpp</code>) innehåller <strong>deklarationer</strong>: vad som finns. Klassens medlemmar och funktionsprototyper.`,
      R`<strong>Källfiler</strong> (<code>.cpp</code>) innehåller <strong>definitioner</strong>: hur det fungerar.`,
    ]],
    ["p", "Det håller koden organiserad (en klass per filpar är standard), gör den återanvändbar, kan snabba upp kompileringen och låter flera personer jobba i olika filer samtidigt."],
    ["h", "Exempel: Sensor i tre filer"],
    ["code", "cpp", R`#ifndef SENSOR_H
#define SENSOR_H

#include <string>

class Sensor {
private:
    int id;
    std::string name;
    float value;
public:
    Sensor(int i, std::string n, float v);
    void setValue(float v);
    void printInfo() const;
};

#endif`, "sensor.h"],
    ["code", "cpp", R`#include <iostream>
#include "sensor.h"

Sensor::Sensor(int i, std::string n, float v)
    : id(i), name(n), value(v) {}

void Sensor::setValue(float v) {
    value = v;
}

void Sensor::printInfo() const {
    std::cout << "Sensor " << id << " (" << name << "): " << value << "\n";
}`, "sensor.cpp"],
    ["code", "cpp", R`#include "sensor.h"

int main() {
    Sensor s1(1, "TempSensor", 22.5f);
    s1.printInfo();
    s1.setValue(23.1f);
    s1.printInfo();
}`, "main.cpp"],
    ["p", R`<code>Sensor::</code> framför metodnamnet säger att definitionen hör till klassen Sensor. Utan det tror kompilatorn att du skriver en fristående funktion.`],
    ["code", "bash", R`g++ main.cpp sensor.cpp -o app     # alla .cpp-filer måste med
./app`, "kompilera flera filer"],
    ["note", "fix", R`Felet <code>undefined reference to Sensor::Sensor(...)</code> betyder nästan alltid att <code>sensor.cpp</code> inte kompilerades med. I Visual Studio: kontrollera att filen ligger under Source Files i projektet.`],
    ["h", "Include guards"],
    ["p", R`Om samma header inkluderas två gånger (direkt eller via en annan header) blir klassen definierad två gånger, och det är ett kompileringsfel. Include guards förhindrar det:`],
    ["code", "cpp", R`#ifndef DEVICE_H     // om DEVICE_H inte är definierat ...
#define DEVICE_H     // ... definiera det och ta med innehållet
// innehåll
#endif               // annars hoppas allt över

// Modernt alternativ som alla stora kompilatorer stöder:
#pragma once`],
    ["p", R`<code>#include "fil.h"</code> med citattecken letar först i projektets mappar. <code>#include &lt;string&gt;</code> med vinkelparenteser används för standard- och systembibliotek.`],
    ["h", "Startkod för inlämningsuppgiften"],
    ["p", "En rimlig struktur för datainsamlaren:"],
    ["code", "bash", R`Inlamning1/
├── main.cpp            programstart, menyn
├── measurement.h       structs: Measurement, Statistics
├── data_manager.h      klassdeklaration
└── data_manager.cpp    implementation`, "filstruktur"],
    ["code", "cpp", R`#ifndef MEASUREMENT_H
#define MEASUREMENT_H
#include <string>

struct Measurement {
    std::string timestamp;   // t.ex. "2025-10-07 10:00"
    float value;             // t.ex. temperatur
};

struct Statistics {
    float min;
    float max;
    float average;
    float stddev;
};

#endif`, "measurement.h"],
    ["code", "cpp", R`#ifndef DATA_MANAGER_H
#define DATA_MANAGER_H
#include "measurement.h"
#include <vector>
#include <string>

class DataManager {
private:
    std::vector<Measurement> measurements;
public:
    void addMeasurement(const Measurement& m);
    bool loadFromFile(const std::string& filename);
    bool saveToFile(const std::string& filename) const;
    Statistics calculateStatistics() const;
    void printMeasurements() const;
};

#endif`, "data_manager.h"],
    ["code", "cpp", R`#include "data_manager.h"
#include <iostream>
#include <fstream>
#include <sstream>
#include <cmath>

void DataManager::addMeasurement(const Measurement& m) {
    // TODO: lägg till m i measurements
}

bool DataManager::loadFromFile(const std::string& filename) {
    // TODO: öppna filen, läs rad för rad, skapa Measurement-objekt
    return true;
}

bool DataManager::saveToFile(const std::string& filename) const {
    // TODO: skriv alla mätningar till filen
    return true;
}

Statistics DataManager::calculateStatistics() const {
    Statistics stats{};
    // TODO: min, max, medel, standardavvikelse
    return stats;
}

void DataManager::printMeasurements() const {
    // TODO: loopa och skriv ut varje mätning
}`, "data_manager.cpp – kodskelett"],
    ["code", "cpp", R`#include "data_manager.h"
#include <iostream>

int main() {
    DataManager manager;
    manager.loadFromFile("data.csv");

    Measurement m1{"2025-10-07 09:00", 22.5f};
    manager.addMeasurement(m1);     // const& → ingen kopia av m1 skapas

    manager.printMeasurements();
    manager.saveToFile("data.csv");
    return 0;
}`, "main.cpp"],
    ["note", "tip", R`I Visual Studio: högerklicka på projektet → <strong>Add → New Item…</strong> → Header File (.h) eller C++ File (.cpp). Implementera en metod i taget och testa den i <code>main</code> innan du går vidare.`],
    ["h", "Övning"],
    ["ex", "Dela upp en klass", R`<ol><li>Dela upp din Device- eller Sensor-klass i <code>device.h</code> och <code>device.cpp</code>.</li><li>Kompilera och kör. Fungerar det fortfarande?</li><li>Reflektera: varför är det bra att skilja gränssnitt från implementation, och hur hjälper det när flera utvecklare jobbar tillsammans?</li></ol>`],
  ],
  quiz: [
    { q: "Vad hör hemma i en headerfil?", o: ["Hela implementationen av alla metoder", "Deklarationer: klassdefinitionen och funktionsprototyper", R`Bara <code>main()</code>`, "Testdata"], a: 1,
      why: R`Headern beskriver <em>vad</em> som finns. <code>.cpp</code>-filen beskriver <em>hur</em> det fungerar.` },
    { q: "Vad skyddar include guards mot?", o: ["Att headern ändras av misstag", "Att samma header tas med flera gånger, vilket ger omdefinitionsfel", "Att andra kan läsa koden", "Minnesläckor"], a: 1,
      why: R`<code>#ifndef/#define/#endif</code> (eller <code>#pragma once</code>) gör att innehållet bara tas med första gången.` },
    { q: R`Vad betyder <code>void Sensor::setValue(float v)</code> i sensor.cpp?`, o: ["Det anropar setValue", "Det är definitionen av metoden setValue som tillhör klassen Sensor", "Det skapar ett nytt Sensor-objekt", "Det är en deklaration"], a: 1,
      why: R`<code>::</code> är scope-operatorn. <code>Sensor::setValue</code> betyder "setValue i klassen Sensor".` },
    { q: R`Vad är skillnaden mellan <code>#include "sensor.h"</code> och <code>#include &lt;string&gt;</code>?`, o: ["Ingen skillnad", "Citattecken letar först i projektet, vinkelparenteser i standard- och systembibliotek", "Vinkelparenteser är bara för C", "Citattecken kräver include guards"], a: 1,
      why: "Egna headers inkluderas med citattecken, standardbiblioteket med vinkelparenteser." },
    { q: R`Du kör <code>g++ main.cpp -o app</code> och får "undefined reference to Sensor::Sensor". Varför?`, o: ["sensor.h saknar include guards", "sensor.cpp kompilerades inte med, så länkaren hittar inte definitionen", "Konstruktorn måste vara private", "main.cpp måste inkludera sensor.cpp"], a: 1,
      why: R`Headern räcker för att kompilera <code>main.cpp</code>, men länkaren behöver definitionerna. Kör <code>g++ main.cpp sensor.cpp -o app</code>.` },
  ],
},

/* ================================================================ 09 */
{
  id: "filhantering", cat: "Data", min: 9,
  title: "Filhantering",
  lead: "Spara sensordata till fil och läs in den igen, rad för rad, till structs i en vector.",
  src: ["Filhantering i C och C++", "Tisdag 21/10 – Felhantering, debugging, nästa steg (avsnitt 3)"],
  date: "Tis 21/10",
  goals: [
    "Öppna, läsa, skriva och stänga filer i C och i C++",
    "Kontrollera att filen faktiskt gick att öppna",
    "Läsa en CSV-fil till en vector av structs",
  ],
  blocks: [
    ["h", "Tre steg"],
    ["p", R`Filhantering (file I/O) följer samma mönster i båda språken: <strong>öppna</strong> filen, <strong>läs eller skriv</strong>, <strong>stäng</strong>. I IoT-program är det så sensordata loggas och analyseras i efterhand.`],
    ["h", "Filer i C"],
    ["p", R`Funktionerna finns i <code>&lt;stdio.h&gt;</code>. <code>fopen</code> returnerar en <code>FILE*</code>, eller <code>NULL</code> om filen inte gick att öppna.`],
    ["table", ["Läge", "Betyder"], [
      [R`<code>"r"</code>`, "läs, filen måste finnas"],
      [R`<code>"w"</code>`, "skriv, skapar filen eller tömmer den om den finns"],
      [R`<code>"a"</code>`, "lägg till sist (append), skapar filen om den saknas"],
    ]],
    ["code", "c", R`#include <stdio.h>

int main(void) {
    FILE* file = fopen("data.txt", "w");
    if (file == NULL) {
        perror("Kunde inte öppna filen");
        return 1;
    }
    fprintf(file, "Temperature: %.2f\n", 23.5);
    fclose(file);

    file = fopen("data.txt", "r");
    if (file == NULL) return 1;
    char line[128];
    while (fgets(line, sizeof(line), file) != NULL) {
        printf("%s", line);
    }
    fclose(file);
    return 0;
}`, "skriv och läs i C"],
    ["h", "Filer i C++"],
    ["p", R`I C++ använder du <code>&lt;fstream&gt;</code>: <code>std::ofstream</code> för att skriva och <code>std::ifstream</code> för att läsa. Strömmarna fungerar som <code>cout</code> och <code>cin</code>, och filen stängs automatiskt när objektet går ur scope.`],
    ["code", "cpp", R`#include <fstream>
#include <iostream>
#include <string>

int main() {
    std::ofstream out("data.txt");                 // std::ios::app för att lägga till
    if (!out) {
        std::cerr << "Kunde inte öppna filen!\n";
        return 1;
    }
    out << "Temperature: " << 23.5 << "\n";
    out.close();

    std::ifstream in("data.txt");
    if (!in.is_open()) return 1;
    std::string line;
    while (std::getline(in, line)) {
        std::cout << line << "\n";
    }
}`, "skriv och läs i C++"],
    ["code", "cpp", R`std::ofstream log("sensor_log.txt", std::ios::app);   // skriv inte över, lägg till
log << "2025-10-07 10:01,22.8\n";`, "append"],
    ["h", "Från textfil till datastruktur"],
    ["p", R`Mätdata sparas ofta som CSV, en mätning per rad:`],
    ["code", "bash", R`2025-10-07,22.5
2025-10-07,22.7
2025-10-07,22.8`, "sensor_data.csv"],
    ["p", R`Varje rad blir en <code>Measurement</code> i en vector. <code>std::stringstream</code> låter dig läsa från en sträng som om den vore en fil.`],
    ["code", "cpp", R`#include <fstream>
#include <sstream>
#include <vector>
#include <string>

struct Measurement {
    std::string timestamp;
    float value;
};

// const std::string&           → läser bara filnamnet
// std::vector<Measurement>&    → listan som ska fyllas på
bool loadData(const std::string& filename, std::vector<Measurement>& data) {
    std::ifstream file(filename);
    if (!file.is_open()) {
        std::cerr << "Fel: kunde inte öppna " << filename << "\n";
        return false;
    }
    std::string line;
    while (std::getline(file, line)) {
        std::stringstream ss(line);
        Measurement m;
        std::getline(ss, m.timestamp, ',');   // läs fram till kommatecknet
        if (ss >> m.value) {                   // hoppa över trasiga rader
            data.push_back(m);
        }
    }
    return true;
}

void printData(const std::vector<Measurement>& data) {
    for (const auto& m : data)
        std::cout << m.timestamp << " -> " << m.value << " °C\n";
}

int main() {
    std::vector<Measurement> data;
    if (!loadData("sensor_data.csv", data)) return 1;
    printData(data);
}`, "CSV → vector<Measurement>"],
    ["table", ["Kod", "Typ", "Syfte"], [
      [R`<code>const string&amp; filename</code>`, "konstant referens", "ingen kopia, kan inte ändras"],
      [R`<code>vector&lt;Measurement&gt;&amp; data</code>`, "referens", "funktionen fyller på listan"],
      [R`<code>const vector&lt;Measurement&gt;&amp; data</code>`, "konstant referens", "skickas till utskrift, ska inte ändras"],
      [R`<code>const auto&amp; m</code>`, "konstant referens i loop", "ingen kopia av varje Measurement"],
    ]],
    ["h", "Övningar"],
    ["ex", "Sensorloggning", R`<ol><li>Fråga användaren efter 5 temperaturer.</li><li>Spara dem i <code>temperatures.txt</code>, ett värde per rad.</li><li>Läs tillbaka filen och skriv ut medelvärdet.</li></ol><p>Extra: spara en tidsstämpel med varje värde, och använd <code>std::vector</code>.</p>`,
      R`#include <fstream>
#include <iostream>

int main() {
    {
        std::ofstream out("temperatures.txt");
        if (!out) { std::cerr << "Kan inte skriva\n"; return 1; }
        for (int i = 0; i < 5; i++) {
            float t;
            std::cout << "Temperatur " << i + 1 << ": ";
            std::cin >> t;
            out << t << "\n";
        }
    }   // out stängs här

    std::ifstream in("temperatures.txt");
    if (!in) { std::cerr << "Kan inte läsa\n"; return 1; }
    float t, sum = 0;
    int n = 0;
    while (in >> t) { sum += t; n++; }
    if (n > 0) std::cout << "Medel: " << sum / n << "\n";
}`, "cpp"],
    ["ex", "Räkna rader och medelvärde", R`<p>Skapa <code>tempdata.csv</code> med några rader. Ändra <code>loadData()</code> så att den räknar hur många rader som lästs, och skriv <code>float calcAverage(const vector&lt;Measurement&gt;&amp; data)</code>.</p>`],
  ],
  quiz: [
    { q: R`Vilket läge i <code>fopen</code> lägger till text sist utan att radera det som finns?`, o: [R`<code>"r"</code>`, R`<code>"w"</code>`, R`<code>"a"</code>`, R`<code>"x"</code>`], a: 2,
      why: R`<code>"a"</code> står för append. <code>"w"</code> tömmer filen först.` },
    { q: R`Vad returnerar <code>fopen</code> om filen inte kan öppnas?`, o: ["-1", "0.0", R`<code>NULL</code>`, "Ett tomt FILE-objekt"], a: 2,
      why: R`Kontrollera alltid <code>if (file == NULL)</code> innan du läser. <code>perror</code> skriver ut orsaken.` },
    { q: "Vilken klass använder du för att läsa från en fil i C++?", o: [R`<code>std::ofstream</code>`, R`<code>std::ifstream</code>`, R`<code>std::cin</code>`, R`<code>FILE*</code>`], a: 1,
      why: R`<code>i</code> = input (läsa), <code>o</code> = output (skriva).` },
    { q: R`I <code>std::getline(ss, m.timestamp, ',')</code> – vad gör <code>','</code>?`, o: ["Lägger till ett kommatecken", "Läser fram till kommatecknet, som fungerar som avgränsare", "Hoppar över första kommatecknet", "Byter kommatecken mot punkt"], a: 1,
      why: R`Det tredje argumentet är avgränsaren. Utan det läser <code>getline</code> fram till radslut.` },
    { q: R`Varför tar <code>loadData</code> parametern <code>std::vector&lt;Measurement&gt;&amp; data</code> utan <code>const</code>?`, o: ["Det är ett misstag", "Funktionen ska fylla på listan, så den måste få ändra den", "const fungerar inte med vector", "För att undvika en kopia av filnamnet"], a: 1,
      why: R`Referensen låter funktionen ändra anroparens vektor. <code>const</code> skulle förbjuda <code>push_back</code>.` },
  ],
},

/* ================================================================ 10 */
{
  id: "felhantering", cat: "Robusthet", min: 12,
  title: "Felhantering och debugging",
  lead: "Fånga fel innan de blir krascher, hitta buggar med debuggern och se hur samma idéer fungerar på en mikrokontroller.",
  src: ["Tisdag 21/10 – Felhantering, debugging, nästa steg", "Övningar: felhantering, debugging, filhantering"],
  date: "Tis 21/10",
  goals: [
    "Skilja på syntaxfel, körningsfel och logiska fel",
    "Hantera fel med returvärden i C och exceptions i C++",
    "Felsöka med utskrifter, breakpoints och assert",
    "Förklara hur felhantering skiljer sig i inbyggda system",
  ],
  blocks: [
    ["h", "Tre sorters fel"],
    ["table", ["Typ", "Exempel", "Upptäcks av"], [
      ["Syntaxfel", "saknat semikolon", "kompilatorn"],
      ["Körningsfel (runtime)", "division med noll, null-pekare", "programmet, under körning"],
      ["Logiskt fel", "fel formel, fel loopvillkor", "dig, när du testar"],
    ]],
    ["h", "Felhantering i C"],
    ["p", R`C har inga exceptions. Fel signaleras med <strong>returvärden</strong> (ofta <code>NULL</code>, <code>-1</code> eller 0) och ibland med den globala variabeln <code>errno</code>. Du måste själv kontrollera varje anrop som kan misslyckas.`],
    ["code", "c", R`FILE* file = fopen("data.txt", "r");
if (file == NULL) {
    perror("Kunde inte öppna filen");   // skriver ut orsaken från errno
    return 1;
}`],
    ["h", "Exceptions i C++"],
    ["p", R`I C++ kan en funktion <strong>kasta</strong> (throw) ett undantag när något går fel. Den som anropar <strong>fångar</strong> det med <code>try</code>/<code>catch</code>. Om ingen fångar det avslutas programmet.`],
    ["code", "cpp", R`#include <stdexcept>
#include <fstream>

void readFile(const std::string& filename) {
    std::ifstream file(filename);
    if (!file.is_open()) {
        throw std::runtime_error("Kunde inte öppna filen: " + filename);
    }
    std::cout << "Filen öppnades.\n";
}

float divide(float a, float b) {
    if (b == 0) throw std::invalid_argument("Division med noll");
    return a / b;
}

int main() {
    try {
        readFile("data.txt");
        std::cout << divide(10, 0) << "\n";
    } catch (const std::exception& e) {
        std::cerr << "Fel: " << e.what() << "\n";
    }
}`],
    ["h", "Robust inmatning"],
    ["p", R`Om användaren skriver "hej" när programmet väntar på ett tal hamnar <code>std::cin</code> i ett felläge, och alla följande inläsningar misslyckas. Återställ felflaggan och släng den felaktiga raden:`],
    ["code", "cpp", R`#include <limits>

int readNumber() {
    int n;
    while (true) {
        std::cout << "Ange ett tal: ";
        if (std::cin >> n) return n;
        std::cout << "Fel: ogiltig inmatning! Försök igen.\n";
        std::cin.clear();                                                    // återställ felflaggan
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');  // släng resten av raden
    }
}`, "readNumber() som aldrig kraschar"],
    ["h", "Statuskoder: felhantering för inbyggda system"],
    ["p", R`På mikrokontroller är exceptions ofta avstängda, eftersom de kostar kodstorlek och har svårförutsägbar körtid. Istället returnerar funktioner en statuskod, och resultatet skickas ut via en referens.`],
    ["code", "cpp", R`enum StatusCode { OK, SENSOR_ERROR, FILE_ERROR };

StatusCode readSensor(float& val) {
    int raw = std::rand() % 10;
    if (raw == 0) return SENSOR_ERROR;      // simulerat fel
    val = 20.0f + raw;
    return OK;
}

int main() {
    float v;
    for (int attempt = 1; attempt <= 3; attempt++) {      // enkel retry
        if (readSensor(v) == OK) {
            std::cout << "Värde: " << v << "\n";
            return 0;
        }
        std::cout << "Sensorfel, försök " << attempt << "\n";
    }
    return 1;
}`],
    ["h", "Debugging"],
    ["table", ["Metod", "Beskrivning"], [
      ["Print-debugging", R`skriv ut mellanresultat med <code>cout</code>, snabbt men ta bort efteråt`],
      ["Debugger (Visual Studio, gdb)", "stoppa, inspektera variabler, stega rad för rad"],
      ["Assertions", R`kontrollera antaganden med <code>assert()</code>`],
      ["Enhetstester", "testa små funktioner var för sig"],
    ]],
    ["h", "Debugger i Visual Studio", "vs"],
    ["list", [
      R`Klicka i vänstermarginalen för att sätta en <strong>breakpoint</strong>.`,
      R`<kbd>F5</kbd> startar med debugging.`,
      R`<kbd>F10</kbd> kör nästa rad (step over), <kbd>F11</kbd> går in i funktionen (step into).`,
      R`Fönstret <strong>Locals</strong> visar variablernas värden just nu.`,
      R`<kbd>F5</kbd> fortsätter, <kbd>Shift</kbd>+<kbd>F5</kbd> stoppar.`,
    ]],
    ["h", "Assertions"],
    ["code", "cpp", R`#include <cassert>

float divide(float a, float b) {
    assert(b != 0 && "Division med noll!");   // avbryter med radnummer om villkoret är falskt
    return a / b;
}`],
    ["note", "tip", R`<code>assert</code> är till för att fånga programmeringsfel under utveckling. Den stängs av när <code>NDEBUG</code> är definierat (vanligt i release-byggen), så använd den aldrig för att validera användarinput.`],
    ["h", "Hitta buggarna"],
    ["p", "Programmet ska räkna ut medelvärdet 6, men ger skräp. Hur många buggar hittar du?"],
    ["code", "cpp", R`float average(int arr[], int n) {
    int sum;
    for (int i = 0; i <= n; i++)
        sum += arr[i];
    return sum / n;
}

int main() {
    int numbers[5] = {2, 4, 6, 8, 10};
    std::cout << "Average = " << average(numbers, 5) << "\n";
}`, "buggy_average.cpp"],
    ["ex", "Visa buggarna och rättningen", R`<ol><li><strong>Oinitierad variabel:</strong> <code>int sum;</code> har ett okänt startvärde. Skriv <code>int sum = 0;</code>.</li><li><strong>Off-by-one:</strong> <code>i &lt;= n</code> läser <code>arr[5]</code>, utanför arrayen. Skriv <code>i &lt; n</code>.</li><li><strong>Heltalsdivision:</strong> <code>sum / n</code> med två int kapar decimalerna. Konvertera till float först.</li></ol>`,
      R`float average(const int arr[], int n) {
    if (n <= 0) return 0.0f;              // skydda mot division med noll
    int sum = 0;
    for (int i = 0; i < n; i++)
        sum += arr[i];
    return static_cast<float>(sum) / n;
}`, "cpp"],
    ["h", "Nästa steg: inbyggda system"],
    ["table", ["", "PC-program", "Inbyggt system"], [
      ["Miljö", "operativsystem", "inget eller minimalt OS"],
      ["Minne", "dynamisk allokering går bra", "ofta statiskt, strikt kontrollerat"],
      ["Felhantering", "exceptions möjliga", "oftast returkoder"],
      ["Debugging", "IDE, breakpoints", "seriell port, LED-signaler, JTAG"],
    ]],
    ["list", [
      "Fördjupa dig i pekare, arrayer och minneslayout.",
      "Lär dig CMake eller Makefile.",
      "Börja med Arduino, ESP32 eller STM32.",
      "Läs om bitmanipulation och registerhantering.",
      "Lär dig grunderna i UART, I2C och SPI.",
      "Öva realtidstänkande: loopar, timers och interrupts.",
    ]],
    ["h", "Övningar"],
    ["ex", "Hitta syntaxfelen", R`<p>Programmet nedan kompilerar inte. Fixa det, kör det och förklara vad som händer.</p>`,
      R`#include <iostream>
using namespace std;          // semikolon saknades

int main() {
    int a = 10;               // semikolon saknades
    int b = 0;
    cout << "Result: " << a / b << endl;   // kompilerar, men heltalsdivision med 0
}                                          // är odefinierat beteende och kraschar oftast`, "cpp"],
    ["ex", "Loggning med felhantering", R`<p>Läs temperatur, tryck och fuktighet från användaren och skriv varje post till <code>sensor_log.txt</code> med <code>std::ios::app</code>. Om filen inte kan öppnas: kasta ett undantag och fånga det i <code>main</code>. Utmaning: lägg till en tidsstämpel med <code>std::time_t</code>.</p>`],
    ["ex", "SensorAnalyzer", R`<p>Läs <code>data.csv</code> (datum,värde) till en <code>vector&lt;float&gt;</code>. Hoppa över felaktiga rader och räkna dem. Skriv ut medel, max, min och antal giltiga rader, och spara resultatet i <code>summary.txt</code>. Om filen saknas: skapa en ny med exempeldata.</p>`],
    ["ex", "Debugga calcAverage", R`<p>Programmet kraschar ibland. Förklara varför och rätta det.</p><pre style="background:var(--code-bg);border-radius:8px"><code>float calcAverage(vector&lt;float&gt; values) {
    float sum;
    for (int i = 0; i &lt;= values.size(); i++)
        sum += values[i];
    return sum / values.size();
}</code></pre>`,
      R`float calcAverage(const std::vector<float>& values) {  // const& istället för kopia
    if (values.empty()) return 0.0f;                     // tom fil → ingen division med 0
    float sum = 0.0f;                                    // initierad
    for (size_t i = 0; i < values.size(); i++)           // < istället för <=
        sum += values[i];
    return sum / values.size();
}`, "cpp"],
  ],
  quiz: [
    { q: "En beräkning ger fel svar men programmet kraschar inte. Vilken typ av fel är det?", o: ["Syntaxfel", "Körningsfel", "Logiskt fel", "Länkningsfel"], a: 2,
      why: "Programmet gör exakt vad koden säger, men koden säger fel sak. Sådana fel hittar du bara genom att testa." },
    { q: "Vilken tangent går in i en funktion när du stegar i Visual Studio?", o: [R`<kbd>F5</kbd>`, R`<kbd>F10</kbd>`, R`<kbd>F11</kbd>`, R`<kbd>Shift</kbd>+<kbd>F5</kbd>`], a: 2,
      why: "F11 = step into, F10 = step over (kör hela funktionsanropet som en rad), F5 = fortsätt." },
    { q: R`Vad är fel med <code>int sum; for (...) sum += arr[i];</code>?`, o: ["sum borde vara float", "sum är inte initierad och startar med ett okänt värde", "+= fungerar inte i loopar", "Inget"], a: 1,
      why: R`Lokala variabler får inget automatiskt startvärde. Skriv <code>int sum = 0;</code>.` },
    { q: "Varför används ofta statuskoder istället för exceptions i inbyggda system?", o: ["Exceptions finns inte i C++", "Exceptions kostar kodstorlek och körtid, och är ofta avstängda på mikrokontroller", "Statuskoder hittar fler buggar", "Exceptions fungerar bara med filer"], a: 1,
      why: "Returkoder är förutsägbara och billiga, och fungerar även i ren C." },
    { q: R`Vad gör <code>std::cin.clear()</code> efter en misslyckad inläsning?`, o: ["Tömmer konsolen", "Återställer felflaggan så att cin kan läsa igen", "Slänger resten av raden", "Avslutar programmet"], a: 1,
      why: R`<code>clear()</code> nollställer felläget. Den felaktiga texten ligger kvar i bufferten, så du behöver också <code>ignore()</code>.` },
  ],
},

/* ================================================================ 11 */
{
  id: "git", cat: "Samarbete", min: 8,
  title: "Git, GitHub och kodgranskning",
  lead: "Versionshantera din kod, jobba i branches och granska varandras pull requests.",
  src: ["Kom igång med Git och GitHub i Visual Studio", "Guide till kodgranskning och Git-flöde"],
  goals: [
    "Skapa ett repo, klona det och följa arbetsflödet pull, commit, push",
    "Skriva tydliga commit-meddelanden",
    "Arbeta i branches och skapa pull requests",
    "Ge konstruktiv feedback i en kodgranskning",
  ],
  blocks: [
    ["h", "Git och GitHub"],
    ["p", R`<strong>Git</strong> är ett versionshanteringssystem som sparar en historik över ändringarna i din kod. <strong>GitHub</strong> är en molntjänst där du lagrar dina Git-repon online. Tillsammans ger de dig historik, en trygg backup och möjlighet att samarbeta utan att skriva över varandras arbete.`],
    ["h", "Kom igång"],
    ["list", [
      R`På github.com: klicka <strong>New</strong>, döp repot (t.ex. <code>inlamning1</code>), välj Public eller Private, kryssa i <strong>Add a README file</strong> och klicka <strong>Create repository</strong>.`,
      R`I Visual Studio: startfönstret → <strong>Clone a repository</strong>, klistra in repots URL, välj en lokal mapp och klicka <strong>Clone</strong>.`,
    ]],
    ["h", "Det dagliga arbetsflödet"],
    ["code", "bash", R`git pull                         # 1. hämta det senaste från GitHub
# 2. arbeta, spara, testa
git add main.cpp                 # 3. stage: välj filer till nästa commit
git commit -m "Lägg till medelvärdesberäkning"   # 4. spara en version lokalt
git push                         # 5. skicka upp till GitHub`, "pull → arbeta → stage → commit → push"],
    ["table", ["Begrepp", "Vad det gör"], [
      ["Fetch", "kollar om det finns ändringar på GitHub, utan att hämta in dem"],
      ["Pull", "hämtar och slår ihop ändringarna med din lokala kod"],
      ["Stage / Add", "markerar ändrade filer som ska med i nästa commit"],
      ["Commit", "sparar en version (snapshot) lokalt, med ett meddelande"],
      ["Push", "laddar upp dina commits till GitHub"],
      ["Sync", "i Visual Studio: pull och push i ett steg"],
    ]],
    ["h", "Bra commit-meddelanden"],
    ["list", [
      "Korta och tydliga, helst under 50 tecken.",
      R`Börja med ett verb: "Lägg till", "Fixa", "Byt ut".`,
      R`Exempel: <code>Lägg till funktion för medelvärdesberäkning</code>.`,
      "Commita ofta: efter varje uppgift eller ny funktion.",
      "Pulla när du börjar dagens arbete, pusha innan du går från datorn.",
    ]],
    ["note", "warn", R`Kör alltid pull innan push. Om två personer har ändrat samma rader blir det en <strong>konflikt</strong>. Visual Studio markerar filerna, och du väljer manuellt vilka rader som ska behållas.`],
    ["h", "Branches och pull requests"],
    ["p", R`En <strong>branch</strong> är en separat utvecklingslinje där du kan bygga en ny funktion utan att påverka <code>main</code>. När du är klar skapar du en <strong>pull request</strong> (PR): "Jag vill slå ihop min branch med main. Kan någon granska den?"`],
    ["code", "bash", R`git checkout -b feature/removeDevice    # skapa och byt till ny branch
# ... implementera, testa ...
git add .
git commit -m "Lägg till removeDevice() med testfall"
git push origin feature/removeDevice     # skapa sedan en PR på GitHub`],
    ["h", "Kodgranskning"],
    ["p", "En kodgranskning betyder att någon läser och utvärderar koden innan den slås ihop. Målet är bättre kod tillsammans, inte att hitta någon att skylla på."],
    ["table", ["Område", "Fråga dig"], [
      ["Funktionalitet", "Gör koden det den ska? Testas olika indata och fel?"],
      ["Struktur", "Är koden uppdelad i små, begripliga funktioner? Finns onödig upprepning?"],
      ["Läsbarhet", "Är namnen tydliga? Följer koden samma stil som resten av projektet?"],
      ["Effektivitet", "Görs onödigt arbete i loopar? Används rätt datatyper och strukturer?"],
    ]],
    ["h", "Så granskar du en PR", "granska"],
    ["list", [
      "Läs titeln och beskrivningen: vad försöker ändringen lösa?",
      "Läs igenom hela flödet innan du kommenterar detaljer.",
      "Gå igenom varje funktion: vad tar den in, vad returnerar den?",
      "Leta efter out-of-bounds, null-pekare, fel typ och obehandlade fel.",
      "Kommentera direkt i koden. Var konkret och föreslå en förbättring.",
      R`När du är nöjd: <strong>Approve</strong> och merge.`,
    ]],
    ["note", "tip", R`Bra feedback är konkret och vänlig: "Kan den här funktionen delas upp i två? Den både läser filen och räknar statistik." Fråga dig själv: kan någon annan förstå den här koden nästa månad?`],
  ],
  quiz: [
    { q: "Vad gör en commit?", o: ["Laddar upp koden till GitHub", "Sparar en version lokalt, med ett meddelande", "Hämtar andras ändringar", "Skapar en ny branch"], a: 1,
      why: "Commit sparar lokalt. Push är det som laddar upp till GitHub." },
    { q: "Vad bör du göra innan push för att undvika konflikter?", o: ["Fetch", "Pull", "Ta bort branchen", "Skapa en ny commit"], a: 1,
      why: "Pull hämtar och slår ihop det andra har pushat, så att du löser eventuella konflikter lokalt." },
    { q: "Vilket kommando skapar en ny branch och byter till den?", o: [R`<code>git branch -d feature-temp</code>`, R`<code>git checkout -b feature-temp</code>`, R`<code>git push feature-temp</code>`, R`<code>git commit -b feature-temp</code>`], a: 1,
      why: R`<code>-b</code> skapar branchen. I nyare Git finns också <code>git switch -c feature-temp</code>.` },
    { q: "Vad är en pull request?", o: ["Ett sätt att hämta kod från GitHub", "En begäran om att slå ihop en branch med main, efter granskning", "En automatisk backup", "Ett felmeddelande från GitHub"], a: 1,
      why: "En PR samlar ändringarna i en branch så att andra kan granska och kommentera innan merge." },
    { q: "Vilken feedback är mest konstruktiv?", o: ["Det här är dålig kod.", "Kan funktionen delas upp i två? Den både läser filen och räknar statistik.", "Skriv om allt.", "LGTM"], a: 1,
      why: "Konkret, förklarar varför och föreslår en förbättring. Det är målet med en kodgranskning." },
  ],
}
);

/* ---------------------------------------------------------- lessons */
const LESSONS = [
  { d: "Vecka 39", t: "Introduktion, variabler och villkor", topics: ["kom-igang", "villkor"] },
  { d: "Tors 2/10", t: "Loopar och iteration · Inlämning 1 presenteras", topics: ["loopar"] },
  { d: "Tis 6/10", t: "Funktioner, pekare och referenser", topics: ["funktioner"] },
  { d: "Fre 10/10", t: "Arrayer, pekare, vektorer och maps", topics: ["arrayer-pekare", "c-strangar"] },
  { d: "Tors 16/10", t: "Klasser, structs och objekt · gruppuppgift", topics: ["klasser", "headerfiler", "git"] },
  { d: "Tis 21/10", t: "Felhantering, debugging och nästa steg", topics: ["filhantering", "felhantering"] },
];

/* ---------------------------------------------------------- assignments */
const ASSIGNMENTS = [
  {
    id: "inl1", kind: "Inlämningsuppgift 1", title: "Datainsamlare och analysverktyg för mätvärden",
    intro: R`I ett IoT-system samlar vi in mätvärden från sensorer (temperatur, luftfuktighet, tryck). Utveckla ett C/C++-program som hanterar en lista av mätvärden. Koden ska ligga i ett GitHub-repo och arbetet dokumenteras i repots README.`,
    groups: [
      { h: "1. Datainmatning", items: ["Användaren kan ange mätvärden manuellt", "Ogiltig input hanteras robust", "Utmaning: tillåt både hel- och decimaltal"] },
      { h: "2. Databehandling", items: ["Antal värden", "Summa", "Medelvärde", "Min- och maxvärde", "Varians och standardavvikelse"] },
      { h: "3. Menygränssnitt", items: ["Lägg till nya mätvärden", "Visa statistiken", "Sök efter ett visst värde", "Sortera listan (valfritt stigande/fallande)", "Avsluta programmet"] },
      { h: "4. Struktur och kvalitet", items: ["Uppdelat i flera funktioner eller metoder", "Väl kommenterad och dokumenterad kod", "Fel hanteras, t.ex. tom lista vid analys"] },
      { h: "5. Extra utmaningar för VG (välj en eller två)", items: ["Simulera en sensorström: slumpa temperaturer 20–30 °C och analysera", "Tidsstämpla mätningar och visa när högsta/lägsta värdet togs", "Tröskelvärdesanalys: räkna hur ofta värdet låg över eller under en gräns", "Glidande medelvärde över de senaste 3 eller 5 värdena, jämfört med totalen", "ASCII-histogram av mätvärdena i terminalen"] },
    ],
    grade: [["G", "Uppfyller krav 1–4 enligt specifikationen."], ["VG", "Har dessutom implementerat en eller två extra funktioner, beroende på komplexitet, och motiverat de tekniska valen i dokumentationen."]],
    topics: ["loopar", "funktioner", "arrayer-pekare", "headerfiler", "filhantering", "git"],
    hint: R`Statistik: variansen är medelvärdet av (x − medel)² och standardavvikelsen är roten ur variansen (<code>std::sqrt</code> i <code>&lt;cmath&gt;</code>).`,
  },
  {
    id: "grupp", kind: "Gruppuppgift, 3–4 personer", title: "IoT Device Manager",
    intro: R`Samarbeta kring ett litet IoT-program i C++ med klasser och structs, och öva på Git med branches och pull requests. Basprogrammet finns i kursens repo: <a href="https://github.com/CalleFreme/c-cpp-cj/blob/main/DeviceManager/DeviceManager/main.cpp" target="_blank" rel="noopener">DeviceManager/main.cpp</a>.`,
    groups: [
      { h: "Förberedelser", items: [R`En person skapar repot <code>iot-device-manager</code> på GitHub`, "Klona repot och skapa ett C++-projekt i Visual Studio i repots mapp", "Kopiera in basprogrammet", R`Första commit: "Init commit: Basprogram inlagt", och push`, "Övriga i gruppen klonar repot", "README.md med gruppnamn, projektbeskrivning och ansvarsfördelning"] },
      { h: "Uppgift", items: [R`Fördela metoder: <code>removeDevice(int id)</code>, <code>findDevice(int id)</code>, <code>updateValue(int id, float v)</code>, <code>getAverageValue()</code>, <code>printActiveDevices()</code>`, R`Var och en skapar en egen branch, t.ex. <code>feature/removeDevice</code>`, "Implementera och testa i main() innan du commitar", "Skriv tydliga commit-meddelanden", "Skapa en pull request och låt en gruppkamrat granska", "Merga till main när allt fungerar"] },
      { h: "Avslutning", items: ["Kör hela programmet tillsammans", "Diskutera hur samarbetet gick", "Reflektera kort över vad ni lärt er"] },
    ],
    topics: ["klasser", "git"],
  },
  {
    id: "labb", kind: "Labb", title: "Miniräknare med meny",
    intro: R`Bygg en miniräknare där menyn upprepas tills användaren väljer Avsluta.`,
    groups: [
      { h: "Grund", items: ["1. Addera två tal", "2. Subtrahera två tal", "3. Multiplicera två tal", "4. Dividera två tal (hantera division med noll)", "5. Avsluta"] },
      { h: "Extra", items: ["Potens (x^y) och rest (%)", "Program som frågar efter ålder och skriver ut kategori: barn, ungdom, vuxen, pensionär"] },
    ],
    topics: ["villkor", "loopar"],
  },
  {
    id: "rep", kind: "Repetition", title: "Diagnostiska repetitionsövningar",
    intro: R`Lös uppgifterna utan att titta på lösningar. Försök förklara vad varje rad gör, inte bara få rätt output.`,
    groups: [
      { h: "Variabler och villkor", items: ["Skriv ut en int, float, double och char", "Summa, skillnad, produkt och kvot av två inmatade tal", "Celsius till Fahrenheit", "Cirkelns area med en konstant för π", "Positivt, negativt eller noll", "Skottår", "Meny med switch: area, volym, avsluta"] },
      { h: "Loopar och funktioner", items: ["Summan av 1–100", "Största talet i en array med 5 heltal", "Medelvärde av användarinmatade tal", "Funktion som skriver ut det största av tre tal", "void-funktion som skriver ut en snygg meny"] },
      { h: "Pekare och referenser", items: ["Funktion som tar en int-pekare och ökar värdet med 10", R`<code>swap</code> med pekare och med referenser`, R`<code>getRange(float* min, float* max)</code>`, R`<code>printData(const vector&lt;int&gt;&amp; data)</code>`] },
      { h: "Större uppgifter", items: ["5 temperaturer → min, max och medel via funktioner", "Meny: summa av två tal, medel av tre tal, avsluta", "FizzBuzz med funktioner", "Standardavvikelse för en lista av tal"] },
    ],
    topics: ["kom-igang", "villkor", "loopar", "funktioner"],
  },
];

/* ---------------------------------------------------------- resources */
const SOURCES = [
  { k: "V39", t: "C/C++ – V39 Studiehäfte", d: "Setup, Hello World, variabler, operatorer, if/else, switch och menylabben.", topics: ["kom-igang", "villkor"] },
  { k: "2/10", t: "Torsdag 2/10 – Loopar", d: "for, while, do-while, iterationsmönster, vanliga fel och Inlämningsuppgift 1.", topics: ["loopar"] },
  { k: "6/10", t: "Tis 6/10 – Funktioner", d: "Parametrar, stacken, pekare, referenser, const och överlagring.", topics: ["funktioner"] },
  { k: "10/10", t: "Fredag 10/10 – Arrays, pekare, vektorer och maps", d: "Arrayer i minnet, pekararitmetik, std::vector, malloc, 2D-arrayer och std::map.", topics: ["arrayer-pekare"] },
  { k: "Övn", t: "Övningar: C-strängar, pekare och säker indata", d: "15 övningar med lösningsförslag om '\\0', fgets, strcmp och kommandotolkning.", topics: ["c-strangar"] },
  { k: "16/10", t: "Torsdag 16/10 – Klasser, structs, objekt", d: "Structs, stack och heap, class, åtkomst, konstruktorer, headerfiler och gruppuppgiften.", topics: ["klasser", "headerfiler"] },
  { k: "Mall", t: "Startkod för klasser och structs", d: "Filstruktur och kodskelett för DataManager och Measurement, plus tabellen om const, & och *.", topics: ["headerfiler", "funktioner"] },
  { k: "Guide", t: "Filhantering i C och C++", d: "fopen/fprintf/fclose, ifstream/ofstream och övningen sensorloggning.", topics: ["filhantering"] },
  { k: "21/10", t: "Tisdag 21/10 – Felhantering, debugging, nästa steg", d: "Feltyper, exceptions, CSV till struct, debugging, assert och embedded.", topics: ["felhantering", "filhantering"] },
  { k: "Övn", t: "Övningar: felhantering, debugging, filhantering", d: "12 övningar i tre nivåer, från syntaxfel till statuskoder.", topics: ["felhantering"] },
  { k: "Guide", t: "Kom igång med Git och GitHub i Visual Studio", d: "Skapa och klona repo, pull/commit/push och cheat sheet.", topics: ["git"] },
  { k: "Guide", t: "Guide till kodgranskning och Git-flöde", d: "Vad man tittar på, checklista, branches och pull requests.", topics: ["git"] },
  { k: "Övn", t: "Repetitionsövningar i C och C++", d: "Diagnostiska uppgifter om variabler, villkor, loopar, funktioner och pekare.", topics: ["kom-igang", "villkor", "loopar", "funktioner"] },
];
const LINKS = [
  { k: "Ref", t: "cppreference.com", u: "https://en.cppreference.com/w/", d: "Referensen kursen hänvisar till. Slå upp varje nytt begrepp här, både C och C++." },
  { k: "Repo", t: "Kursens GitHub-repo (c-cpp-cj)", u: "https://github.com/CalleFreme/c-cpp-cj", d: "Exempelkod, buggyLoops.cpp och DeviceManager-basprogrammet." },
  { k: "Git", t: "Pro Git (gratis bok)", u: "https://git-scm.com/book/sv/v2", d: "Hela Git-boken, delvis på svenska." },
  { k: "Docs", t: "Visual Studio: debugga C++", u: "https://learn.microsoft.com/visualstudio/debugger/getting-started-with-the-debugger-cpp", d: "Breakpoints, stegning och Locals-fönstret." },
];
