/* Extra questions for the OOP course. gpp: true = needs real g++ (desktop app). */
const OOP_EXTRA = {
"klasser-typer": [
  { t: "multi", q: "Vilka av följande är sanna om en klass i C++? Välj alla.", o: ["Den kan ha både data och metoder", "Medlemmar är private som standard", "Den måste ha en destruktor", "Den kan ha flera konstruktorer"], a: [0, 1, 3],
    why: "Kompilatorn skapar en destruktor åt dig om du inte skriver en." },
  { t: "mc", q: R`Vad returnerar <code>*this</code> i en metod?`, o: ["En pekare till objektet", "Objektet självt (som referens om returtypen är en referens)", "Klassens namn", "nullptr"], a: 1,
    why: R`<code>this</code> är pekaren, <code>*this</code> är objektet. <code>Counter&amp; increment() { ...; return *this; }</code> gör att anrop kan kedjas.` },
  { t: "text", q: "Vilket nyckelord efter parameterlistan lovar att en metod inte ändrar objektet?", accept: ["const"], ph: "nyckelord",
    why: R`<code>void print() const;</code>` },
  { t: "text", q: R`Vilken filändelse har filen som innehåller klassens <em>deklaration</em>, enligt kursens konvention?`, accept: [".h", "h", ".hpp", "hpp"], ph: ".?",
    why: R`Deklarationen i <code>.h</code>, implementationen i <code>.cpp</code>.` },
  { t: "code", gpp: true, q: R`Skriv klassen <code>Counter</code> med en privat räknare som startar på 0, en metod <code>increment()</code> och en const-metod <code>value()</code>. main läser n och anropar increment n gånger.`,
    starter: R`#include <iostream>
using namespace std;

class Counter {
    // privat räknare

public:
    // increment() och value()

};

int main() {
    int n;
    cin >> n;
    Counter c;
    for (int i = 0; i < n; i++) c.increment();
    cout << c.value() << endl;
    return 0;
}`,
    tests: [{ in: "3", out: "3" }, { in: "0", out: "0" }, { in: "42", out: "42" }],
    sol: R`#include <iostream>
using namespace std;

class Counter {
    int count_ = 0;
public:
    void increment() { count_++; }
    int value() const { return count_; }
};

int main() {
    int n;
    cin >> n;
    Counter c;
    for (int i = 0; i < n; i++) c.increment();
    cout << c.value() << endl;
    return 0;
}`, why: R`Räknaren är private och nås bara via metoderna. <code>value()</code> är const eftersom den bara läser.` },
  { t: "code", gpp: true, q: R`Implementera <code>Position::move</code> och <code>Position::print</code>. print ska skriva <code>Position(x=X, y=Y)</code>.`,
    starter: R`#include <iostream>
using namespace std;

struct Position {
    double x;
    double y;
    void move(double dx, double dy);
    void print() const;
};

// implementera move och print här


int main() {
    double x, y, dx, dy;
    cin >> x >> y >> dx >> dy;
    Position p{x, y};
    p.move(dx, dy);
    p.print();
    return 0;
}`,
    tests: [{ in: "0 0 3 -1.5", out: "Position(x=3, y=-1.5)" }, { in: "1 2 1 1", out: "Position(x=2, y=3)" }],
    sol: R`#include <iostream>
using namespace std;

struct Position {
    double x;
    double y;
    void move(double dx, double dy);
    void print() const;
};

void Position::move(double dx, double dy) {
    x += dx;
    y += dy;
}

void Position::print() const {
    cout << "Position(x=" << x << ", y=" << y << ")" << endl;
}

int main() {
    double x, y, dx, dy;
    cin >> x >> y >> dx >> dy;
    Position p{x, y};
    p.move(dx, dy);
    p.print();
    return 0;
}`, why: R`<code>Position::</code> knyter definitionen till structen, och print behåller sin <code>const</code> även i definitionen.` },
],
"inkapsling": [
  { t: "multi", q: "Vilka är fördelar med inkapsling? Välj alla.", o: ["Färre buggar eftersom data inte ändras direkt utifrån", "Implementationen kan bytas utan att användarna påverkas", "Programmet blir alltid snabbare", "Klassen kan garantera sina invarianter"], a: [0, 1, 3],
    why: "Inkapsling handlar om korrekthet och underhåll, inte om hastighet." },
  { t: "mc", q: R`<code>sensor.currentValue = -999;</code> ger kompileringsfel. Varför?`, o: ["currentValue är private", "currentValue är const", "Negativa tal är förbjudna", "sensor är en pekare"], a: 0,
    why: "Private-medlemmar kan bara nås inifrån klassen." },
  { t: "text", q: "Vilken åtkomstnivå gör en medlem synlig i subklasser men inte utåt?", accept: ["protected"], ph: "nyckelord",
    why: R`<code>protected</code>` },
  { t: "text", q: R`Vad kallas ett villkor som alltid ska gälla för ett objekt, till exempel att ljusstyrkan ligger mellan 0 och 100?`, accept: ["invariant", "en invariant", "klassinvariant"], ph: "begrepp",
    why: "En invariant. Setter-metoderna ser till att den håller." },
  { t: "code", gpp: true, q: R`Skriv klassen <code>Lamp</code> med en privat ljusstyrka (startar på 0), <code>setBrightness(int)</code> som begränsar värdet till 0–100, och <code>brightness()</code>. main läser värden tills indata tar slut och skriver ut ljusstyrkan efter varje.`,
    starter: R`#include <iostream>
using namespace std;

class Lamp {

};

int main() {
    Lamp lamp;
    int v;
    while (cin >> v) {
        lamp.setBrightness(v);
        cout << lamp.brightness() << endl;
    }
    return 0;
}`,
    tests: [{ in: "50 150 -5 100", out: "50\n100\n0\n100" }, { in: "0", out: "0" }],
    sol: R`#include <iostream>
using namespace std;

class Lamp {
    int brightness_ = 0;
public:
    void setBrightness(int b) {
        if (b < 0) b = 0;
        if (b > 100) b = 100;
        brightness_ = b;
    }
    int brightness() const { return brightness_; }
};

int main() {
    Lamp lamp;
    int v;
    while (cin >> v) {
        lamp.setBrightness(v);
        cout << lamp.brightness() << endl;
    }
    return 0;
}`, why: "Settern skyddar invarianten: inget värde utanför 0–100 kan någonsin lagras." },
],
"komposition-uml": [
  { t: "mc", q: "Vilken relation är aggregation snarare än komposition?", o: ["En Robot har en Position som skapas med roboten", "Ett Team har Players som kan finnas kvar när laget upplöses", "Ett Hus har Rum som rivs med huset", "En Car har en Engine som byggs in"], a: 1,
    why: "Aggregation: helheten har delarna men äger inte deras livstid." },
  { t: "multi", q: "Vad visar ett UML-klassdiagram? Välj alla.", o: ["Klassernas attribut och operationer", "Åtkomst (+, -, #)", "Relationer som arv och komposition", "Exakt i vilken ordning koden körs"], a: [0, 1, 2],
    why: "Körordning visas i sekvensdiagram, inte klassdiagram." },
  { t: "text", q: "Vilket tecken markerar protected i UML?", accept: ["#"], ph: "tecken",
    why: R`<code>+</code> public, <code>-</code> private, <code>#</code> protected.` },
  { t: "text", q: R`Hur skrivs multipliciteten "många" i UML?`, accept: ["*", "0..*", "1..*"], ph: "symbol",
    why: R`<code>*</code> (eller <code>0..*</code>).` },
  { t: "code", gpp: true, q: R`Komposition: <code>Robot</code> har en <code>Position</code>. Implementera <code>Robot::move</code> och <code>Robot::printStatus</code> som skriver <code>NAMN at (X, Y)</code>.`,
    starter: R`#include <iostream>
#include <string>
using namespace std;

struct Position {
    double x, y;
};

class Robot {
    string name_;
    Position pos_;
public:
    Robot(const string& name) : name_{name}, pos_{0.0, 0.0} {}
    void move(double dx, double dy);
    void printStatus() const;
};

// implementera här


int main() {
    string name;
    cin >> name;
    Robot r(name);
    double dx, dy;
    while (cin >> dx >> dy) r.move(dx, dy);
    r.printStatus();
    return 0;
}`,
    tests: [{ in: "R2D2 1 2 3 -1", out: "R2D2 at (4, 1)" }, { in: "Wall-E", out: "Wall-E at (0, 0)" }],
    sol: R`#include <iostream>
#include <string>
using namespace std;

struct Position {
    double x, y;
};

class Robot {
    string name_;
    Position pos_;
public:
    Robot(const string& name) : name_{name}, pos_{0.0, 0.0} {}
    void move(double dx, double dy);
    void printStatus() const;
};

void Robot::move(double dx, double dy) {
    pos_.x += dx;
    pos_.y += dy;
}

void Robot::printStatus() const {
    cout << name_ << " at (" << pos_.x << ", " << pos_.y << ")" << endl;
}

int main() {
    string name;
    cin >> name;
    Robot r(name);
    double dx, dy;
    while (cin >> dx >> dy) r.move(dx, dy);
    r.printStatus();
    return 0;
}`, why: "Roboten delegerar positionen till sin Position-medlem. Den har en position, den är inte en." },
],
"arv": [
  { t: "mc", q: R`<code>class Dog : public Animal</code>. Vad ärver Dog inte?`, o: ["Animals publika metoder", "Animals protected-medlemmar", "Animals konstruktorer", "Animals data"], a: 2,
    why: "Konstruktorer ärvs inte. Dog måste anropa Animals konstruktor i sin initieringslista." },
  { t: "multi", q: "Vilka par passar arv (är-en)? Välj alla.", o: ["ElectricCar – Car", "Car – Engine", "TemperatureSensor – Sensor", "SensorStation – Sensor"], a: [0, 2],
    why: "En bil har en motor och en station har sensorer: det är komposition." },
  { t: "text", q: R`Skriv deklarationsraden (utan klamrar) för klassen <code>Dog</code> som ärver publikt från <code>Animal</code>.`, accept: ["class Dog : public Animal", "class Dog: public Animal", "struct Dog : public Animal", "struct Dog : Animal"], ph: "class ...",
    why: R`<code>class Dog : public Animal</code>` },
  { t: "code", gpp: true, q: R`Konstruktorordning: skriv klasserna <code>Base</code> och <code>Derived : public Base</code> så att programmet skriver <code>Base()</code>, <code>Derived()</code>, <code>~Derived()</code>, <code>~Base()</code> på var sin rad.`,
    starter: R`#include <iostream>
using namespace std;

// skriv Base och Derived


int main() {
    {
        Derived d;
    }   // d förstörs här
    return 0;
}`,
    tests: [{ in: "", out: "Base()\nDerived()\n~Derived()\n~Base()" }],
    sol: R`#include <iostream>
using namespace std;

class Base {
public:
    Base() { cout << "Base()" << endl; }
    virtual ~Base() { cout << "~Base()" << endl; }
};

class Derived : public Base {
public:
    Derived() { cout << "Derived()" << endl; }
    ~Derived() { cout << "~Derived()" << endl; }
};

int main() {
    {
        Derived d;
    }   // d förstörs här
    return 0;
}`, why: "Basen byggs först och rivs sist. Ordningen sköts automatiskt av språket." },
  { t: "code", gpp: true, q: R`<code>TemperatureSensor</code> ärver <code>Sensor</code>, vars konstruktor kräver ett id. Skriv TemperatureSensors konstruktor som skickar id vidare, och en metod <code>describe()</code> som skriver <code>TemperatureSensor ID</code>.`,
    starter: R`#include <iostream>
#include <string>
using namespace std;

class Sensor {
protected:
    string id_;
public:
    Sensor(const string& id) : id_{id} {}
};

class TemperatureSensor : public Sensor {
public:
    // konstruktor och describe()

};

int main() {
    string id;
    cin >> id;
    TemperatureSensor t(id);
    t.describe();
    return 0;
}`,
    tests: [{ in: "T-01", out: "TemperatureSensor T-01" }, { in: "kok", out: "TemperatureSensor kok" }],
    sol: R`#include <iostream>
#include <string>
using namespace std;

class Sensor {
protected:
    string id_;
public:
    Sensor(const string& id) : id_{id} {}
};

class TemperatureSensor : public Sensor {
public:
    TemperatureSensor(const string& id) : Sensor(id) {}
    void describe() const { cout << "TemperatureSensor " << id_ << endl; }
};

int main() {
    string id;
    cin >> id;
    TemperatureSensor t(id);
    t.describe();
    return 0;
}`, why: R`Sensor saknar standardkonstruktor, så TemperatureSensor måste anropa <code>Sensor(id)</code> i initieringslistan. <code>id_</code> är protected och kan läsas i subklassen.` },
],
"enums": [
  { t: "mc", q: R`<code>enum class Color { Red, Green };</code> Hur skriver du värdet Green?`, o: ["Green", "Color.Green", "Color::Green", R`<code>Color(1)</code> är enda sättet`], a: 2,
    why: "Namnen i en enum class ligger i enumens eget scope." },
  { t: "multi", q: "Vilka påståenden om enum class stämmer? Välj alla.", o: ["Värdena omvandlas inte automatiskt till int", "Två enum class kan ha värden med samma namn", "Kan användas i switch", "Kan bara ha tre värden"], a: [0, 1, 2],
    why: "Antalet värden är obegränsat." },
  { t: "text", q: R`Skriv uttrycket som omvandlar <code>enum class</code>-värdet <code>w</code> till int.`, accept: ["static_cast<int>(w)", "(int)w", "int(w)"], ph: "...(w)",
    why: R`<code>static_cast&lt;int&gt;(w)</code>` },
  { t: "code", gpp: true, q: R`Skriv <code>std::string toString(Direction d)</code> för <code>enum class Direction { North, East, South, West }</code>. main läser ett tal 0–3 och skriver ut <code>norr</code>, <code>öster</code>, <code>söder</code> eller <code>väster</code>.`,
    starter: R`#include <iostream>
#include <string>
using namespace std;

enum class Direction { North, East, South, West };

string toString(Direction d) {

}

int main() {
    int n;
    cin >> n;
    cout << toString(static_cast<Direction>(n)) << endl;
    return 0;
}`,
    tests: [{ in: "0", out: "norr" }, { in: "1", out: "öster" }, { in: "2", out: "söder" }, { in: "3", out: "väster" }],
    sol: R`#include <iostream>
#include <string>
using namespace std;

enum class Direction { North, East, South, West };

string toString(Direction d) {
    switch (d) {
        case Direction::North: return "norr";
        case Direction::East:  return "öster";
        case Direction::South: return "söder";
        case Direction::West:  return "väster";
    }
    return "okänd";
}

int main() {
    int n;
    cin >> n;
    cout << toString(static_cast<Direction>(n)) << endl;
    return 0;
}`, why: R`En switch utan default låter <code>-Wall</code> varna om du lägger till ett värde utan att hantera det.` },
  { t: "code", gpp: true, q: R`Klassen <code>Machine</code> har en <code>MachineState</code> som startar på Idle. Kommandon på indata: <code>start</code> sätter Running, <code>fail</code> sätter Error. Skriv <code>printStatus()</code> som skriver <code>Idle</code>, <code>Running</code> eller <code>Error</code>.`,
    starter: R`#include <iostream>
#include <string>
using namespace std;

enum class MachineState { Idle, Running, Error };

class Machine {
    MachineState state_ = MachineState::Idle;
public:
    void start() { state_ = MachineState::Running; }
    void fail()  { state_ = MachineState::Error; }
    void printStatus() const {
        // skriv ut statusen
    }
};

int main() {
    Machine m;
    string cmd;
    while (cin >> cmd) {
        if (cmd == "start") m.start();
        else if (cmd == "fail") m.fail();
    }
    m.printStatus();
    return 0;
}`,
    tests: [{ in: "", out: "Idle" }, { in: "start", out: "Running" }, { in: "start fail", out: "Error" }],
    sol: R`#include <iostream>
#include <string>
using namespace std;

enum class MachineState { Idle, Running, Error };

class Machine {
    MachineState state_ = MachineState::Idle;
public:
    void start() { state_ = MachineState::Running; }
    void fail()  { state_ = MachineState::Error; }
    void printStatus() const {
        switch (state_) {
            case MachineState::Idle:    cout << "Idle" << endl;    break;
            case MachineState::Running: cout << "Running" << endl; break;
            case MachineState::Error:   cout << "Error" << endl;   break;
        }
    }
};

int main() {
    Machine m;
    string cmd;
    while (cin >> cmd) {
        if (cmd == "start") m.start();
        else if (cmd == "fail") m.fail();
    }
    m.printStatus();
    return 0;
}`, why: "Tillståndet är en enum class i klassen, och switch översätter det till text." },
],
"polymorfism": [
  { t: "mc", q: R`<code>Base* p = new Derived; p-&gt;f();</code> där f <em>inte</em> är virtual. Vilken f körs?`, o: ["Derived::f", "Base::f", "Båda", "Odefinierat"], a: 1,
    why: "Utan virtual bestäms anropet av pekarens statiska typ, Base*." },
  { t: "mc", q: "Kan man skapa ett objekt av en abstrakt klass?", o: ["Ja, alltid", "Nej, bara av konkreta subklasser som implementerar alla rena virtuella funktioner", "Ja, med new", "Bara om den har en konstruktor"], a: 1,
    why: R`Men du kan ha pekare och referenser av den abstrakta typen, och det är hela poängen.` },
  { t: "multi", q: "Vilka hör hemma i en lätt polymorf basklass? Välj alla.", o: ["En virtuell destruktor", "Rena virtuella funktioner för gränssnittet", "Många datamedlemmar och beroenden", "Anrop av virtuella funktioner från konstruktorn"], a: [0, 1],
    why: "Virtuella anrop från konstruktorn går inte till subklassen, och tunga baser gör hierarkin svår att ändra." },
  { t: "text", q: R`Vilket nyckelord sätter du efter en metod i subklassen för att kompilatorn ska kontrollera att den överskuggar en virtuell funktion?`, accept: ["override"], ph: "nyckelord",
    why: R`<code>void tick() override;</code>` },
  { t: "text", q: R`Vad kallas tabellen som används för virtuell dispatch? Ett ord.`, accept: ["vtable", "v-table", "virtual table", "vtbl"], ph: "ord",
    why: "vtable: varje polymorf klass har en tabell med pekare till sina virtuella funktioner." },
  { t: "code", gpp: true, q: R`Abstrakt <code>Shape</code> med <code>virtual double area() const = 0</code>. Skriv <code>Rect</code> och <code>Circle</code> (π = 3.14). Indata: rader med <code>rect B H</code> eller <code>circle R</code>. Skriv ut total area.`,
    starter: R`#include <iostream>
#include <memory>
#include <string>
#include <vector>
using namespace std;

struct Shape {
    virtual ~Shape() = default;
    virtual double area() const = 0;
};

// skriv Rect och Circle


int main() {
    vector<unique_ptr<Shape>> shapes;
    string kind;
    while (cin >> kind) {
        if (kind == "rect") { double b, h; cin >> b >> h; shapes.push_back(make_unique<Rect>(b, h)); }
        else if (kind == "circle") { double r; cin >> r; shapes.push_back(make_unique<Circle>(r)); }
    }
    double total = 0;
    for (const auto& s : shapes) total += s->area();
    cout << total << endl;
    return 0;
}`,
    tests: [{ in: "rect 2 3\ncircle 1", out: "9.14" }, { in: "rect 4 5", out: "20" }, { in: "circle 2\ncircle 2", out: "25.12" }],
    sol: R`#include <iostream>
#include <memory>
#include <string>
#include <vector>
using namespace std;

struct Shape {
    virtual ~Shape() = default;
    virtual double area() const = 0;
};

struct Rect : Shape {
    double b, h;
    Rect(double b, double h) : b(b), h(h) {}
    double area() const override { return b * h; }
};

struct Circle : Shape {
    double r;
    Circle(double r) : r(r) {}
    double area() const override { return 3.14 * r * r; }
};

int main() {
    vector<unique_ptr<Shape>> shapes;
    string kind;
    while (cin >> kind) {
        if (kind == "rect") { double b, h; cin >> b >> h; shapes.push_back(make_unique<Rect>(b, h)); }
        else if (kind == "circle") { double r; cin >> r; shapes.push_back(make_unique<Circle>(r)); }
    }
    double total = 0;
    for (const auto& s : shapes) total += s->area();
    cout << total << endl;
    return 0;
}`, why: R`Loopen vet bara om <code>Shape</code>. Varje objekt bidrar med sin egen area via virtuell dispatch.` },
],
"agande-casting": [
  { t: "mc", q: R`Vad gör <code>auto q = std::move(p);</code> om p är en unique_ptr?`, o: ["Kopierar objektet", "Flyttar ägandet till q, och p blir nullptr", "Raderar objektet", "Ger kompileringsfel"], a: 1,
    why: "unique_ptr kan inte kopieras, bara flyttas." },
  { t: "multi", q: "När är RTTI (dynamic_cast, typeid) rimligt enligt materialet? Välj alla.", o: ["Migrering av legacy-kod där basen inte kan ändras", "Testkod och instrumentation", "I varje polymorft anrop", "Istället för att lägga till en virtuell funktion som saknas"], a: [0, 1],
    why: "Saknas en virtuell funktion är det oftast bättre att lägga till den." },
  { t: "text", q: R`Vad kastar <code>dynamic_cast&lt;Led&amp;&gt;(ref)</code> om objektet inte är en Led? Skriv typens namn.`, accept: ["std::bad_cast", "bad_cast"], ph: "std::...",
    why: R`<code>std::bad_cast</code>. Pekarvarianten returnerar nullptr istället.` },
  { t: "text", q: R`Vad kallas det när ett subklassobjekt kopieras till en basvariabel och tappar sin subklassdel? Två ord eller ett på engelska.`, accept: ["object slicing", "slicing", "objektslicing"], ph: "begrepp",
    why: "Object slicing." },
  { t: "code", gpp: true, q: R`Fabrik: skriv <code>unique_ptr&lt;Effect&gt; makeEffect(const string&amp; name)</code> som returnerar <code>Slow</code> för "slow", <code>Burn</code> för "burn" och annars nullptr. main skriver <code>okänd</code> för nullptr.`,
    starter: R`#include <iostream>
#include <memory>
#include <string>
using namespace std;

struct Effect { virtual ~Effect() = default; virtual void apply() = 0; };
struct Slow : Effect { void apply() override { cout << "Slow" << endl; } };
struct Burn : Effect { void apply() override { cout << "Burn" << endl; } };

unique_ptr<Effect> makeEffect(const string& name) {

}

int main() {
    string name;
    while (cin >> name) {
        auto e = makeEffect(name);
        if (e) e->apply();
        else cout << "okänd" << endl;
    }
    return 0;
}`,
    tests: [{ in: "slow burn", out: "Slow\nBurn" }, { in: "freeze slow", out: "okänd\nSlow" }],
    sol: R`#include <iostream>
#include <memory>
#include <string>
using namespace std;

struct Effect { virtual ~Effect() = default; virtual void apply() = 0; };
struct Slow : Effect { void apply() override { cout << "Slow" << endl; } };
struct Burn : Effect { void apply() override { cout << "Burn" << endl; } };

unique_ptr<Effect> makeEffect(const string& name) {
    if (name == "slow") return make_unique<Slow>();
    if (name == "burn") return make_unique<Burn>();
    return nullptr;
}

int main() {
    string name;
    while (cin >> name) {
        auto e = makeEffect(name);
        if (e) e->apply();
        else cout << "okänd" << endl;
    }
    return 0;
}`, why: "main känner bara till Effect. Nya effekter läggs till i fabriken." },
  { t: "code", gpp: true, q: R`Skriv <code>int countLeds(const vector&lt;unique_ptr&lt;Device&gt;&gt;&amp; ds)</code> som räknar LedActuator-objekt med <code>dynamic_cast</code>. Indata är en lista med <code>led</code> och <code>temp</code>.`,
    starter: R`#include <iostream>
#include <memory>
#include <string>
#include <vector>
using namespace std;

struct Device { virtual ~Device() = default; virtual void tick() = 0; };
struct TempSensor : Device { void tick() override {} };
struct LedActuator : Device { void tick() override {} };

int countLeds(const vector<unique_ptr<Device>>& ds) {

}

int main() {
    vector<unique_ptr<Device>> ds;
    string k;
    while (cin >> k) {
        if (k == "led") ds.push_back(make_unique<LedActuator>());
        else ds.push_back(make_unique<TempSensor>());
    }
    cout << countLeds(ds) << endl;
    return 0;
}`,
    tests: [{ in: "led temp led", out: "2" }, { in: "temp temp", out: "0" }, { in: "", out: "0" }],
    sol: R`#include <iostream>
#include <memory>
#include <string>
#include <vector>
using namespace std;

struct Device { virtual ~Device() = default; virtual void tick() = 0; };
struct TempSensor : Device { void tick() override {} };
struct LedActuator : Device { void tick() override {} };

int countLeds(const vector<unique_ptr<Device>>& ds) {
    int n = 0;
    for (const auto& d : ds) {
        if (dynamic_cast<LedActuator*>(d.get())) n++;
    }
    return n;
}

int main() {
    vector<unique_ptr<Device>> ds;
    string k;
    while (cin >> k) {
        if (k == "led") ds.push_back(make_unique<LedActuator>());
        else ds.push_back(make_unique<TempSensor>());
    }
    cout << countLeds(ds) << endl;
    return 0;
}`, why: R`<code>d.get()</code> ger den råa pekaren. dynamic_cast returnerar nullptr för allt som inte är en LedActuator.` },
],
"designmonster": [
  { t: "mc", q: "Ett larm, en logg och en display ska reagera när en sensor får ett nytt värde. Vilket mönster passar?", o: ["Singleton", "Observer", "Adapter", "Factory Method"], a: 1,
    why: "Sensorn meddelar alla registrerade observers utan att känna till dem." },
  { t: "mc", q: "En spelare ska kunna byta vapen under spelets gång. Vilket mönster passar?", o: ["Strategy", "Singleton", "Observer", "Adapter"], a: 0,
    why: R`<code>setAttack(std::make_unique&lt;FireballAttack&gt;())</code> byter beteendet.` },
  { t: "multi", q: "Vilka delar ingår i Observer-mönstret? Välj alla.", o: ["Ett subject som håller en lista med observers", "Ett Observer-gränssnitt med en notifieringsfunktion", "En privat konstruktor", "Konkreta observers som implementerar gränssnittet"], a: [0, 1, 3],
    why: "Privat konstruktor hör till Singleton." },
  { t: "text", q: "Vilket mönster samlar objektskapandet i en funktion eller klass? Skriv namnet på engelska.", accept: ["factory method", "factory", "factory pattern"], ph: "namn",
    why: "Factory Method." },
  { t: "code", gpp: true, q: R`Strategy: skriv <code>SwordAttack</code> (10 i skada) och <code>FireballAttack</code> (15). Indata är en lista med <code>sword</code> och <code>fireball</code>. Spelaren byter strategi och attackerar för varje ord. Skriv ut total skada.`,
    starter: R`#include <iostream>
#include <memory>
#include <string>
using namespace std;

struct AttackStrategy {
    virtual ~AttackStrategy() = default;
    virtual int damage() const = 0;
};

// skriv SwordAttack och FireballAttack


class Player {
    unique_ptr<AttackStrategy> attack_;
public:
    void setAttack(unique_ptr<AttackStrategy> a) { attack_ = move(a); }
    int attack() const { return attack_ ? attack_->damage() : 0; }
};

int main() {
    Player p;
    int total = 0;
    string w;
    while (cin >> w) {
        if (w == "sword") p.setAttack(make_unique<SwordAttack>());
        else if (w == "fireball") p.setAttack(make_unique<FireballAttack>());
        total += p.attack();
    }
    cout << total << endl;
    return 0;
}`,
    tests: [{ in: "sword sword fireball", out: "35" }, { in: "fireball", out: "15" }, { in: "", out: "0" }],
    sol: R`#include <iostream>
#include <memory>
#include <string>
using namespace std;

struct AttackStrategy {
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
    unique_ptr<AttackStrategy> attack_;
public:
    void setAttack(unique_ptr<AttackStrategy> a) { attack_ = move(a); }
    int attack() const { return attack_ ? attack_->damage() : 0; }
};

int main() {
    Player p;
    int total = 0;
    string w;
    while (cin >> w) {
        if (w == "sword") p.setAttack(make_unique<SwordAttack>());
        else if (w == "fireball") p.setAttack(make_unique<FireballAttack>());
        total += p.attack();
    }
    cout << total << endl;
    return 0;
}`, why: "Player vet inget om svärd eller eldklot. Nya attacker kräver ingen ändring i Player." },
  { t: "code", gpp: true, q: R`Observer: skriv <code>Alarm</code> som skriver <code>LARM V</code> när värdet V är över 30, och <code>Counter</code> som räknar notifieringar. main registrerar båda, skickar alla värden från indata och skriver till sist <code>N notifieringar</code>.`,
    starter: R`#include <iostream>
#include <vector>
using namespace std;

struct Observer {
    virtual ~Observer() = default;
    virtual void onNotify(int value) = 0;
};

class Sensor {
    vector<Observer*> observers_;
public:
    void addObserver(Observer* o) { observers_.push_back(o); }
    void newReading(int v) { for (auto* o : observers_) o->onNotify(v); }
};

// skriv Alarm och Counter (Counter har en publik int count)


int main() {
    Sensor s;
    Alarm alarm;
    Counter counter;
    s.addObserver(&alarm);
    s.addObserver(&counter);
    int v;
    while (cin >> v) s.newReading(v);
    cout << counter.count << " notifieringar" << endl;
    return 0;
}`,
    tests: [{ in: "20 35 31 10", out: "LARM 35\nLARM 31\n4 notifieringar" }, { in: "", out: "0 notifieringar" }],
    sol: R`#include <iostream>
#include <vector>
using namespace std;

struct Observer {
    virtual ~Observer() = default;
    virtual void onNotify(int value) = 0;
};

class Sensor {
    vector<Observer*> observers_;
public:
    void addObserver(Observer* o) { observers_.push_back(o); }
    void newReading(int v) { for (auto* o : observers_) o->onNotify(v); }
};

struct Alarm : Observer {
    void onNotify(int v) override {
        if (v > 30) cout << "LARM " << v << endl;
    }
};

struct Counter : Observer {
    int count = 0;
    void onNotify(int) override { count++; }
};

int main() {
    Sensor s;
    Alarm alarm;
    Counter counter;
    s.addObserver(&alarm);
    s.addObserver(&counter);
    int v;
    while (cin >> v) s.newReading(v);
    cout << counter.count << " notifieringar" << endl;
    return 0;
}`, why: "Sensorn vet bara om Observer-gränssnittet. Fler mottagare kräver ingen ändring i Sensor." },
],
"singleton-adapter": [
  { t: "mc", q: R`Varför markeras Singletonens kopieringskonstruktor med <code>= delete</code>?`, o: ["För att spara minne", "Så att ingen kan skapa en kopia och därmed en andra instans", "För att den ska bli virtuell", "Det behövs inte"], a: 1,
    why: R`<code>Logger y = Logger::instance();</code> blir då ett kompileringsfel.` },
  { t: "multi", q: "Vilka är alternativ till Singleton enligt materialet? Välj alla.", o: ["Dependency injection via konstruktorn", "Tillståndslösa hjälpfunktioner i ett namespace", "En Application-klass i main som äger systemen", "Fler globala variabler"], a: [0, 1, 2],
    why: "Globala variabler har samma problem som Singleton, utan kontrollen." },
  { t: "text", q: R`Vad heter den statiska metoden som ger åtkomst till singleton-objektet i materialets exempel?`, accept: ["instance", "instance()", "Logger::instance()", "Logger::instance"], ph: "metod",
    why: R`<code>Logger::instance()</code>` },
  { t: "text", q: "Vilket mönster översätter ett befintligt gränssnitt till det ditt system förväntar sig? Skriv namnet på engelska.", accept: ["adapter", "adapter pattern"], ph: "namn",
    why: "Adapter." },
  { t: "code", gpp: true, q: R`Skriv en Singleton <code>Config</code> med privat konstruktor som sätter <code>startHealth</code> till 100, borttagen kopiering, <code>static Config&amp; instance()</code>, samt <code>startHealth()</code> och <code>setStartHealth(int)</code>. main sätter värdet om indata finns och läser det via två anrop till instance().`,
    starter: R`#include <iostream>
using namespace std;

class Config {
    // Singleton här

};

int main() {
    int v;
    if (cin >> v) Config::instance().setStartHealth(v);
    Config& a = Config::instance();
    Config& b = Config::instance();
    cout << a.startHealth() << " " << (&a == &b ? "samma" : "olika") << endl;
    return 0;
}`,
    tests: [{ in: "", out: "100 samma" }, { in: "250", out: "250 samma" }],
    sol: R`#include <iostream>
using namespace std;

class Config {
public:
    static Config& instance() {
        static Config inst;
        return inst;
    }
    int startHealth() const { return startHealth_; }
    void setStartHealth(int v) { startHealth_ = v; }

    Config(const Config&) = delete;
    Config& operator=(const Config&) = delete;
private:
    Config() : startHealth_(100) {}
    int startHealth_;
};

int main() {
    int v;
    if (cin >> v) Config::instance().setStartHealth(v);
    Config& a = Config::instance();
    Config& b = Config::instance();
    cout << a.startHealth() << " " << (&a == &b ? "samma" : "olika") << endl;
    return 0;
}`, why: R`Båda referenserna pekar på samma objekt. Den lokala <code>static</code>-variabeln skapas en gång.` },
  { t: "code", gpp: true, q: R`Adapter: <code>OldThermo</code> har <code>int readTenths()</code> (tiondels grader). Skriv <code>ThermoAdapter</code> som implementerar <code>ISensor::read()</code> och returnerar grader som double.`,
    starter: R`#include <iostream>
using namespace std;

class OldThermo {              // kan inte ändras
    int tenths_;
public:
    OldThermo(int t) : tenths_(t) {}
    int readTenths() const { return tenths_; }
};

class ISensor {
public:
    virtual ~ISensor() = default;
    virtual double read() const = 0;
};

// skriv ThermoAdapter


int main() {
    int t;
    cin >> t;
    ThermoAdapter a{OldThermo(t)};
    const ISensor& s = a;
    cout << s.read() << endl;
    return 0;
}`,
    tests: [{ in: "235", out: "23.5" }, { in: "-50", out: "-5" }],
    sol: R`#include <iostream>
using namespace std;

class OldThermo {              // kan inte ändras
    int tenths_;
public:
    OldThermo(int t) : tenths_(t) {}
    int readTenths() const { return tenths_; }
};

class ISensor {
public:
    virtual ~ISensor() = default;
    virtual double read() const = 0;
};

class ThermoAdapter : public ISensor {
    OldThermo old_;
public:
    explicit ThermoAdapter(OldThermo old) : old_(old) {}
    double read() const override { return old_.readTenths() / 10.0; }
};

int main() {
    int t;
    cin >> t;
    ThermoAdapter a{OldThermo(t)};
    const ISensor& s = a;
    cout << s.read() << endl;
    return 0;
}`, why: R`Adaptern översätter både metodnamnet och enheten. <code>/ 10.0</code> ger decimaldivision.` },
],
"git-samarbete": [
  { t: "mc", q: "Du och din partner jobbar på samma branch och får konflikter hela tiden. Vad är bästa åtgärden?", o: ["Pusha med --force", "Ta varsin feature branch och merga via PR", "Sluta committa", "Jobba i main"], a: 1,
    why: "Båda på samma branch är ett av de vanliga misstagen." },
  { t: "multi", q: "Vad ska en PR-beskrivning innehålla? Välj alla.", o: ["Vad som lagts till", "Varför", "Om något är oklart eller behöver feedback", "Hela källkoden igen"], a: [0, 1, 2],
    why: "Koden syns redan i diffen." },
  { t: "text", q: R`Skriv kommandot som skapar och byter till branchen <code>feature/items</code>.`, accept: ["git checkout -b feature/items", "git switch -c feature/items"], ph: "git ...",
    why: R`<code>git checkout -b feature/items</code>` },
  { t: "text", q: R`Skriv kommandot som pushar <code>feature/items</code> första gången och sätter upstream.`, accept: ["git push -u origin feature/items", "git push --set-upstream origin feature/items"], ph: "git push ...",
    why: R`<code>git push -u origin feature/items</code>` },
],
};
