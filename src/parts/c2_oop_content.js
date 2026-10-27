/* ================================================================ Course: OOP och design */
const OOP_TOPICS = [
/* ---------------------------------------------------------------- 01 */
{
  id: "klasser-typer", cat: "Grunder", min: 10, date: "Tis 28/10",
  title: "Klasser och egna typer",
  lead: "Från data och funktioner till objekt med ansvar: vad en typ är, struct och class, konstruktorer, const och this.",
  src: ["Tisdag 28/10 – Klasser", "Övningsuppgifter Dag 1 – klasser och structs"],
  goals: [
    "Förklara vad en typ är och varför vi skapar egna typer",
    "Skilja på struct och class och använda konstruktorer med initieringslista",
    "Förklara const-metoder och this-pekaren",
    "Dela upp en klass i .h och .cpp",
  ],
  blocks: [
    ["h", "Hur kom vi hit?"],
    ["p", R`I C/C++-kursen tänkte vi ofta "C-aktigt": data först, funktioner sen. Nu går vi över till att tänka i <strong>objekt</strong>: delar med ett eget ansvar som samarbetar i ett system. Historiskt gick utvecklingen från procedurprogrammering (funktioner + data) via modulprogrammering till objektorienterad programmering (OOP) med klasser och objekt.`],
    ["p", R`I IoT och inbyggda system finns många samverkande komponenter: sensorer, aktuatorer, kommunikation. OOP hjälper oss att hålla isär dem. En luftkvalitetssensor mäter, har ett namn och kanske en intern klocka. Det är mer än ett <code>double</code>-värde. Det är ett objekt med beteende.`],
    ["h", "Vad är en typ?"],
    ["p", R`<strong>En typ definierar vilka värden en variabel kan ha och vilka operationer som är tillåtna.</strong> <code>int</code>, <code>double</code> och <code>char</code> är primitiva typer.`],
    ["list", [
      R`<strong>Säkerhet:</strong> kompilatorn upptäcker fel, som att lägga ihop en sträng och en sensor.`,
      R`<strong>Struktur:</strong> programmet organiseras kring begrepp.`,
      R`<strong>Läsbarhet:</strong> andra förstår vad datan betyder.`,
    ]],
    ["p", R`Men primitiva typer säger inget om beteende, relationer, ansvar eller livscykel. Därför skapar vi egna typer med <code>struct</code> och <code>class</code>: data <em>och</em> beteende i samma enhet.`],
    ["code", "cpp", R`int temperature = 22;      // ett tal, men vad betyder det?
double voltage = 3.3;

struct Point {             // egen typ: data som hör ihop
    double x;
    double y;
};

class Sensor {             // egen typ: data + beteende
public:
    std::string name;
    double value;
    void read() { value = 42.0; }   // simulerad läsning
};`],
    ["h", "struct eller class?"],
    ["list", [
      R`<code>struct</code>: alla medlemmar är <strong>public</strong> som standard.`,
      R`<code>class</code>: alla medlemmar är <strong>private</strong> som standard.`,
    ]],
    ["p", R`Annars är de identiska. Konventionen: struct för enkla datapaket (<code>Position</code>, <code>SensorReading</code>), class när objektet har regler och ett gränssnitt (<code>Device</code>, <code>Logger</code>). Ställ tre frågor när du designar: <em>Vad representerar objektet? Vilka egenskaper har det? Vilket ansvar ska det ha?</em>`],
    ["code", "cpp", R`struct Position {
    double x;
    double y;
    void move(double dx, double dy) { x += dx; y += dy; }
    void print() const { std::cout << "(" << x << ", " << y << ")\n"; }
};

class Device {
private:
    int id;
    std::string name;
public:
    Device(int id, const std::string& name)
        : id(id), name(name) {}               // initieringslista

    void rename(const std::string& newName) { name = newName; }
    void printInfo() const { std::cout << "Device " << id << ": " << name << "\n"; }
};`, "repetition"],
    ["h", "const-metoder och this"],
    ["p", R`<code>const</code> efter parameterlistan lovar att metoden inte ändrar objektet. Då kan den anropas på konstanta objekt och via <code>const&amp;</code>, och kompilatorn stoppar oavsiktliga ändringar.`],
    ["p", R`<code>this</code> är en pekare till objektet som metoden anropas på. Den behövs sällan, men är praktisk när en parameter har samma namn som en medlem, eller när en metod ska returnera objektet självt.`],
    ["code", "cpp", R`class Counter {
    int count = 0;
public:
    Counter& increment() {       // returnerar *this → anrop kan kedjas
        this->count++;
        return *this;
    }
    int value() const { return count; }
};

Counter c;
c.increment().increment().increment();
std::cout << c.value();          // 3`],
    ["h", "Kursens mål i korthet"],
    ["table", ["Kod", "Mål", "Exempel"], [
      ["KUN8", "Kunskaper om OOP", "Vad är ett objekt, en klass, och hur hänger de ihop?"],
      ["KUN9", "Utvecklingsmiljö", "Bygga ett program med flera .cpp/.h-filer"],
      ["KUN10", "Polymorfism och arv", "Introduceras tidigt, fördjupas senare"],
      ["KUN11", "Kompilerade vs interpreterade språk", "C++ kompileras, Python interpreteras"],
      ["KUN12", "UML", "Rita klassdiagram för att modellera objekt"],
      ["F10–F14", "Färdigheter", "Söka info, strukturera kod, sätta upp miljö, hitta buggar, kommunicera lösningar"],
      ["KOM6–KOM8", "Kompetenser", "Utveckla IoT-mjukvara, utvärdera och förbättra, professionell utveckling"],
    ]],
    ["h", "Övningar (Dag 1)"],
    ["ex", "Position och Device i egna filer", R`<ol><li>Deklarera <code>struct Position</code> i <code>Position.h</code>, implementera <code>move</code> och <code>print</code> i <code>Position.cpp</code>. print ska skriva <code>Position(x=…, y=…)</code>.</li><li>Gör samma sak med <code>class Device</code>: konstruktor, <code>rename</code> och <code>printInfo</code>.</li><li>I <code>main.cpp</code>: skapa objekten, flytta och byt namn, skriv ut och verifiera.</li></ol><p>Tips: prova i Kodlabbet i desktop-appen, som klarar flera filer.</p>`],
    ["ex", "Sensor, SensorReading och Logger", R`<p>Ett IoT-system ska läsa en sensor, paketera värdet som en <code>SensorReading</code> och logga det.</p><ul><li><code>struct SensorReading { double value; std::string timestamp; void print() const; }</code></li><li><code>class Sensor</code> med <code>read()</code> som returnerar en SensorReading (dummyvärde 42.0) och <code>getName()</code>.</li><li><code>class Logger</code> med <code>log(const SensorReading&amp;, const std::string&amp; sensorName) const</code>.</li></ul>`,
      R`SensorReading Sensor::read() const {
    return SensorReading{42.0, "2025-10-28 14:35"};
}

void Logger::log(const SensorReading& r, const std::string& sensorName) const {
    std::cout << sensorName << ": ";
    r.print();
}`, "cpp"],
    ["ex", "Luftkvalitetssystem (komposition)", R`<p><code>AirSensor</code> har ett namn och <code>read()</code>. <code>AirMonitor</code> har en <code>std::vector&lt;AirSensor&gt;</code> och <code>logAll()</code> som läser varje sensor och loggar med Logger. Skapa tre sensorer och anropa logAll().</p>`],
    ["ex", "Parkeringshus", R`<p><code>struct Car { std::string regNumber; std::string arrivalTime; void print() const; }</code> och <code>class ParkingHouse</code> med <code>addCar</code>, <code>removeCar</code> (returnerar true/false) och <code>printStatus</code>.</p>`,
      R`bool ParkingHouse::removeCar(const std::string& regNumber) {
    for (auto it = cars.begin(); it != cars.end(); ++it) {
        if (it->regNumber == regNumber) {
            cars.erase(it);
            return true;
        }
    }
    return false;
}`, "cpp"],
  ],
  quiz: [
    { q: "Vad definierar en typ?", o: ["Bara hur mycket minne en variabel tar", "Vilka värden en variabel kan ha och vilka operationer som är tillåtna", "Vilken fil koden ligger i", "Variabelns namn"], a: 1,
      why: "En typ beskriver både värdemängden och de tillåtna operationerna. Därför kan kompilatorn hitta fel." },
    { q: R`Vad är skillnaden mellan <code>struct</code> och <code>class</code> i C++?`, o: ["Structs kan inte ha metoder", "Standardåtkomsten: public i struct, private i class", "Klasser måste skapas med new", "Structs kan inte ha konstruktorer"], a: 1,
      why: "Det är den enda språkliga skillnaden. Valet handlar om vad du vill signalera." },
    { q: R`Vad betyder <code>void print() const;</code>?`, o: ["print returnerar en konstant", "print ändrar inte objektets medlemmar", "print kan bara anropas en gång", "print är private"], a: 1,
      why: R`En const-metod kan anropas på <code>const</code>-objekt och via <code>const&amp;</code>.` },
    { q: R`Vad är <code>this</code> inuti en metod?`, o: ["En kopia av objektet", "En pekare till objektet som metoden anropas på", "Klassens namn", "En referens till main"], a: 1,
      why: R`<code>this-&gt;count</code> och <code>count</code> betyder samma sak inuti en metod. <code>*this</code> är själva objektet.` },
    { q: "Varför använder vi initieringslistan i konstruktorn?", o: ["Den krävs alltid", "Medlemmarna initieras direkt istället för att först skapas och sedan tilldelas", "Den gör medlemmarna private", "Den anropar destruktorn"], a: 1,
      why: R`<code>: id(id), name(name)</code> bygger medlemmarna med rätt värde direkt. const-medlemmar och referenser <em>måste</em> initieras där.` },
  ],
},

/* ---------------------------------------------------------------- 02 */
{
  id: "inkapsling", cat: "Design", min: 7, date: "Tors 30/10",
  title: "Inkapsling och gränssnitt",
  lead: "Skydda objektets data och ge det ett litet, stabilt gränssnitt: access-nivåer, getters och setters i idiomatisk C++.",
  src: ["Torsdag 30/10 – Inkapsling, komposition"],
  goals: [
    "Förklara inkapsling och varför den minskar buggar",
    "Använda public, protected och private",
    R`Skriva idiomatiska accessorer som <code>value()</code> och <code>setValue()</code>`,
  ],
  blocks: [
    ["h", "Vad är inkapsling?"],
    ["p", R`Inkapsling handlar om att avgränsa vad som syns från utsidan av ett objekt. Vi vill:`],
    ["list", [
      "skydda intern data från direkt åtkomst,",
      "förhindra oavsiktliga eller felaktiga ändringar,",
      "exponera ett tydligt och stabilt gränssnitt utåt.",
    ]],
    ["code", "cpp", R`class Example {
public:
    void doSomething();     // synligt och åtkomligt utifrån
protected:
    // åtkomligt i subklasser men inte utifrån
private:
    int internalValue;      // bara inom den här klassen
};`],
    ["code", "cpp", R`class TemperatureSensor {
private:
    double currentValue = 0.0;
public:
    void read() { currentValue = 23.5; }          // simulerad läsning
    double value() const { return currentValue; } // kontrollerad läsning
};`, "data skyddas, läsning sker via en metod"],
    ["h", "Getters och setters i C++"],
    ["p", R`Python och C# har <em>properties</em>. I C++ använder vi metoder, men namnger dem så att anropen läses naturligt:`],
    ["code", "cpp", R`// mindre idiomatiskt
double getValue();
void setValue(double);

// mer idiomatiskt i modern C++
double value() const;
void setValue(double v);

sensor.setValue(25.0);
std::cout << sensor.value();`],
    ["p", R`Ett vanligt mönster är att ge privata medlemmar ett suffix <code>_</code> så att accessorn kan heta som begreppet:`],
    ["code", "cpp", R`class Device {
private:
    int id_;
    std::string name_;
public:
    Device(int id, const std::string& name) : id_{id}, name_{name} {}
    const std::string& name() const { return name_; }
    void rename(const std::string& newName) { name_ = newName; }
};`],
    ["h", "En setter som skyddar invarianter"],
    ["p", R`Värdet av inkapsling syns när setter-metoden har en regel. En <strong>invariant</strong> är något som alltid ska vara sant för objektet, till exempel att en ljusstyrka ligger mellan 0 och 100.`],
    ["code", "cpp", R`class Lamp {
    int brightness_ = 0;          // invariant: 0–100
public:
    void setBrightness(int b) {
        if (b < 0) b = 0;
        if (b > 100) b = 100;
        brightness_ = b;
    }
    int brightness() const { return brightness_; }
};`],
    ["note", "tip", R`Skriv inte getters och setters för varje medlem av ren vana. Fråga vad användaren av klassen behöver göra. Ofta är <code>lamp.dim(10)</code> ett bättre gränssnitt än <code>lamp.setBrightness(lamp.brightness() - 10)</code>.`],
  ],
  quiz: [
    { q: "Vad är huvudsyftet med inkapsling?", o: ["Att koden ska gå snabbare", "Att skydda intern data och exponera ett tydligt gränssnitt", "Att undvika arv", "Att kunna använda pekare"], a: 1,
      why: "Objektet kontrollerar själv hur dess data får ändras." },
    { q: R`Vem kommer åt en <code>protected</code>-medlem?`, o: ["Alla", "Bara klassen själv", "Klassen och dess subklasser", "Bara main"], a: 2,
      why: "protected är private utåt men synlig i klasser som ärver." },
    { q: "Vilket accessor-namn är mest idiomatiskt i modern C++?", o: [R`<code>double getValue()</code>`, R`<code>double value() const</code>`, R`<code>double GetTheValue()</code>`, R`<code>double value_get()</code>`], a: 1,
      why: R`Kort namn och <code>const</code> eftersom metoden bara läser.` },
    { q: "Vad är en invariant?", o: ["En variabel som aldrig används", "Ett villkor som alltid ska gälla för objektet", "En konstant global variabel", "En virtuell funktion"], a: 1,
      why: "Till exempel att ljusstyrkan alltid ligger mellan 0 och 100. Settern ser till att den håller." },
    { q: "Varför ska getters som bara läser vara const?", o: ["Det gör dem snabbare", "Så att de kan anropas på konstanta objekt och inte råkar ändra något", "Det krävs av kompilatorn", "För att de ska bli private"], a: 1,
      why: R`Ett objekt som skickas som <code>const Device&amp;</code> kan bara använda const-metoder.` },
  ],
},

/* ---------------------------------------------------------------- 03 */
{
  id: "komposition-uml", cat: "Design", min: 8, date: "Tors 30/10",
  title: "Komposition och UML",
  lead: "Bygg klasser av andra klasser och rita relationerna som UML-klassdiagram.",
  src: ["Torsdag 30/10 – Inkapsling, komposition", "Övningsuppgifter Dag 1 (block 3)", "UML-avsnittet kompletterat av Nollterm"],
  goals: [
    "Förklara komposition som en har-en-relation",
    "Bygga klasser som innehåller andra objekt",
    "Läsa och rita ett enkelt UML-klassdiagram",
  ],
  blocks: [
    ["h", "Vad är komposition?"],
    ["p", R`Komposition betyder att en klass innehåller andra klasser som medlemmar. Den är lättare att förstå än arv och mycket vanlig i inbyggda system. Relationen är <strong>har-en</strong>: <em>a robot has a position</em>.`],
    ["code", "cpp", R`class Position {
public:
    double x, y;
    Position(double x, double y) : x{x}, y{y} {}
};

class Robot {
private:
    std::string name_;
    Position pos_;                          // Robot HAR EN Position
public:
    Robot(const std::string& name) : name_{name}, pos_{0.0, 0.0} {}
    void move(double dx, double dy) { pos_.x += dx; pos_.y += dy; }
    void printStatus() const {
        std::cout << name_ << " at (" << pos_.x << ", " << pos_.y << ")\n";
    }
};`],
    ["p", R`Delarna skapas tillsammans med helheten och förstörs med den. Kompositionen kan också vara en samling: <code>AirMonitor</code> har flera <code>AirSensor</code>, <code>ParkingHouse</code> har flera <code>Car</code>.`],
    ["code", "cpp", R`class AirMonitor {
    std::vector<AirSensor> sensors_;
    Logger logger_;
public:
    void addSensor(const AirSensor& s) { sensors_.push_back(s); }
    void logAll() const {
        for (const auto& s : sensors_) logger_.log(s.read(), s.name());
    }
};`],
    ["h", "UML-klassdiagram"],
    ["p", R`UML (Unified Modeling Language) är ett standardiserat sätt att rita klasser och deras relationer. En klass ritas som en låda i tre fack: <strong>namn</strong>, <strong>attribut</strong> och <strong>operationer</strong>. Tecknet före varje medlem visar åtkomsten.`],
    ["code", "bash", R`┌───────────────────────────┐
│          Robot            │
├───────────────────────────┤
│ - name_ : string          │
│ - pos_ : Position         │
├───────────────────────────┤
│ + Robot(name : string)    │
│ + move(dx, dy : double)   │
│ + printStatus() : void    │
└───────────────────────────┘`, "UML-klass"],
    ["table", ["Symbol", "Betyder"], [
      [R`<code>+</code>`, "public"],
      [R`<code>-</code>`, "private"],
      [R`<code>#</code>`, "protected"],
      [R`<code>namn : Typ</code>`, "attribut med typ"],
      [R`<code>op(p : Typ) : Retur</code>`, "operation med parametrar och returtyp"],
    ]],
    ["table", ["Relation", "Ritas", "Exempel"], [
      ["Komposition (äger, samma livstid)", "linje med fylld romb vid helheten ◆", "Robot ◆── Position"],
      ["Aggregation (har, men äger inte)", "linje med ofylld romb ◇", "Team ◇── Player"],
      ["Arv (är-en)", "linje med ofylld triangel mot basklassen △", "TempSensor ──▷ Sensor"],
      ["Beroende (använder)", "streckad pil", "Logger - - > SensorReading"],
    ]],
    ["p", R`Multiplicitet skrivs vid linjens ände: <code>1</code>, <code>0..1</code>, <code>*</code> (många). <code>AirMonitor ◆── * AirSensor</code> betyder att en monitor äger många sensorer.`],
    ["note", "tip", R`Rita diagrammet innan du kodar. Det tvingar fram frågorna: vem äger vad, vem anropar vem, och vilket ansvar har varje klass?`],
    ["h", "Övning"],
    ["ex", "Rita och bygg luftkvalitetssystemet", R`<ol><li>Rita UML för <code>AirSensor</code>, <code>AirMonitor</code>, <code>Logger</code> och <code>SensorReading</code> med åtkomst, typer och relationer.</li><li>Markera var det är komposition och var det bara är ett beroende.</li><li>Implementera och jämför koden med diagrammet.</li></ol>`],
  ],
  quiz: [
    { q: "Vilken relation beskriver komposition?", o: ["är-en", "har-en", "använder ibland", "ärver från"], a: 1,
      why: "En Robot har en Position. Arv är är-en." },
    { q: R`Vad betyder <code>-</code> framför ett attribut i UML?`, o: ["public", "private", "protected", "static"], a: 1,
      why: R`<code>+</code> public, <code>-</code> private, <code>#</code> protected.` },
    { q: "Hur ritas arv i ett UML-klassdiagram?", o: ["Linje med fylld romb", "Linje med ofylld triangel som pekar mot basklassen", "Streckad linje utan pil", "Dubbel linje"], a: 1,
      why: "Triangeln pekar alltid mot den mer generella klassen." },
    { q: "Vilka tre fack har en UML-klass?", o: ["Namn, attribut, operationer", "Namn, filer, tester", "Public, private, protected", "Header, källkod, main"], a: 0,
      why: "Namn överst, sedan data, sist metoder." },
    { q: R`<code>AirMonitor</code> innehåller <code>std::vector&lt;AirSensor&gt;</code>. Vad är det?`, o: ["Arv", "Komposition", "Polymorfism", "Ett designmönster"], a: 1,
      why: "Monitorn äger sina sensorer. De skapas och förstörs med den." },
  ],
},

/* ---------------------------------------------------------------- 04 */
{
  id: "arv", cat: "Arv", min: 9, date: "Tis 4/11",
  title: "Arv och konstruktorordning",
  lead: "Bygg nya klasser på befintliga, förstå i vilken ordning objekt byggs och rivs, och välj mellan arv och komposition.",
  src: ["Tisdag 4/11 – Arv"],
  goals: [
    "Skapa basklasser och subklasser med public-arv",
    "Förklara konstruktor- och destruktorordningen",
    "Anropa basklassens konstruktor från subklassen",
    "Välja arv (är-en) eller komposition (har-en)",
  ],
  blocks: [
    ["h", "Vad är arv?"],
    ["p", R`Arv låter oss skapa nya klasser som bygger på befintliga. Med arv kan vi återanvända kod från en <strong>basklass</strong>, utöka eller ändra beteendet i en <strong>subklass</strong> (derived class), och skapa logiska hierarkier.`],
    ["code", "cpp", R`class Animal {
protected:
    std::string name_;
public:
    Animal(const std::string& name) : name_{name} {
        std::cout << "Animal-konstruktor\n";
    }
    void speak() const { std::cout << name_ << " gör ett ljud.\n"; }
};

class Dog : public Animal {
public:
    Dog(const std::string& name) : Animal(name) {      // anropa basens konstruktor
        std::cout << "Dog-konstruktor\n";
    }
    void wagTail() const { std::cout << name_ << " viftar på svansen.\n"; }
};

int main() {
    Dog d("Fido");
    d.speak();      // ärvs från Animal
    d.wagTail();    // finns bara i Dog
}`],
    ["code", "bash", R`Animal-konstruktor
Dog-konstruktor
Fido gör ett ljud.
Fido viftar på svansen.`, "utdata"],
    ["h", "Begrepp"],
    ["table", ["Begrepp", "Förklaring"], [
      ["Base class", "klassen som andra ärver från"],
      ["Derived class", "klassen som ärver"],
      ["public-arv", R`det vanliga: basens publika gränssnitt är publikt även i subklassen (<code>class Dog : public Animal</code>)`],
      ["protected", "medlemmar som syns i subklasser men inte utåt"],
    ]],
    ["h", "Konstruktor- och destruktorordning"],
    ["p", R`När ett subklassobjekt skapas byggs <strong>basen först</strong>, sedan subklassen. Destruktorerna körs i <strong>omvänd ordning</strong>: subklassen rivs först. Tänk dig ett hus: grunden byggs först och rivs sist.`],
    ["widget", "ctororder"],
    ["list", [
      R`Subklassen ärver <strong>inte</strong> basens konstruktorer.`,
      R`Har basen ingen standardkonstruktor måste du anropa rätt konstruktor i initieringslistan: <code>TemperatureSensor(const std::string&amp; id) : Sensor(id) {}</code>.`,
      R`En basklass i en polymorf hierarki ska ha en <code>virtual</code> destruktor (mer om det i lektionen om polymorfism).`,
    ]],
    ["h", "Vad ärvs?"],
    ["p", R`Subklassen kommer åt basens <code>public</code>- och <code>protected</code>-medlemmar. <code>private</code>-medlemmar finns kvar i objektet men går inte att nå direkt från subklassen.`],
    ["code", "cpp", R`class Base {
protected:
    int protected_value = 42;
private:
    int private_value = 100;
};

class Derived : public Base {
public:
    void print() {
        std::cout << protected_value << "\n";    // OK
        // std::cout << private_value;          // fel: inte åtkomlig
    }
};`],
    ["h", "Arv eller komposition?"],
    ["table", ["Relation", "Välj", "Exempel"], [
      ["är-en", "arv", "en TemperatureSensor är en Sensor, en Dog är ett Animal"],
      ["har-en", "komposition", "en Car har en Engine, en SensorStation har flera Sensor"],
    ]],
    ["note", "warn", R`Ärv inte bara för att återanvända kod. Om du inte kan säga "X är en Y" utan att det låter fel, använd komposition.`],
    ["h", "Övning"],
    ["ex", "Sensorhierarki", R`<p>Skapa <code>Sensor</code> med ett skyddat <code>id_</code> och en konstruktor som skriver ut att sensorn skapas. Låt <code>TemperatureSensor</code> och <code>HumiditySensor</code> ärva och anropa basens konstruktor. Skapa ett objekt av varje och studera utskrifterna.</p>`],
  ],
  quiz: [
    { q: R`<code>class Car : public Vehicle</code>. Vilken konstruktor körs först när du skapar en Car?`, o: ["Car", "Vehicle", "Det är odefinierat", "Bara Car körs"], a: 1,
      why: "Basen byggs alltid först, sedan subklassen." },
    { q: "I vilken ordning körs destruktorerna för ett Car-objekt?", o: ["Vehicle, sedan Car", "Car, sedan Vehicle", "Bara Vehicle", "Samtidigt"], a: 1,
      why: "Omvänd ordning mot konstruktion: subklassen rivs först." },
    { q: "Vilka basklassmedlemmar kan en subklass komma åt direkt?", o: ["Alla", "public och protected", "Bara public", "Bara private"], a: 1,
      why: "private finns i objektet men är dold även för subklassen." },
    { q: "Vilken relation passar arv?", o: ["En bil har en motor", "En termometer är en sensor", "Ett rum har lampor", "En logg använder en fil"], a: 1,
      why: "Arv modellerar är-en. De andra är har-en eller använder." },
    { q: "Hur skickar en subklass vidare ett värde till basklassens konstruktor?", o: ["Genom att anropa basens konstruktor i initieringslistan", "Genom att skriva Base::Base(x) i kroppen", "Det sker automatiskt", "Med virtual"], a: 0,
      why: R`<code>TemperatureSensor(const std::string&amp; id) : Sensor(id) {}</code>` },
  ],
},

/* ---------------------------------------------------------------- 05 */
{
  id: "enums", cat: "Typer", min: 7, date: "Tis 4/11",
  title: "enum och enum class",
  lead: "Ersätt magiska tal med namngivna värden, och se varför enum class är det typsäkra valet.",
  src: ["Tisdag 4/11 – Arv (avsnitt 7)", "Övningar – enums"],
  goals: [
    "Ersätta magiska tal med enum",
    "Förklara skillnaden mellan enum och enum class",
    "Använda enum class i switch och konvertera till text",
  ],
  blocks: [
    ["h", "Magiska tal"],
    ["code", "cpp", R`int weather = 2;     // vad betyder 2?`],
    ["p", "Svårt att läsa och lätt att göra fel. Med en enum får varje värde ett namn."],
    ["h", "Klassisk enum"],
    ["code", "cpp", R`enum Weather { Sunny, Cloudy, Rainy };

Weather today = Sunny;
std::cout << today;      // skriver 0: en vanlig enum är i grunden en int`],
    ["list", [
      R`Alla namn hamnar i samma namnrymd. Två enums med <code>None</code> eller <code>Error</code> krockar.`,
      R`Svag typkontroll: värdet omvandlas tyst till int och kan jämföras med vilka tal som helst.`,
    ]],
    ["h", "enum class (scoped enum)"],
    ["code", "cpp", R`enum class Weather { Sunny, Cloudy, Rainy };

Weather w = Weather::Cloudy;      // namnet måste anges med Weather::

if (w == Weather::Cloudy) { }     // OK
// if (w == 1) { }               // FEL: enum class jämförs inte med int

int raw = static_cast<int>(w);   // explicit omvandling när du verkligen behöver talet`],
    ["list", [
      "Inga namnkonflikter.",
      "Typsäkert: du kan inte blanda med int eller med andra enums av misstag.",
      R`Kräver <code>static_cast&lt;int&gt;(w)</code> för att skriva ut talet.`,
    ]],
    ["h", "switch och text"],
    ["p", R`enum class passar perfekt i <code>switch</code>. För utskrift skriver man oftast en hjälpfunktion som mappar till en sträng.`],
    ["code", "cpp", R`enum class Direction { North, East, South, West };

std::string toString(Direction d) {
    switch (d) {
        case Direction::North: return "norr";
        case Direction::East:  return "öster";
        case Direction::South: return "söder";
        case Direction::West:  return "väster";
    }
    return "okänd";
}`],
    ["note", "tip", R`Med <code>-Wall</code> varnar g++ om en switch över en enum class saknar ett case. Utelämna därför gärna <code>default</code>, så får du hjälp när du lägger till ett nytt värde.`],
    ["h", "enum i en klass"],
    ["code", "cpp", R`enum class MachineState { Idle, Running, Error };

class Machine {
    MachineState state_ = MachineState::Idle;
public:
    void start() { state_ = MachineState::Running; }
    void fail()  { state_ = MachineState::Error; }
    void printStatus() const {
        switch (state_) {
            case MachineState::Idle:    std::cout << "Väntar\n";  break;
            case MachineState::Running: std::cout << "Kör\n";     break;
            case MachineState::Error:   std::cout << "Fel!\n";    break;
        }
    }
};`],
    ["h", "Övningar"],
    ["ex", "Veckodagar", R`<ol><li>Skapa en enum för veckodagarna och sätt <code>today</code> till Wednesday. Använd switch för olika meddelanden. Bonus: skriv ut talet (0–6).</li><li>Gör om den till enum class. Vad händer med <code>today == 2</code>? Vad vinner vi?</li></ol>`],
    ["ex", "Menyval med enum class", R`<p><code>enum class MenuOption { AddUser, RemoveUser, ListUsers, Exit };</code> Läs 1–4 från användaren, mappa till enum med en funktion och hantera valet med switch.</p>`,
      R`MenuOption toOption(int n) {
    switch (n) {
        case 1: return MenuOption::AddUser;
        case 2: return MenuOption::RemoveUser;
        case 3: return MenuOption::ListUsers;
        default: return MenuOption::Exit;
    }
}`, "cpp"],
  ],
  quiz: [
    { q: "Vad är ett magiskt tal?", o: ["Ett primtal", "Ett tal i koden vars betydelse inte framgår", "En konstant med namn", "Ett slumptal"], a: 1,
      why: R`<code>weather = 2</code> säger inget. <code>Weather::Rainy</code> gör det.` },
    { q: R`Vad skriver <code>enum Weather { Sunny, Cloudy, Rainy }; std::cout &lt;&lt; Cloudy;</code> ut?`, o: ["Cloudy", "1", "2", "Kompileringsfel"], a: 1,
      why: "Värdena numreras från 0, och en vanlig enum omvandlas tyst till int." },
    { q: R`Varför kompilerar inte <code>if (w == 1)</code> när w är en <code>enum class</code>?`, o: ["enum class kan inte jämföras alls", "enum class omvandlas inte automatiskt till int", "1 är inte ett giltigt värde", "Det kompilerar visst"], a: 1,
      why: "Det är hela poängen: typsäkerhet. Jämför med Weather::Cloudy." },
    { q: "Vilken är en fördel med enum class jämfört med enum?", o: ["Snabbare", "Inga namnkrockar mellan olika enums", "Kan lagra strängar", "Behöver inga namn"], a: 1,
      why: R`Namnen ligger i enumens eget scope: <code>Status::None</code> och <code>Error::None</code> kan samexistera.` },
    { q: R`Hur får du talet ur <code>Weather w</code> om det är en enum class?`, o: ["Det går inte att få fram talet", R`<code>static_cast&lt;int&gt;(w)</code>`, R`<code>w.value()</code>`, R`<code>toInt(w)</code>`], a: 1,
      why: "En explicit omvandling visar att du gör det med flit." },
  ],
},
];
