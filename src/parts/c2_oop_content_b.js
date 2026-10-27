OOP_TOPICS.push(
/* ---------------------------------------------------------------- 06 */
{
  id: "polymorfism", cat: "Polymorfism", min: 10, date: "Tors 6/11",
  title: "Polymorfism och abstrakta klasser",
  lead: "Programmera mot ett gemensamt gränssnitt och låt varje subklass bestämma beteendet: virtual, override, final och rena virtuella funktioner.",
  src: ["Torsdag 6/11 – Polymorfism, casting (avsnitt 1–3, 7–8)"],
  goals: [
    "Förklara vad som krävs för att en klass ska vara polymorf",
    R`Använda <code>virtual</code>, <code>override</code> och <code>final</code>`,
    "Skriva abstrakta klasser med rena virtuella funktioner",
    "Förklara varför basklassen behöver en virtuell destruktor",
  ],
  blocks: [
    ["h", "Varför polymorfism?"],
    ["p", R`Polymorfism låter oss programmera mot ett gemensamt gränssnitt och byta beteende under körning, utan en <code>switch</code> på typer. Vi skiljer <em>vad</em> som ska göras från <em>hur</em> varje subklass gör det. Samma kodväg kan driva helt olika IoT-enheter.`],
    ["code", "cpp", R`#include <iostream>
#include <memory>
#include <vector>

struct Device {
    virtual ~Device() = default;      // viktigt
    virtual void tick() = 0;          // ren virtuell (abstrakt)
};

struct TempSensor : Device {
    void tick() override { std::cout << "TempSensor läser av.\n"; }
};

struct LedActuator : Device {
    void tick() override { std::cout << "LedActuator blinkar.\n"; }
};

int main() {
    std::vector<std::unique_ptr<Device>> devices;
    devices.push_back(std::make_unique<TempSensor>());
    devices.push_back(std::make_unique<LedActuator>());
    for (auto& d : devices) d->tick();    // samma anrop, olika beteende
}`],
    ["p", R`För att en klass ska vara polymorf i C++ behöver den minst en <code>virtual</code>-funktion, och anropet måste ske via en <strong>pekare eller referens</strong> till basen.`],
    ["widget", "dispatch"],
    ["h", "virtual, override och final"],
    ["list", [
      R`Gör de funktioner <code>virtual</code> i basen där beteendet ska kunna specialiseras.`,
      R`Märk överskuggningar med <code>override</code>. Då kontrollerar kompilatorn att signaturen faktiskt matchar en virtuell funktion i basen.`,
      R`Använd <code>final</code> för att stoppa vidare överskuggning eller arv när det är avsiktligt.`,
      R`Ge polymorfa basklasser en <code>virtual</code> destruktor, så att <code>delete</code> via baspekare river hela objektet.`,
    ]],
    ["code", "cpp", R`struct Logger {
    virtual ~Logger() = default;
    virtual void write(const std::string& msg) = 0;
};

struct ConsoleLogger : Logger {
    void write(const std::string& msg) override { std::cout << msg << "\n"; }
};

struct QuietLogger final : Logger {          // går inte att ärva vidare
    void write(const std::string&) override {}
};`],
    ["note", "fix", R`Utan <code>override</code> blir ett stavfel eller en saknad <code>const</code> tyst en <em>ny</em> funktion som döljer basens, och den virtuella anropas aldrig. Med <code>override</code> blir det ett kompileringsfel.`],
    ["note", "warn", R`Om basens destruktor inte är virtuell och du gör <code>delete</code> via <code>Logger*</code> körs bara basens destruktor. Det är odefinierat beteende och läcker subklassens resurser.`],
    ["h", "Abstrakta klasser"],
    ["p", R`En klass med minst en ren virtuell funktion (<code>= 0</code>) är <strong>abstrakt</strong>. Den kan inte instansieras, bara ärvas. Den fungerar som ett kontrakt: varje konkret subklass måste implementera funktionerna.`],
    ["code", "cpp", R`struct Drawable {
    virtual ~Drawable() = default;
    virtual void draw() const = 0;

    void render() const {                 // icke-virtuell hjälpfunktion
        std::cout << "--- figur ---\n";
        draw();                           // anropar subklassens version
    }
};

struct Line : Drawable {
    void draw() const override { std::cout << "Ritar linje\n"; }
};
struct Circle : Drawable {
    void draw() const override { std::cout << "Ritar cirkel\n"; }
};

// Drawable d;     // FEL: abstrakt klass`],
    ["note", "tip", R`Håll gränssnittet minimalt. Några få väl valda virtuella funktioner är lättare att testa och underhålla.`],
    ["h", "Fallgropar och riktlinjer"],
    ["list", [
      R`Anropa aldrig virtuella funktioner från konstruktorer eller destruktorer. Där är virtuell dispatch i praktiken avstängd.`,
      R`Gör polymorfa basklasser lätta: virtuella funktioner och en virtuell destruktor, inga onödiga beroenden.`,
      R`Virtuell dispatch kostar ett indirekt hopp via en <strong>vtable</strong>. Oftast obetydligt, men kan märkas i tighta loopar på en mikrokontroller.`,
      R`Välj <code>enum class</code> istället för arv när typerna inte behöver olika data eller tillstånd och antalet fall är litet och slutet.`,
    ]],
    ["h", "Övningar"],
    ["ex", "render() för Drawable", R`<p>Bygg ut <code>Drawable</code> med en icke-virtuell <code>render()</code> som skriver en rubrik och anropar <code>draw()</code>. Lägg några figurer i en <code>std::vector&lt;std::unique_ptr&lt;Drawable&gt;&gt;</code> och anropa render på alla.</p>`],
    ["ex", "Icke-virtuell open()", R`<p>Lägg till en metod <code>open()</code> i <code>Logger</code> som inte gör något och inte är virtuell. När är det rimligt att en metod <em>inte</em> är virtuell?</p>`],
  ],
  quiz: [
    { q: "Vad krävs för polymorft beteende i C++?", o: ["Att klassen är en struct", "En virtuell funktion i basen, och anrop via pekare eller referens till basen", "Att alla medlemmar är public", "Att man använder new"], a: 1,
      why: "Utan virtual väljs funktionen vid kompilering utifrån den statiska typen." },
    { q: R`Vad gör <code>override</code>?`, o: ["Gör funktionen virtuell i basen", "Låter kompilatorn kontrollera att funktionen verkligen överskuggar en virtuell funktion", "Förhindrar arv", "Gör funktionen snabbare"], a: 1,
      why: "Stavfel eller fel signatur blir kompileringsfel istället för tysta buggar." },
    { q: R`Vad betyder <code>virtual void draw() const = 0;</code>?`, o: ["draw returnerar 0", "draw är en ren virtuell funktion och klassen blir abstrakt", "draw är private", "draw anropas aldrig"], a: 1,
      why: "Subklasserna måste implementera den, och basen kan inte instansieras." },
    { q: "Varför ska en polymorf basklass ha en virtuell destruktor?", o: ["För att kunna skapa objekt", "Så att delete via baspekare kör subklassens destruktor också", "För att få använda override", "Det behövs inte"], a: 1,
      why: R`Annars körs bara basens destruktor: odefinierat beteende och läckor.` },
    { q: R`Vad gör <code>final</code> på en klass?`, o: ["Gör klassen abstrakt", "Förhindrar att någon ärver från den", "Gör alla metoder const", "Tar bort vtablen"], a: 1,
      why: R`<code>struct QuietLogger final : Logger</code> kan inte vara basklass. final på en metod stoppar vidare överskuggning.` },
  ],
},

/* ---------------------------------------------------------------- 07 */
{
  id: "agande-casting", cat: "Polymorfism", min: 9, date: "Tors 6/11",
  title: "Slicing, ägande och dynamic_cast",
  lead: "Lagra polymorfa objekt rätt med unique_ptr, undvik object slicing, skapa objekt i fabriker och använd RTTI sparsamt.",
  src: ["Torsdag 6/11 – Polymorfism, casting (avsnitt 4–6)"],
  goals: [
    "Förklara object slicing och undvika det",
    R`Lagra polymorfa objekt i <code>std::vector&lt;std::unique_ptr&lt;Base&gt;&gt;</code>`,
    "Skriva en enkel fabriksfunktion",
    R`Använda <code>dynamic_cast</code> och <code>typeid</code>, och veta när de bör undvikas`,
  ],
  blocks: [
    ["h", "Object slicing"],
    ["p", R`Virtuell dispatch fungerar bara via pekare eller referenser till basen. Kopierar du ett subklassobjekt till en variabel av bastyp skärs den subklass-specifika delen bort. Det kallas <strong>object slicing</strong>.`],
    ["code", "cpp", R`struct Base {
    virtual ~Base() = default;
    virtual void f() const { std::cout << "Base\n"; }
};
struct Der : Base {
    void f() const override { std::cout << "Der\n"; }
};

int main() {
    Der d;
    Base b = d;      // slicing: b är en ren Base
    b.f();           // "Base"

    Base& r = d;     // referens: ingen kopia
    r.f();           // "Der"
}`],
    ["p", R`Därför fungerar inte <code>std::vector&lt;Base&gt;</code> för polymorfa objekt: varje element är en kopia av bastyp. Lagra pekare istället.`],
    ["h", "Ägande med unique_ptr"],
    ["p", R`I modern C++ undviker vi råa <code>new</code>/<code>delete</code>. <code>std::unique_ptr</code> ger exklusivt ägande: objektet förstörs automatiskt när pekaren försvinner. Behöver flera dela på ett objekt finns <code>std::shared_ptr</code>, men det ska motiveras.`],
    ["code", "cpp", R`#include <memory>

std::vector<std::unique_ptr<Device>> devices;
devices.push_back(std::make_unique<TempSensor>());
devices.push_back(std::make_unique<LedActuator>());
// inget delete behövs: vektorn äger objekten

auto p = std::make_unique<TempSensor>();
// auto q = p;              // FEL: unique_ptr kan inte kopieras
auto q = std::move(p);      // ägandet flyttas, p blir nullptr`],
    ["h", "Fabriker"],
    ["p", R`En fabriksfunktion samlar objektskapandet på ett ställe. Resten av koden behöver inte känna till de konkreta typerna.`],
    ["code", "cpp", R`struct Effect { virtual ~Effect() = default; virtual void apply() = 0; };
struct Slow : Effect { void apply() override { std::cout << "Slow\n"; } };
struct Burn : Effect { void apply() override { std::cout << "Burn\n"; } };

std::unique_ptr<Effect> makeEffect(int code) {
    switch (code) {
        case 1: return std::make_unique<Slow>();
        case 2: return std::make_unique<Burn>();
        default: return nullptr;
    }
}

int main() {
    std::vector<std::unique_ptr<Effect>> effects;
    effects.push_back(makeEffect(1));
    effects.push_back(makeEffect(2));
    for (auto& e : effects) if (e) e->apply();
}`],
    ["h", "RTTI, dynamic_cast och typeid"],
    ["p", R`RTTI (Run-Time Type Information) låter programmet fråga om typen under körning. Det fungerar bara på polymorfa typer, kostar lite vid körning och kan stängas av i kompilatorn (vanligt i inbyggda system).`],
    ["list", [
      R`<code>dynamic_cast&lt;Derived*&gt;(basePtr)</code> returnerar en pekare, eller <code>nullptr</code> om objektet inte är av den typen.`,
      R`<code>dynamic_cast&lt;Derived&amp;&gt;(baseRef)</code> kastar <code>std::bad_cast</code> vid fel.`,
      R`<code>typeid(obj)</code> ger ett <code>std::type_info</code>, mest användbart för loggning och diagnos.`,
    ]],
    ["code", "cpp", R`void maybeSpecialHandle(Device& d) {
    if (auto* led = dynamic_cast<LedActuator*>(&d)) {
        std::cout << "Särbehandlar LED\n";
        led->tick();
    } else {
        d.tick();
    }
}`],
    ["note", "warn", R`Behöver du ofta dynamic_cast är det ett tecken på att gränssnittet saknar en virtuell funktion. RTTI är rimligt i legacy-kod du inte får ändra, i testkod och verktyg, eller i dokumenterade specialfall.`],
    ["h", "Övningar"],
    ["ex", "Fabrik med strängar", R`<p>Ändra <code>makeEffect</code> så att den tar <code>"slow"</code> eller <code>"burn"</code>. Fundera på hur en <code>std::map&lt;std::string, std::function&lt;std::unique_ptr&lt;Effect&gt;()&gt;&gt;</code> med lambdas kan ersätta switchen.</p>`,
      R`std::unique_ptr<Effect> makeEffect(const std::string& name) {
    static const std::map<std::string, std::function<std::unique_ptr<Effect>()>> table = {
        {"slow", [] { return std::make_unique<Slow>(); }},
        {"burn", [] { return std::make_unique<Burn>(); }},
    };
    auto it = table.find(name);
    return it != table.end() ? it->second() : nullptr;
}`, "cpp"],
    ["ex", "Räkna LED-aktuatorer", R`<p>Skriv <code>int countLedActuators(const std::vector&lt;std::unique_ptr&lt;Device&gt;&gt;&amp; ds)</code> med dynamic_cast. Diskutera ett alternativ utan RTTI, till exempel en virtuell <code>kind()</code> som returnerar en enum class.</p>`],
  ],
  quiz: [
    { q: R`<code>Der d; Base b = d; b.f();</code> där f är virtuell. Vilken f körs?`, o: ["Der::f", "Base::f", "Båda", "Kompileringsfel"], a: 1,
      why: "b är en kopia av bastyp. Der-delen skars bort (slicing)." },
    { q: R`Varför passar inte <code>std::vector&lt;Base&gt;</code> för polymorfa objekt?`, o: ["vector kan inte lagra klasser", "Varje element kopieras till en Base och tappar sin subklassdel", "Det är för långsamt", "Base måste vara abstrakt"], a: 1,
      why: R`Använd <code>std::vector&lt;std::unique_ptr&lt;Base&gt;&gt;</code>.` },
    { q: R`Vad returnerar <code>dynamic_cast&lt;Led*&gt;(p)</code> om p inte pekar på en Led?`, o: ["Ett undantag", R`<code>nullptr</code>`, "Samma pekare", "En kopia"], a: 1,
      why: R`Pekarvarianten ger nullptr. Referensvarianten kastar <code>std::bad_cast</code>.` },
    { q: R`Vad händer med objektet när en <code>unique_ptr</code> går ur scope?`, o: ["Inget, du måste köra delete", "Objektet förstörs automatiskt", "Det flyttas till stacken", "Det kopieras"], a: 1,
      why: "unique_ptr äger objektet och frigör det i sin destruktor." },
    { q: "När är dynamic_cast mest motiverat?", o: ["I varje polymorft anrop", "När gränssnittet inte går att ändra, eller i test- och diagnoskod", "Istället för virtuella funktioner", "För att omvandla int till double"], a: 1,
      why: "Ofta är en extra virtuell funktion i basen en bättre lösning." },
  ],
},

/* ---------------------------------------------------------------- 08 */
{
  id: "designmonster", cat: "Designmönster", min: 11, date: "Tors 13/11",
  title: "Designmönster: Strategy, Observer och Factory",
  lead: "Beprövade lösningar på återkommande designproblem: utbytbara beteenden, aviseringar och kontrollerat objektskapande.",
  src: ["Torsdag 13/11 – Design Patterns intro (avsnitt 1–4)"],
  goals: [
    "Förklara vad ett designmönster är och inte är",
    "Använda Strategy för utbytbara beteenden",
    "Använda Observer för att meddela flera mottagare",
    "Centralisera objektskapande med Factory Method",
  ],
  blocks: [
    ["h", "Varför designmönster?"],
    ["p", "I större program återkommer samma frågor: hur skapar vi objekt kontrollerat, hur organiserar vi beroenden så att systemet blir lätt att ändra, och hur utökar vi beteende utan att förstöra befintlig kod?"],
    ["p", R`<strong>Designmönster är beprövade lösningar på återkommande problem i objektorienterad design.</strong> De är inte färdig kod, utan idéer: strukturer och relationer mellan klasser som brukar fungera.`],
    ["h", "Strategy: utbytbara beteenden"],
    ["p", R`Om en <code>Player</code> ska kunna attackera på många sätt och alla varianter hårdkodas blir klassen en jätteklass full av if-else. Strategy lyfter ut beteendet till egna klasser bakom ett gemensamt gränssnitt. Spelaren <em>har en</em> strategi som kan bytas under körning.`],
    ["list", [
      R`En abstrakt basklass definierar beteendet (<code>AttackStrategy</code>).`,
      R`Subklasser implementerar konkret logik (<code>SwordAttack</code>, <code>FireballAttack</code>).`,
      R`En kontextklass (<code>Player</code>) har en pekare till strategin och kan byta den.`,
    ]],
    ["code", "cpp", R`struct AttackStrategy {
    virtual ~AttackStrategy() = default;
    virtual int damage() const = 0;
};
struct SwordAttack : AttackStrategy {
    int damage() const override { return 10; }
};
struct FireballAttack : AttackStrategy {
    int damage() const override { return 15; }
};

class Player {
public:
    explicit Player(std::unique_ptr<AttackStrategy> a) : attack(std::move(a)) {}
    void setAttack(std::unique_ptr<AttackStrategy> a) { attack = std::move(a); }
    void attackTarget(Player& target) { target.takeDamage(attack->damage()); }
    int health() const { return health_; }
private:
    void takeDamage(int dmg) { health_ -= dmg; }
    int health_ = 100;
    std::unique_ptr<AttackStrategy> attack;
};

// plocka upp ett nytt vapen:
// hero.setAttack(std::make_unique<FireballAttack>());`],
    ["p", "Fördelar: nya attacktyper utan att ändra Player, logiken kan bytas under körning, och switch-monstren försvinner."],
    ["h", "Observer: avisering vid ändringar"],
    ["p", R`En sensor ändrar värde och flera delar av systemet (logg, display, larm) behöver veta det. Observer låter ett objekt annonsera händelser till många mottagare <em>utan att känna till dem</em>.`],
    ["list", [
      R`<strong>Subject</strong> (observable) håller en lista med observers och meddelar dem.`,
      R`<strong>Observer</strong> är ett gränssnitt med en funktion som anropas vid förändring.`,
    ]],
    ["code", "cpp", R`struct Observer {
    virtual ~Observer() = default;
    virtual void onNotify(int value) = 0;
};

class Sensor {
public:
    void addObserver(Observer* obs) { observers.push_back(obs); }
    void newReading(int v) { value = v; notifyAll(); }
private:
    void notifyAll() { for (auto* o : observers) o->onNotify(value); }
    int value = 0;
    std::vector<Observer*> observers;
};

struct Logger : Observer {
    void onNotify(int v) override { std::cout << "Logg: sensorvärde = " << v << "\n"; }
};
struct Alarm : Observer {
    void onNotify(int v) override { if (v > 30) std::cout << "LARM! " << v << "\n"; }
};`],
    ["note", "warn", R`Sensorn lagrar råa pekare men äger inte sina observers. Se till att en observer lever minst lika länge som sensorn, eller avregistrera den innan den förstörs.`],
    ["h", "Factory Method: kontrollerat objektskapande"],
    ["p", R`Utan fabrik sprids <code>new TempSensor()</code> och if-kedjor över hela koden. En fabrik samlar skapandet på ett ställe och fungerar bra ihop med enum class och menyval.`],
    ["code", "cpp", R`enum class SensorType { Temperature, Humidity };

std::unique_ptr<Sensor> makeSensor(SensorType type) {
    switch (type) {
        case SensorType::Temperature: return std::make_unique<TempSensor>();
        case SensorType::Humidity:    return std::make_unique<HumiditySensor>();
    }
    return nullptr;
}`],
    ["p", "Fördelar: centraliserat skapande, och hierarkin kan byggas ut utan att resten av systemet ändras. I större system kan fabriken vara ett eget objekt."],
  ],
  quiz: [
    { q: "Vad är ett designmönster?", o: ["Ett färdigt bibliotek", "En beprövad idé för hur klasser kan organiseras för att lösa ett återkommande problem", "En kodstandard för indentering", "Ett UML-diagram"], a: 1,
      why: "Mönster beskriver strukturer och relationer, inte färdig kod." },
    { q: "Vilket problem löser Strategy?", o: ["Att bara en instans finns", "Att beteenden ska kunna bytas ut utan att ändra klassen som använder dem", "Att översätta gränssnitt", "Att spara objekt till fil"], a: 1,
      why: "Player har en AttackStrategy som kan bytas under körning." },
    { q: "I Observer: vem känner till vem?", o: ["Observers känner till alla andra observers", "Subjektet känner bara till Observer-gränssnittet, inte de konkreta mottagarna", "Subjektet måste känna till Logger", "Ingen känner till någon"], a: 1,
      why: "Därför kan nya mottagare läggas till utan att subjektet ändras." },
    { q: "Vad är huvudfördelen med Factory Method?", o: ["Snabbare objekt", "Objektskapandet samlas på ett ställe, så resten av koden slipper känna till konkreta typer", "Objekten blir const", "Den ersätter arv"], a: 1,
      why: "Ny sensortyp = ändra fabriken, inte varje ställe som skapar sensorer." },
    { q: R`Varför tar <code>Player</code> en <code>std::unique_ptr&lt;AttackStrategy&gt;</code>?`, o: ["För att unique_ptr är snabbare än int", "Player äger sin strategi, och den måste nås via pekare för polymorfism", "För att AttackStrategy inte får ha virtuella funktioner", "För att kunna kopiera Player"], a: 1,
      why: "Pekaren ger polymorfism och unique_ptr gör ägandet tydligt." },
  ],
},

/* ---------------------------------------------------------------- 09 */
{
  id: "singleton-adapter", cat: "Designmönster", min: 8, date: "Tors 13/11",
  title: "Singleton och Adapter",
  lead: "En enda, kontrollerad instans, och när det är en dålig idé. Plus Adapter för att koppla ihop gränssnitt som inte passar.",
  src: ["Torsdag 13/11 – Design Patterns intro (avsnitt 5–6)"],
  goals: [
    "Skriva en trådsäker Singleton i modern C++",
    "Avgöra när Singleton passar och när det är en antipattern",
    "Känna till alternativ som dependency injection",
    "Använda Adapter för att anpassa ett befintligt gränssnitt",
  ],
  blocks: [
    ["h", "Vad är Singleton till för?"],
    ["p", R`Ibland ska det bara finnas <strong>en</strong> instans: en global logger, en spelmotor, en konfigurationshanterare. Singleton ser till att endast ett objekt kan skapas, att det är globalt åtkomligt och att det skapas först när det behövs (lazy initialization).`],
    ["h", "Modern, trådsäker Singleton"],
    ["code", "cpp", R`class Logger {
public:
    static Logger& instance() {
        static Logger inst;        // skapas första gången, trådsäkert sedan C++11
        return inst;
    }
    void log(const std::string& msg) { std::cout << "[LOG] " << msg << "\n"; }

private:
    Logger() = default;                          // privat konstruktor
    Logger(const Logger&) = delete;              // ingen kopiering
    Logger& operator=(const Logger&) = delete;
};

Logger::instance().log("Programmet startar...");
// Logger x;           // FEL: konstruktorn är privat
// Logger y = Logger::instance();   // FEL: kopiering är borttagen`],
    ["list", [
      R`Den lokala <code>static</code>-variabeln skapas vid första anropet. C++11 garanterar att det är trådsäkert.`,
      "Privat konstruktor och borttagna kopieringsfunktioner gör instance() till enda vägen till objektet.",
    ]],
    ["h", "När passar Singleton?"],
    ["table", ["Bra", "Dåligt"], [
      ["en global logger", "nästan allt annat"],
      ["konfiguration som läses en gång", "för att slippa skicka parametrar"],
      ["spelmotor, resurshanterare, input", "objekt som behöver bytas ut i tester"],
    ]],
    ["p", R`Singletons blir lätt en gömd global variabel: svåra att byta ut i tester, svåra att mocka, och de döljer beroenden. I stora system anses de ofta vara en <strong>antipattern</strong> om de används utan försiktighet.`],
    ["h", "Vanliga misstag"],
    ["list", [
      "För mycket ansvar i en Singleton.",
      "Singleton bara för att slippa skicka parametrar.",
      "Hela programmet byggs runt global delad state.",
      "Singletons som är omöjliga att testa.",
      R`Den gamla varianten med en statisk pekare på heapen istället för <code>static</code> lokal variabel.`,
    ]],
    ["h", "Alternativ"],
    ["code", "cpp", R`// Dependency injection: beroendet skickas in och syns i signaturen
class Game {
public:
    explicit Game(GameConfig& config) : config_(config) {}
private:
    GameConfig& config_;
};

// Tillståndslös hjälpkod behöver ingen klass alls
namespace MathUtil {
    double clamp(double v, double lo, double hi) { return v < lo ? lo : v > hi ? hi : v; }
}

// Eller: ett Application-objekt i main äger alla system och skickar referenser`],
    ["h", "Adapter: få gränssnitt att passa"],
    ["p", R`Ett bibliotek eller äldre kod kan ha ett annat gränssnitt än ditt system förväntar sig. En <strong>Adapter</strong> implementerar ditt gränssnitt och översätter anropen till det gamla.`],
    ["code", "cpp", R`class OldSensorLib {               // kan inte ändras
public:
    double readValue();
};

class ISensor {                     // det vårt system använder
public:
    virtual ~ISensor() = default;
    virtual double read() = 0;
};

class OldSensorAdapter : public ISensor {
public:
    explicit OldSensorAdapter(OldSensorLib os) : old(os) {}
    double read() override { return old.readValue(); }   // översätt
private:
    OldSensorLib old;
};`],
  ],
  quiz: [
    { q: "Varför är Singletonens konstruktor privat?", o: ["För att göra den snabbare", "Så att ingen utanför klassen kan skapa fler instanser", "För att kunna ärva", "För att den ska vara virtuell"], a: 1,
      why: R`Enda vägen till objektet blir <code>instance()</code>.` },
    { q: R`Vad gör <code>static Logger inst;</code> inuti <code>instance()</code>?`, o: ["Skapar en ny logger varje anrop", "Skapar loggern vid första anropet och återanvänder den sedan", "Skapar loggern innan main startar", "Ger kompileringsfel"], a: 1,
      why: "Lazy initialization, och C++11 garanterar att den är trådsäker." },
    { q: "Vilket är ett bra användningsområde för Singleton?", o: ["Varje sensor i systemet", "En global konfiguration som bara ska läsas en gång", "Alla spelare i ett spel", "För att slippa skicka parametrar"], a: 1,
      why: "Ett exempel ur materialet: Config::instance().getStartHealth()." },
    { q: "Vad är en nackdel med Singleton?", o: ["Den tar mycket minne", "Den döljer beroenden och är svår att byta ut i tester", "Den kan inte ha metoder", "Den måste vara abstrakt"], a: 1,
      why: "Därför är dependency injection ofta ett bättre val." },
    { q: "Vilket problem löser Adapter?", o: ["För många instanser", "Ett befintligt gränssnitt passar inte det ditt system förväntar sig", "Objekt som skapas på fel ställe", "Aviseringar till många mottagare"], a: 1,
      why: "OldSensorAdapter implementerar ISensor och översätter read() till readValue()." },
  ],
},

/* ---------------------------------------------------------------- 10 */
{
  id: "git-samarbete", cat: "Samarbete", min: 7, date: "Labb",
  title: "Samarbete med Git: branches och pull requests",
  lead: "Feature branches, små commits, pull requests och code review, i ett mini-projekt i par.",
  src: ["Samarbete med git – branches, merging, PRs"],
  goals: [
    "Skapa en feature branch per ändring",
    "Göra små commits med meddelanden som förklarar varför",
    "Öppna en pull request och göra code review",
    "Undvika de vanligaste misstagen i ett delat repo",
  ],
  blocks: [
    ["h", "Arbetsflödet"],
    ["code", "bash", R`# 1. skapa en branch för EN ändring
git checkout -b feature/add-heal-spell

# 2. implementera, testa att det kompilerar, gör små commits
git add .
git commit -m "Add heal spell so mages can restore HP"

# 3. pusha branchen
git push -u origin feature/add-heal-spell

# 4. öppna en Pull Request på GitHub, tilldela din partner som reviewer
# 5. efter review och godkännande: merge via GitHub, sedan lokalt:
git checkout main
git pull`],
    ["p", R`<strong>Regel:</strong> en feature branch = en ändring eller en deluppgift. Gör inte allt på samma branch.`],
    ["h", "Pull request och code review"],
    ["p", R`I PR-beskrivningen skriver du vad du lagt till, varför, och om något är oklart. Granskaren kommenterar specifika rader, ställer frågor och föreslår förbättringar i GitHubs review-verktyg. När allt är åtgärdat godkänner partnern och PR:en mergas.`],
    ["h", "Vanliga misstag"],
    ["list", [
      "Stora branches med 300 rader ändringar.",
      "För sena commits.",
      R`Dåliga commit-meddelanden, som "fix".`,
      "PR utan beskrivning.",
      "Merge direkt till main utan review.",
      "Båda jobbar på samma branch.",
      "Konflikter som får växa sig stora.",
      "Pusha utan att testa.",
    ]],
    ["h", "Mini-projekten"],
    ["table", ["Projekt", "Minimikrav", "Förslag på feature branches"], [
      ["A. Mini-RPG Combat", R`<code>Character</code> med inkapslade stats, <code>Warrior</code> och <code>Mage</code> med polymorfa attacker, turbaserad stridsloop`, "print-ui, mage-spell, items, crit-chance"],
      ["B. SmartHome", R`basklass <code>Device</code>, subklasser <code>Lamp</code>, <code>Thermostat</code>, <code>Fan</code>, polymorf <code>update()</code>/<code>status()</code>, <code>vector&lt;unique_ptr&lt;Device&gt;&gt;</code>`, "fan-mode (enum), schedules, room (komposition), logging (Singleton)"],
      ["C. Marketplace Shop", R`<code>Item</code>, <code>Customer</code>, <code>VIPCustomer</code> med rabatt, <code>Shop</code> som säljer så länge lagret räcker`, "discount-code, out-of-stock-log, csv-load, receipt"],
    ]],
    ["note", "tip", R`Bygg grunden tillsammans först: tomma klasser och en main som kompilerar. Sedan tar ni varsin feature branch. Mindre risk för konflikter.`],
  ],
  quiz: [
    { q: "Hur många ändringar bör en feature branch innehålla?", o: ["Alla ändringar för veckan", "En ändring eller deluppgift", "Minst 300 rader", "Det spelar ingen roll"], a: 1,
      why: "Små branches är lätta att granska och ger färre konflikter." },
    { q: "Vad bör ett bra commit-meddelande förklara?", o: ["Bara vilka filer som ändrats", "Vad som ändrats och varför", "Vem som skrev koden", "Datumet"], a: 1,
      why: R`"Add heal spell so mages can restore HP" säger mer än "fix".` },
    { q: R`Vad gör <code>git push -u origin feature/x</code>?`, o: ["Raderar branchen", "Pushar branchen och kopplar den lokala branchen till den på GitHub", "Mergar till main", "Skapar en PR automatiskt"], a: 1,
      why: R`<code>-u</code> sätter upstream så att senare <code>git push</code> och <code>git pull</code> vet vart de ska.` },
    { q: "Vem bör godkänna en PR innan merge?", o: ["Den som skrev koden", "En annan person, efter code review", "Ingen", "GitHub automatiskt"], a: 1,
      why: "Merge till main utan review är ett av de vanliga misstagen." },
    { q: "Vad gör du efter att PR:en mergats på GitHub?", o: ["Inget", R`<code>git checkout main</code> och <code>git pull</code>`, "Raderar repot", R`<code>git push --force</code>`], a: 1,
      why: "Då får du in den mergade koden lokalt innan nästa feature branch." },
  ],
}
);

/* ---------------------------------------------------------------- timeline, assignments, sources */
const OOP_LESSONS = [
  { d: "Tis 28/10", t: "Kursstart: klasser och egna typer", topics: ["klasser-typer"] },
  { d: "Tors 30/10", t: "Inkapsling, komposition och UML", topics: ["inkapsling", "komposition-uml"] },
  { d: "Tis 4/11", t: "Arv och enums", topics: ["arv", "enums"] },
  { d: "Tors 6/11", t: "Polymorfism och casting · Terminal Game-labben", topics: ["polymorfism", "agande-casting"] },
  { d: "Tors 13/11", t: "Designmönster", topics: ["designmonster", "singleton-adapter"] },
  { d: "Labb", t: "Samarbete med Git", topics: ["git-samarbete"] },
];

const OOP_ASSIGNMENTS = [
  {
    id: "terminalgame", kind: "Labb, grupp om 3", title: "OOP-design i ett terminalspel",
    intro: R`Bygg vidare på ett textbaserat spel med <code>Player</code>, den abstrakta basklassen <code>Effect</code> och effekterna <code>Slow</code> och <code>Burn</code>. Målet är ett interaktivt spel där två spelare turas om att välja handlingar. Ca 3 timmar.`,
    groups: [
      { h: "A. Förstå basprogrammet", items: ["Kompilera och kör, se hur Slow och Burn appliceras", "Hitta var polymorfismen används", R`Diskutera: vad betyder <code>virtual</code> och <code>override</code> här?`, R`Diskutera: varför <code>unique_ptr</code> i vektorn?`, "Diskutera: varför har Effect en virtuell destruktor?"] },
      { h: "B. Två spelare och turordning", items: [R`Lägg till <code>Player player2("Villain")</code>`, "Spel-loop där spelarna turas om: 1. Attack, 2. Effekt", R`Använd <code>makeEffect(EffectType::Burn)</code> och <code>effect-&gt;apply(player2)</code>`, R`Byt tur med <code>std::swap(player1, player2)</code>`] },
      { h: "C. Fler effekter", items: ["Ny effektklass som ärver Effect (Heal, Poison, Freeze eller Shield)", R`Uppdatera <code>enum class EffectType</code>`, R`Uppdatera <code>makeEffect()</code> med ett nytt case`, "Låt spelaren välja effekttyp vid inmatning"] },
      { h: "D. Unik vidareutveckling (välj 1–3)", items: [R`Nya klasser: <code>Weapon</code>, <code>Item</code> eller <code>Spell</code> med mana`, R`Nya strukturer: <code>struct Stats</code> eller <code>TurnResult</code>`, R`Enums: <code>enum class Action { Attack, Cast, Wait }</code> eller <code>Status { Normal, Frozen, Poisoned }</code>`, R`Design: abstrakt <code>Entity</code> som Player och Enemy ärver, och effekter på vilken Entity som helst`] },
      { h: "E. Test och reflektion", items: ["Spela några rundor och diskutera de polymorfa anropen", "Hur lätt är det att lägga till nya effekter?", "Hur skulle ni spara och läsa in spelstatus från fil?", "Skriv ner 2–3 saker ni lärt er om arv, enums och OOP-design"] },
    ],
    topics: ["arv", "enums", "polymorfism", "agande-casting"],
    hint: R`Strategy-mönstret passar för Weapon, och en fabrik med <code>enum class EffectType</code> håller main-loopen fri från new.`,
  },
  {
    id: "gitprojekt", kind: "Parövning", title: "Samarbete med Git: mini-projekt",
    intro: R`Välj projekt A (Mini-RPG Combat), B (SmartHome) eller C (Marketplace Shop) och bygg det i par med feature branches, pull requests och code review.`,
    groups: [
      { h: "Grund", items: ["En person skapar repot, båda klonar", "Bygg tomma klasser och en main som kompilerar", "Uppfyll projektets minimikrav"] },
      { h: "Per feature", items: [R`Ny branch: <code>git checkout -b feature/…</code>`, "Liten, sammanhängande ändring som kompilerar", "Små commits med tydliga meddelanden", R`<code>git push -u origin feature/…</code>`, "PR med beskrivning, partnern som reviewer", "Åtgärda kommentarer, godkänn och merga", R`<code>git checkout main</code> och <code>git pull</code>`] },
      { h: "Avslutande", items: ["Branch som lägger till en ny klass i hierarkin, en enum, en polymorf metod eller komposition", "Korsvis code review"] },
    ],
    topics: ["git-samarbete", "polymorfism", "designmonster"],
  },
  {
    id: "dag1", kind: "Övningar", title: "Dag 1: klasser och structs i egna filer",
    intro: R`Trygghet i att definiera egna typer och dela upp dem i .h och .cpp. Inget arv än.`,
    groups: [
      { h: "Block 1", items: ["Position.h/.cpp med move() och print()", "Device.h/.cpp med konstruktor, rename() och printInfo()"] },
      { h: "Block 2", items: ["SensorReading med print()", "Sensor med read() och getName()", "Logger med log()"] },
      { h: "Block 3", items: ["AirSensor och AirMonitor med logAll()", "Car och ParkingHouse med addCar, removeCar och printStatus"] },
      { h: "Block 4 och extra", items: ["Diskutera reflektionsfrågorna", "Läs in Car eller Sensor från användaren med std::cin", "Felhantering: ogiltigt registreringsnummer, orimligt sensorvärde", R`Enhetstest med <code>assert</code> för Sensor::read() eller removeCar()`] },
    ],
    topics: ["klasser-typer", "komposition-uml"],
  },
  {
    id: "enumovn", kind: "Övningar", title: "enum och enum class",
    intro: "Fem övningar från magiska tal till menyer med enum class.",
    groups: [
      { h: "Övningar", items: ["Veckodagar med enum och switch", "Gör om till enum class och testa today == 2", R`<code>Direction</code> med <code>toString()</code> och användarval`, R`<code>Machine</code> med <code>MachineState</code> och printStatus()`, R`Meny med <code>MenuOption</code> och en mappningsfunktion`] },
    ],
    topics: ["enums"],
  },
];

const OOP_SOURCES = [
  { k: "28/10", t: "Tisdag 28/10 – Klasser", d: "Kursstart, typer, struct och class, kursens mål, repetition av konstruktorer, const och this.", topics: ["klasser-typer"] },
  { k: "Övn", t: "Övningsuppgifter Dag 1 – klasser och structs", d: "Fyra block: Position/Device, Sensor/Logger, AirMonitor och ParkingHouse, reflektion.", topics: ["klasser-typer", "komposition-uml"] },
  { k: "30/10", t: "Torsdag 30/10 – Inkapsling, komposition", d: "Access-nivåer, getters/setters i idiomatisk C++, komposition med Robot och Position.", topics: ["inkapsling", "komposition-uml"] },
  { k: "4/11", t: "Tisdag 4/11 – Arv", d: "Bas- och subklasser, konstruktorordning, protected, arv eller komposition, intro till enum class.", topics: ["arv", "enums"] },
  { k: "Övn", t: "Övningar – enums", d: "enum och enum class, switch och fem övningar.", topics: ["enums"] },
  { k: "6/11", t: "Torsdag 6/11 – Polymorfism, casting", d: "virtual, override, final, abstrakta klasser, slicing, unique_ptr, fabriker, RTTI och dynamic_cast.", topics: ["polymorfism", "agande-casting"] },
  { k: "Labb", t: "Labb: Terminal Game", d: "Player, Effect, Slow och Burn, vidareutvecklat till ett turbaserat spel.", topics: ["polymorfism", "enums"] },
  { k: "13/11", t: "Torsdag 13/11 – Design Patterns intro", d: "Strategy, Observer, Factory Method, Singleton och Adapter.", topics: ["designmonster", "singleton-adapter"] },
  { k: "Labb", t: "Samarbete med git", d: "Mini-projekt A–C, feature branches, PR och code review.", topics: ["git-samarbete"] },
];
const OOP_LINKS = [
  { k: "Ref", t: "cppreference: virtual, override, final", u: "https://en.cppreference.com/w/cpp/language/virtual", d: "Exakta regler för virtuella funktioner." },
  { k: "Ref", t: "C++ Core Guidelines: klasser och hierarkier", u: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-class", d: "Riktlinjer för inkapsling, arv och polymorfism." },
  { k: "Bok", t: "Refactoring.Guru: designmönster", u: "https://refactoring.guru/design-patterns", d: "Illustrerade förklaringar av Strategy, Observer, Factory, Singleton och Adapter." },
  { k: "UML", t: "UML-klassdiagram (översikt)", u: "https://www.uml-diagrams.org/class-diagrams-overview.html", d: "Notation för klasser, relationer och multiplicitet." },
];
