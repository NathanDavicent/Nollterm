const R = String.raw;

const TOPICS = [
/* ================================================================ 01 */
{
  id: "kom-igang", cat: "Grunder", min: 7,
  title: "Kom igång med C och C++",
  lead: "Skriv, kompilera och kör ditt första program, och lär dig vad som skiljer C från C++.",
  src: ["C/C++ – V39 Studiehäfte"],
  goals: [
    "Förklara skillnaden mellan C och C++ på en grundläggande nivå",
    "Kompilera och köra ett program, både i en IDE och från terminalen",
    "Använda variabler, de vanligaste datatyperna och operatorer",
  ],
  blocks: [
    ["h", "C och C++: släkt men inte samma"],
    ["p", R`<strong>C</strong> är ett litet, procedurellt språk som ligger nära hårdvaran. Det finns en C-kompilator till nästan varje mikrokontroller, och därför är C fortfarande standard i inbyggda system. <strong>C++</strong> bygger vidare på C och lägger till bland annat klasser, referenser, <code>std::string</code>, <code>std::vector</code> och exceptions.`],
    ["p", R`Det mesta av giltig C-kod kompilerar också som C++, men inte tvärtom. I den här kursen skriver du båda, ofta samma uppgift två gånger, så att du ser vad C++ gör enklare och vad C kräver att du gör själv.`],
    ["table", ["", "C", "C++"], [
      ["Utskrift", R`<code>printf</code> från <code>&lt;stdio.h&gt;</code>`, R`<code>std::cout</code> från <code>&lt;iostream&gt;</code>`],
      ["Inläsning", R`<code>scanf</code>, <code>fgets</code>`, R`<code>std::cin</code>, <code>std::getline</code>`],
      ["Text", R`<code>char</code>-array som slutar med <code>'\0'</code>`, R`<code>std::string</code>`],
      ["Filändelse", ".c", ".cpp"],
      ["Kompilator (CLI)", "gcc", "g++"],
    ]],
    ["h", "Sätt upp din miljö"],
    ["p", R`Det finns två vägar. Båda fungerar, välj den du trivs med.`],
    ["list", [
      R`<strong>A. IDE (rekommenderas för nybörjare):</strong> Visual Studio, CLion, Code::Blocks eller Dev-C++. Du skriver, kompilerar, kör och debuggar på samma ställe.`,
      R`<strong>B. Kommandoraden:</strong> gcc/g++ via MinGW på Windows, eller i terminalen på Linux och Mac.`,
    ]],
    ["code", "bash", R`# Kompilera och kör från terminalen
gcc hello.c -o hello      # C
g++ hello.cpp -o hello    # C++
./hello                   # Windows: hello.exe`, "terminal"],
    ["h", "Hello, World"],
    ["p", R`Första milstolpen i ett nytt språk är att få ut en rad text. Då vet du att kompilatorn, länkningen och körningen fungerar.`],
    ["code", "c", R`#include <stdio.h>

int main(void) {
    printf("Hello, World!\n");
    return 0;   // 0 betyder "allt gick bra"
}`, "hello.c"],
    ["code", "cpp", R`#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`, "hello.cpp"],
    ["h", "Variabler och datatyper"],
    ["p", R`En variabel är en namngiven behållare för data. Typen bestämmer vilka värden som får plats och hur mycket minne som används.`],
    ["table", ["Typ", "Innehåll", "Exempel", "Vanlig storlek"], [
      [R`<code>int</code>`, "heltal", R`<code>int age = 20;</code>`, "4 byte"],
      [R`<code>float</code>`, "decimaltal", R`<code>float price = 19.99f;</code>`, "4 byte"],
      [R`<code>double</code>`, "decimaltal, högre precision", R`<code>double pi = 3.14159;</code>`, "8 byte"],
      [R`<code>char</code>`, "ett tecken", R`<code>char grade = 'A';</code>`, "1 byte"],
      [R`<code>bool</code>`, "sant/falskt", R`<code>bool on = true;</code>`, "1 byte"],
      [R`<code>std::string</code>`, "text (bara C++)", R`<code>std::string name = "Anna";</code>`, "varierar"],
    ]],
    ["note", "tip", R`Storlekarna gäller en vanlig PC. På en mikrokontroller kan <code>int</code> vara 2 byte. Kontrollera med <code>sizeof(int)</code> när det spelar roll.`],
    ["h", "Operatorer"],
    ["list", [
      R`<strong>Aritmetiska:</strong> <code>+ - * / %</code>`,
      R`<strong>Jämförelse:</strong> <code>== != &lt; &gt; &lt;= &gt;=</code>, ger alltid sant eller falskt`,
      R`<strong>Logiska:</strong> <code>&amp;&amp;</code> (och), <code>||</code> (eller), <code>!</code> (inte)`,
    ]],
    ["code", "cpp", R`int a = 7, b = 2;
std::cout << a / b   << "\n";   // 3   heltalsdivision, decimalerna kapas
std::cout << a % b   << "\n";   // 1   resten
std::cout << 7.0 / 2 << "\n";   // 3.5 minst ett decimaltal ger decimaldivision`, "heltalsdivision"],
    ["note", "warn", R`<code>=</code> tilldelar, <code>==</code> jämför. <code>if (x = 5)</code> kompilerar men sätter x till 5 och är alltid sant.`],
    ["h", "Mini-labb"],
    ["ex", "Ditt första program", R`<p>Skriv ett program som:</p><ol><li>skriver ut ditt namn och din ålder</li><li>beräknar summan av två tal</li><li>avgör om åldern är över eller under 18</li></ol><p>Gör det i både C och C++. För varje nytt begrepp: slå upp det på cppreference.com.</p>`,
      R`#include <iostream>
#include <string>

int main() {
    std::string name = "Nathanael";
    int age = 20;
    int x = 4, y = 7;

    std::cout << name << ", " << age << " år\n";
    std::cout << "Summa: " << x + y << "\n";
    if (age >= 18) {
        std::cout << "Myndig\n";
    } else {
        std::cout << "Under 18\n";
    }
    return 0;
}`, "cpp"],
  ],
  quiz: [
    { q: R`Vad skriver <code>std::cout &lt;&lt; 7 / 2;</code> ut?`, o: ["3.5", "3", "4", "3.0"], a: 1,
      why: R`Båda operanderna är <code>int</code>, så det blir heltalsdivision och decimalerna kapas. Skriv <code>7.0 / 2</code> för att få 3.5.` },
    { q: "Vilken typ passar bäst för ett enskilt tecken, till exempel betyget 'A'?", o: [R`<code>std::string</code>`, R`<code>char</code>`, R`<code>int</code>`, R`<code>bool</code>`], a: 1,
      why: R`<code>char</code> rymmer exakt ett tecken (1 byte). Enkla citattecken <code>'A'</code> betyder ett tecken, dubbla <code>"A"</code> betyder en sträng.` },
    { q: "Vilket påstående om C och C++ stämmer?", o: [R`<code>std::string</code> finns bara i C++`, "C har klasser precis som C++", R`C++ kan inte använda <code>printf</code>`, "C-kod måste skrivas om helt för att kompilera som C++"], a: 0,
      why: R`Standardbiblioteket med <code>std::string</code>, <code>std::vector</code> och <code>std::cout</code> är C++. C++ kan fortfarande använda <code>printf</code> via <code>&lt;cstdio&gt;</code>.` },
    { q: R`Vad blir <code>10 % 3</code>?`, o: ["3", "0", "1", "3.33"], a: 2,
      why: R`<code>%</code> ger resten vid heltalsdivision: 10 = 3 · 3 + <strong>1</strong>.` },
    { q: "Vilken operator betyder logiskt OCH?", o: [R`<code>&amp;</code>`, R`<code>&amp;&amp;</code>`, R`<code>||</code>`, R`<code>!</code>`], a: 1,
      why: R`<code>&amp;&amp;</code> är logiskt och. En ensam <code>&amp;</code> är bitvis och, eller adressoperatorn, beroende på sammanhang.` },
  ],
},

/* ================================================================ 02 */
{
  id: "villkor", cat: "Grunder", min: 6,
  title: "Villkor och menyval",
  lead: "Låt programmet välja väg med if, else och switch, och bygg en meny som användaren styr.",
  src: ["C/C++ – V39 Studiehäfte", "Repetitionsövningar"],
  goals: [
    "Skriva logiska uttryck som blir sanna eller falska",
    "Använda if, else if och else, och veta när switch passar bättre",
    "Bygga ett menyprogram som upprepas tills användaren avslutar",
  ],
  blocks: [
    ["h", "Logiska uttryck"],
    ["p", R`Jämförelser som <code>temp &gt; 25</code> blir alltid <code>true</code> eller <code>false</code>. I C++ finns typen <code>bool</code>. I C räknas <code>0</code> som falskt och allt annat som sant, men du kan inkludera <code>&lt;stdbool.h&gt;</code> för att få <code>bool</code>, <code>true</code> och <code>false</code>.`],
    ["code", "cpp", R`bool tooHot   = temp > 25.0;
bool inRange  = temp >= 18.0 && temp <= 24.0;
bool alarm    = tooHot || sensorFailed;
bool ok       = !alarm;`],
    ["h", "if, else if, else"],
    ["p", R`Använd if/else när du jämför intervall. Villkoren testas uppifrån och ner, och det första som är sant vinner.`],
    ["code", "cpp", R`int age;
std::cin >> age;

if (age < 13) {
    std::cout << "Barn\n";
} else if (age < 20) {
    std::cout << "Ungdom\n";
} else if (age < 65) {
    std::cout << "Vuxen\n";
} else {
    std::cout << "Pensionär\n";
}`, "ålderskategori"],
    ["h", "switch för fasta val"],
    ["p", R`<code>switch</code> passar när värdet ska jämföras mot ett antal fasta konstanter, som menyval. Varje <code>case</code> avslutas med <code>break</code>, annars fortsätter körningen in i nästa case.`],
    ["code", "c", R`switch (choice) {
    case 1: printf("Area\n");   break;
    case 2: printf("Volym\n");  break;
    case 3: printf("Hej då\n"); break;
    default: printf("Fel val!\n");
}`],
    ["h", "Kodstil som sparar dig buggar"],
    ["list", [
      R`Använd alltid klamrar <code>{ }</code>, även när blocket bara är en rad. När du lägger till en rad senare hamnar den annars utanför villkoret.`,
      "Använd if/else för intervall, till exempel åldersgrupper eller temperaturgränser.",
      "Använd switch för menyer och fasta val.",
      "Indentera konsekvent så att blockstrukturen syns.",
    ]],
    ["code", "cpp", R`if (x > 0);          // semikolonet avslutar if-satsen här
{
    std::cout << "Körs alltid!\n";
}

if (x = 0) { }       // tilldelning, inte jämförelse: alltid falskt`, "två klassiska fällor"],
    ["h", "Labb: miniräknare med meny"],
    ["p", R`Menyn ska visas om och om igen tills användaren väljer att avsluta. En <code>do-while</code>-loop passar bra, eftersom menyn alltid ska visas minst en gång (mer om loopar i nästa ämne).`],
    ["code", "cpp", R`#include <iostream>

int main() {
    int choice;
    do {
        std::cout << "\n1. Addera\n2. Subtrahera\n3. Multiplicera\n4. Dividera\n5. Avsluta\nVal: ";
        std::cin >> choice;
        if (choice >= 1 && choice <= 4) {
            double a, b;
            std::cout << "Två tal: ";
            std::cin >> a >> b;
            switch (choice) {
                case 1: std::cout << a + b << "\n"; break;
                case 2: std::cout << a - b << "\n"; break;
                case 3: std::cout << a * b << "\n"; break;
                case 4:
                    if (b == 0) std::cout << "Kan inte dela med noll\n";
                    else        std::cout << a / b << "\n";
                    break;
            }
        } else if (choice != 5) {
            std::cout << "Ogiltigt val\n";
        }
    } while (choice != 5);
    return 0;
}`, "kalkylator.cpp"],
    ["ex", "Utöka miniräknaren", R`<ul><li>Lägg till potens (x<sup>y</sup>) och rest (modulus, <code>%</code>).</li><li>Tips: <code>std::pow</code> finns i <code>&lt;cmath&gt;</code>. <code>%</code> fungerar bara på heltal; för decimaltal finns <code>std::fmod</code>.</li></ul>`],
    ["ex", "Skottår", R`<p>Läs in ett år och skriv ut om det är ett skottår. Regeln: delbart med 4, men inte med 100, om det inte också är delbart med 400.</p>`,
      R`bool isLeap(int y) {
    return (y % 4 == 0 && y % 100 != 0) || (y % 400 == 0);
}`, "cpp"],
    ["ex", "Positivt, negativt eller noll", R`<p>Läs in ett heltal och skriv ut om det är positivt, negativt eller noll. Tre grenar: <code>if</code>, <code>else if</code>, <code>else</code>.</p>`],
  ],
  quiz: [
    { q: R`Vad händer om du glömmer <code>break</code> i ett <code>case</code>?`, o: ["Kompilatorn ger ett fel", "Körningen fortsätter in i nästa case", "Programmet hoppar till default", "Inget, break är valfritt och påverkar inget"], a: 1,
      why: R`Det kallas <em>fall-through</em>: koden i följande case körs också, tills ett <code>break</code> eller slutet på switchen nås.` },
    { q: "Vilket uttryck är sant när x ligger mellan 10 och 20, inklusive gränserna?", o: [R`<code>10 &lt;= x &lt;= 20</code>`, R`<code>x &gt;= 10 || x &lt;= 20</code>`, R`<code>x &gt;= 10 &amp;&amp; x &lt;= 20</code>`, R`<code>x &gt; 10 &amp;&amp; x &lt; 20</code>`], a: 2,
      why: R`Båda villkoren måste gälla, alltså <code>&amp;&amp;</code>. <code>10 &lt;= x &lt;= 20</code> kompilerar men betyder <code>(10 &lt;= x) &lt;= 20</code>, vilket alltid är sant.` },
    { q: "När passar switch bäst?", o: ["När du jämför intervall, som åldersgrupper", "När ett värde ska matchas mot fasta val, som en meny", "När du jämför två strängar", "När villkoret är ett decimaltal"], a: 1,
      why: R`switch jämför mot konstanta heltalsvärden (eller tecken). Intervall och decimaltal hanteras med if/else.` },
    { q: R`Vad gör <code>if (x = 0) { ... }</code>?`, o: ["Kontrollerar om x är 0", "Sätter x till 0, och blocket körs aldrig", "Ger kompileringsfel", "Sätter x till 0, och blocket körs alltid"], a: 1,
      why: R`<code>=</code> är tilldelning. Uttrycket får värdet 0, som räknas som falskt, så blocket hoppas över. Dessutom har x skrivits över.` },
    { q: "Varför ska du använda klamrar även runt en enda rad?", o: ["Koden går snabbare", "Annars kompilerar den inte", "En rad som läggs till senare hamnar annars utanför villkoret", "Klamrar krävs bara i C"], a: 2,
      why: R`Utan klamrar hör bara nästa sats till if-satsen. Indenteringen kan lura dig att tro att fler rader gör det.` },
  ],
},

/* ================================================================ 03 */
{
  id: "loopar", cat: "Kontrollflöde", min: 9,
  title: "Loopar och iteration",
  lead: "Upprepa kod med for, while och do-while, och känn igen de vanligaste loopbuggarna innan de händer.",
  src: ["Torsdag 2/10 – Loopar", "Repetitionsövningar"],
  date: "Tors 2/10",
  goals: [
    "Välja rätt loop: for, while eller do-while",
    "Gå igenom arrayer och vektorer med index och med range-based for",
    "Summera, hitta min/max, räkna och söka i en lista",
    "Känna igen off-by-one, oändliga loopar och division med noll",
  ],
  blocks: [
    ["h", "Vilket problem löser loopar?"],
    ["list", [
      R`<strong>Mindre upprepning:</strong> skriv logiken en gång och låt loopen köra den så många gånger som behövs.`,
      R`<strong>Bearbeta samlad data:</strong> arrayer, listor och andra sekvenser.`,
      R`<strong>Automatisera:</strong> validera input tills den är giltig, summera mätvärden, söka efter ett värde.`,
    ]],
    ["h", "Snabbintro: arrayer"],
    ["p", R`En array lagrar flera värden av samma typ bredvid varandra i minnet. Du når varje värde med ett <strong>index som börjar på 0</strong>. En array med 5 element har alltså index 0–4.`],
    ["code", "c", R`int temps[5] = {21, 22, 20, 19, 23};
printf("%d\n", temps[0]);   // 21, första värdet
printf("%d\n", temps[4]);   // 23, sista värdet`, "C"],
    ["code", "cpp", R`#include <vector>
std::vector<int> temps = {21, 22, 20, 19, 23};
temps.push_back(25);              // vektorn växer
std::cout << temps.size();        // 6`, "C++: std::vector är flexiblare och säkrare"],
    ["h", "for-loopen"],
    ["p", R`Används när du vet hur många varv det blir, eller när du ska gå igenom alla element i en array.`],
    ["code", "cpp", R`for (int i = 0; i < 5; i++) {      // start; villkor; uppdatering
    std::cout << "Temp " << i << ": " << temps[i] << "\n";
}

// Range-based for (bara C++): inget index behövs
for (int t : temps) {
    std::cout << t << " ";
}`],
    ["widget", "offbyone"],
    ["h", "while-loopen"],
    ["p", R`Upprepar så länge ett villkor är sant. Du vet inte nödvändigtvis i förväg hur många varv det blir, till exempel när du väntar på giltig input eller på att ett sensorvärde ska passera en tröskel.`],
    ["code", "cpp", R`int value = -1;
while (value < 0 || value > 100) {
    std::cout << "Ange ett värde 0–100: ";
    std::cin >> value;
}`],
    ["h", "do-while-loopen"],
    ["p", R`Som while, men villkoret kontrolleras <em>efter</em> varje varv. Kroppen körs därför alltid minst en gång. Typexemplet är en meny som ska visas innan användaren hunnit välja något.`],
    ["code", "cpp", R`int choice;
do {
    printMenu();
    std::cin >> choice;
} while (choice != 0);`],
    ["table", ["Loop", "Använd när", "Exempel"], [
      ["for", "antalet varv är känt eller kan räknas", "gå igenom en array"],
      ["while", "du upprepar tills något händer", "läs input tills den är giltig"],
      ["do-while", "kroppen ska köras minst en gång", "menyprogram"],
    ]],
    ["h", "Iterationsmönster"],
    ["p", R`Fyra mönster återkommer hela tiden: summera, hitta min/max, räkna och söka. Du kommer att använda alla i inlämningsuppgiften.`],
    ["code", "cpp", R`std::vector<double> v = {21.5, 22.0, 19.8, 23.4, 20.1};

double sum = 0;                     // nollställ före loopen
double minV = v[0], maxV = v[0];    // starta med första värdet, inte 0
int evenCount = 0;
int foundAt = -1;

for (size_t i = 0; i < v.size(); i++) {
    sum += v[i];
    if (v[i] < minV) minV = v[i];
    if (v[i] > maxV) maxV = v[i];
    if (static_cast<int>(v[i]) % 2 == 0) evenCount++;
    if (foundAt == -1 && v[i] == 23.4) foundAt = i;
}

if (!v.empty()) {
    std::cout << "Medel: " << sum / v.size() << "\n";
}`, "summa, min/max, räkna, sök"],
    ["h", "Vanliga fel i loopar"],
    ["list", [
      R`<strong>Off-by-one:</strong> ett varv för mycket eller för lite, ofta <code>&lt;=</code> där det skulle vara <code>&lt;</code>.`,
      R`<strong>Oändlig loop:</strong> loopvariabeln uppdateras aldrig, eller villkoret kan aldrig bli falskt.`,
      R`<strong>Felaktig initiering:</strong> summan nollställs inte före loopen.`,
      R`<strong>Loopvariabeln ändras inuti loopen</strong> på ett sätt du inte räknat med.`,
      R`<strong>Division med noll:</strong> medelvärdet av en tom lista.`,
    ]],
    ["h", "Övningar"],
    ["ex", "1–10 med alla tre looparna", R`<ul><li>Skriv ut talen 1–10 med for, while och do-while.</li><li>Skriv ut 10–1 baklänges med en while-loop.</li><li>Förutsäg vad som skrivs ut innan du kör koden.</li></ul>`],
    ["ex", "Statistik på en array", R`<ol><li>Skapa en array med minst 5 tal och beräkna summa och medelvärde.</li><li>Hitta det minsta och största talet.</li><li>Räkna hur många av talen som är jämna.</li></ol>`],
    ["ex", "FizzBuzz", R`<p>Skriv ut 1–100, men byt ut multipler av 3 mot "Fizz", multipler av 5 mot "Buzz" och multipler av båda mot "FizzBuzz".</p>`,
      R`for (int i = 1; i <= 100; i++) {
    if (i % 15 == 0)      std::cout << "FizzBuzz\n";   // testa det mest specifika först
    else if (i % 3 == 0)  std::cout << "Fizz\n";
    else if (i % 5 == 0)  std::cout << "Buzz\n";
    else                  std::cout << i << "\n";
}`, "cpp"],
    ["ex", "Primtalskontroll", R`<p>Läs in ett tal med <code>std::cin</code> och avgör med en loop om det är ett primtal. Det räcker att testa delare upp till √n.</p>`,
      R`bool isPrime(int n) {
    if (n < 2) return false;
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) return false;
    }
    return true;
}`, "cpp"],
    ["ex", "Debugga buggyLoops.cpp", R`<p>Klona kursens repo och hitta buggarna (oändlig loop, off-by-one) i <code>buggyLoops.cpp</code>: <a href="https://github.com/CalleFreme/c-cpp-cj" target="_blank" rel="noopener">github.com/CalleFreme/c-cpp-cj</a>.</p>`],
  ],
  quiz: [
    { q: "Vilken loop körs alltid minst en gång?", o: ["for", "while", "do-while", "range-based for"], a: 2,
      why: "do-while kontrollerar villkoret efter varje varv, så kroppen hinner köras en gång innan villkoret testas." },
    { q: R`<code>int a[5];</code> loopas med <code>for (int i = 0; i &lt;= 5; i++)</code>. Vad är problemet?`, o: ["Inget, loopen går igenom alla fem", "Loopen hoppar över a[0]", "Loopen läser a[5], som ligger utanför arrayen", "Loopen blir oändlig"], a: 2,
      why: R`Giltiga index är 0–4. Med <code>&lt;=</code> körs ett sjätte varv med i = 5: ett klassiskt off-by-one-fel som läser minne utanför arrayen.` },
    { q: "Vad är den vanligaste orsaken till en oändlig loop?", o: ["För många varv i en for-loop", "Loopvariabeln uppdateras aldrig", "Att använda break", "Att loopa över en tom vektor"], a: 1,
      why: "Om inget i loopen ändrar det som villkoret testar förblir villkoret sant för evigt." },
    { q: R`Vad stämmer om <code>for (int t : temps)</code>?`, o: ["Det fungerar i både C och C++", "Det går igenom varje element utan att du behöver ett index", "Det ändrar elementen i temps", "Det kräver att temps är en std::map"], a: 1,
      why: R`Range-based for finns bara i C++. <code>t</code> är en kopia av varje element. Vill du ändra elementen skriver du <code>int&amp; t</code>.` },
    { q: "Varför kontrollerar man att listan inte är tom innan man beräknar medelvärdet?", o: ["För att loopen annars blir oändlig", "För att undvika division med noll", "För att summan annars blir negativ", "Det behövs inte"], a: 1,
      why: R`Medelvärdet är summa / antal. Med 0 element delar du med 0: ett körningsfel för heltal och <code>nan</code> för decimaltal.` },
  ],
},

/* ================================================================ 04 */
{
  id: "funktioner", cat: "Funktioner", min: 11,
  title: "Funktioner och anropsstacken",
  lead: "Dela upp programmet i små delar med ett tydligt ansvar, och se vad som händer i minnet när en funktion anropas.",
  src: ["Tis 6/10 – Funktioner", "Startkod för klasser och structs (tabellen om const, & och *)"],
  date: "Tis 6/10",
  goals: [
    "Skriva, anropa och förklara funktioner i C och C++",
    "Skilja på parametrar och argument, och på deklaration och definition",
    "Förklara call by value, call by pointer och call by reference",
    "Beskriva hur stack frames läggs på och tas bort från anropsstacken",
  ],
  blocks: [
    ["h", "Vad är en funktion?"],
    ["p", R`En funktion är en namngiven, återanvändbar del av programmet. Den tar <strong>in</strong> data (parametrar), gör något och kan <strong>returnera</strong> ett resultat. Funktioner gör koden mer strukturerad, modulär och lättläst.`],
    ["p", R`Sträva efter <strong>single responsibility</strong>: funktionen gör precis det som namnet säger, varken mer eller mindre. En funktion som heter <code>average</code> räknar ut ett medelvärde. Den skriver inte ut det.`],
    ["code", "cpp", R`returtyp namn(typ parameter1, typ parameter2) {
    // kropp
    return värde;          // utelämnas om returtypen är void
}`, "allmän syntax"],
    ["code", "cpp", R`void greetUser() {                          // ingen indata, inget returvärde
    std::cout << "Välkommen!\n";
}

float average(float a, float b) {            // parametrar och returvärde
    return (a + b) / 2.0f;
}

int main() {
    greetUser();
    float avg = average(21.5f, 23.5f);       // 21.5f och 23.5f är argument
    std::cout << avg << "\n";                // 22.5
}`],
    ["note", "tip", R`Returnera resultatet istället för att skriva ut det i funktionen, om syftet är en beräkning. Då kan den som anropar välja vad som ska hända med värdet.`],
    ["h", "Parametrar och argument"],
    ["p", R`<strong>Parametrar</strong> är variablerna i funktionens definition (<code>a</code> och <code>b</code> ovan). <strong>Argument</strong> är de faktiska värdena du skickar in vid anropet (<code>21.5f</code> och <code>23.5f</code>).`],
    ["h", "Deklarera och definiera"],
    ["p", R`Kompilatorn läser uppifrån och ner. Om <code>main</code> anropar en funktion som definieras längre ner måste funktionen <strong>deklareras</strong> först med en prototyp. <strong>Definitionen</strong> innehåller själva kroppen.`],
    ["code", "cpp", R`float toKelvin(float celsius);               // deklaration (prototyp)

int main() {
    std::cout << toKelvin(20.0f) << "\n";
}

float toKelvin(float celsius) {              // definition
    return celsius + 273.15f;
}`],
    ["h", "Call by value och stacken"],
    ["p", R`Som standard får funktionen en <strong>kopia</strong> av argumentet. Ändringar inuti funktionen påverkar inte originalet.`],
    ["code", "cpp", R`void increment(int x) { x++; }

int main() {
    int a = 5;
    increment(a);
    std::cout << a;      // 5, bara kopian ökade
}`],
    ["p", R`Varje funktion som körs behöver en plats i minnet för sina parametrar och lokala variabler. Den platsen kallas <strong>stack frame</strong> och ligger på <strong>anropsstacken</strong> (call stack). Vid ett anrop läggs en ny frame överst. När funktionen returnerar tas den bort igen, och dess lokala variabler finns inte längre. Stega igenom programmet nedan:`],
    ["widget", "stack"],
    ["h", "Pekare (C)"],
    ["p", R`Om funktionen ska ändra originalet skickar du dess <strong>adress</strong>. En pekare är en variabel som innehåller en adress.`],
    ["list", [
      R`<code>int* p</code> deklarerar en pekare till int.`,
      R`<code>&amp;x</code> ger adressen till x (adressoperatorn).`,
      R`<code>*p</code> ger värdet som p pekar på (avreferering, eng. <em>dereferencing</em>).`,
    ]],
    ["code", "c", R`void swap(int* a, int* b) {
    int tmp = *a;     // läs värdet på adressen a
    *a = *b;
    *b = tmp;
}

int x = 1, y = 2;
swap(&x, &y);         // skicka adresserna
// nu är x == 2 och y == 1`, "swap med pekare"],
    ["h", "Referenser (C++)"],
    ["p", R`C++ har ett enklare och säkrare sätt: en <strong>referens</strong> är ett alias för originalet. Ingen <code>*</code> eller <code>&amp;</code> behövs i anropet, och en referens kan aldrig vara null.`],
    ["code", "cpp", R`void swap(int& a, int& b) {
    int tmp = a;
    a = b;
    b = tmp;
}

swap(x, y);           // anropet ser ut som vanligt`],
    ["p", R`Vill du slippa kopian men inte tillåta ändringar, använd en <strong>konstant referens</strong>. Det är standardvalet för stora objekt som bara ska läsas.`],
    ["code", "cpp", R`void printData(const std::vector<int>& data) {
    for (int v : data) std::cout << v << " ";
    // data.push_back(1);   // kompileringsfel: data är const
}`],
    ["table", ["Signatur", "Betyder", "Använd när"], [
      [R`<code>void f(int x)</code>`, "kopia (pass by value)", "datan är liten, som ett heltal"],
      [R`<code>void f(int&amp; x)</code>`, "referens, ingen kopia, kan ändras", "funktionen ska ändra originalet"],
      [R`<code>void f(const T&amp; x)</code>`, "konstant referens, ingen kopia, kan inte ändras", "stora objekt (vector, string) som bara läses"],
      [R`<code>void f(int* p)</code>`, "pekare, en adress till värdet", "i C, eller med dynamiskt minne"],
    ]],
    ["h", "Överlagring (overloading)"],
    ["p", R`I C++ kan flera funktioner ha samma namn så länge parametrarna skiljer sig. Kompilatorn väljer version utifrån argumentens typer.`],
    ["code", "cpp", R`void printSensor(int v)    { std::cout << "int: "    << v << "\n"; }
void printSensor(float v)  { std::cout << "float: "  << v << "\n"; }
void printSensor(double v) { std::cout << "double: " << v << "\n"; }

printSensor(3);       // int-versionen
printSensor(3.0f);    // float-versionen
printSensor(3.0);     // double-versionen`],
    ["h", "Övningar"],
    ["ex", "Grundläggande funktioner", R`<ol><li><code>int square(int x)</code> som returnerar kvadraten</li><li><code>float average(float a, float b, float c)</code></li><li><code>float maxOfThree(float a, float b, float c)</code></li><li><code>bool isEven(int n)</code></li><li><code>int sumRange(int start, int end)</code>, där <code>sumRange(1, 4)</code> ger 10</li><li><code>float toKelvin(float celsius)</code></li></ol>`,
      R`int sumRange(int start, int end) {
    int sum = 0;
    for (int i = start; i <= end; i++) sum += i;
    return sum;
}`, "cpp"],
    ["ex", "Value, referens och pekare", R`<ol><li>Skriv <code>void increment(int x)</code> och <code>void incrementRef(int&amp; x)</code>. Anropa båda i <code>main</code> och se vilken som ändrar värdet.</li><li>C-version: <code>void incrementPtr(int* x)</code>.</li><li>Skriv <code>void setLedState(bool* led, bool state)</code> och <code>void getTempRange(float* min, float* max)</code>.</li><li>Skriv om <code>swap</code> med referenser.</li></ol>`],
    ["ex", "Statistik för tre mätvärden", R`<p>Fråga användaren efter tre värden. Skriv <code>getAverage</code>, <code>getMax</code> och <code>printStats</code> och skriv ut Min, Max och Medel.</p>`],
    ["ex", "Utmaning: mini-sensormodul", R`<ul><li><code>float readSensor()</code> returnerar ett slumpvärde 0–100.</li><li><code>void printSensorData(const float&amp; value)</code> skriver ut värdet med enhet.</li><li><code>void analyzeSensor(float&amp; value)</code> justerar värdet om det är över 80.</li><li>Simulera flera avläsningar i en loop.</li></ul>`,
      R`#include <cstdlib>
#include <ctime>

float readSensor() {
    return static_cast<float>(std::rand() % 1001) / 10.0f;   // 0.0–100.0
}

void analyzeSensor(float& value) {
    if (value > 80.0f) value = 80.0f;   // begränsa till max
}

int main() {
    std::srand(static_cast<unsigned>(std::time(nullptr)));
    for (int i = 0; i < 5; i++) {
        float v = readSensor();
        analyzeSensor(v);
        printSensorData(v);
    }
}`, "cpp"],
  ],
  quiz: [
    { q: R`<code>void increment(int x) { x++; }</code> anropas med <code>a</code> som är 5. Vad är <code>a</code> efteråt?`, o: ["6", "5", "0", "Odefinierat"], a: 1,
      why: R`Pass by value: funktionen fick en kopia. För att ändra <code>a</code> behövs <code>int&amp; x</code> (C++) eller <code>int* x</code> (C).` },
    { q: "Vad är skillnaden mellan parameter och argument?", o: ["Det är samma sak", "Parametern står i funktionens definition, argumentet är värdet du skickar vid anropet", "Argument finns bara i C++", "Parametrar är alltid pekare"], a: 1,
      why: R`I <code>float average(float a, float b)</code> är a och b parametrar. I <code>average(1.0f, 3.0f)</code> är 1.0f och 3.0f argument.` },
    { q: "Vad händer med en funktions stack frame när funktionen returnerar?", o: ["Den sparas tills programmet avslutas", "Den flyttas till heapen", "Den tas bort, och de lokala variablerna slutar finnas", "Den skrivs till en fil"], a: 2,
      why: "Stacken krymper automatiskt. Därför får du aldrig returnera en pekare eller referens till en lokal variabel." },
    { q: R`Hur anropar du <code>void swap(int* a, int* b)</code> med variablerna x och y?`, o: [R`<code>swap(x, y)</code>`, R`<code>swap(*x, *y)</code>`, R`<code>swap(&amp;x, &amp;y)</code>`, R`<code>swap(int* x, int* y)</code>`], a: 2,
      why: R`Funktionen vill ha adresser. <code>&amp;x</code> ger adressen till x.` },
    { q: R`När passar parametern <code>const std::vector&lt;float&gt;&amp; data</code>?`, o: ["När funktionen ska lägga till element", "När funktionen bara ska läsa en stor lista utan att kopiera den", "När listan är tom", "Bara i C"], a: 1,
      why: R`<code>&amp;</code> undviker kopian och <code>const</code> förhindrar ändringar. Det är både effektivt och säkert.` },
  ],
},

/* ================================================================ 05 */
{
  id: "arrayer-pekare", cat: "Minne", min: 11,
  title: "Arrayer, pekare, vector och map",
  lead: "Se hur arrayer ligger i minnet, räkna med pekare och låt std::vector och std::map göra grovjobbet.",
  src: ["Fredag 10/10 – Arrays, pekare, vektorer och maps"],
  date: "Fre 10/10",
  goals: [
    "Förklara hur en array ligger i minnet och hur den hänger ihop med pekare",
    "Använda enkel pekararitmetik",
    "Skicka arrayer till funktioner",
    "Använda std::vector, malloc/free, 2D-arrayer och std::map",
  ],
  blocks: [
    ["h", "Varför arrayer?"],
    ["p", R`Hur skulle du lagra 10 temperaturvärden utan en array? Med tio variabler: <code>t0</code>, <code>t1</code> … <code>t9</code>. Det går inte att loopa över dem, och varje ny mätpunkt kräver ny kod. En array samlar värdena under ett namn.`],
    ["code", "c", R`#include <stdio.h>

int main(void) {
    int temperatures[5] = {21, 22, 20, 19, 23};
    for (int i = 0; i < 5; ++i) {
        printf("Temp %d: %d\n", i, temperatures[i]);
    }
    return 0;
}`],
    ["list", [
      R`<strong>Indexering</strong> börjar på 0.`,
      R`<strong>Minneslayout:</strong> elementen ligger direkt efter varandra (kontinuerligt).`,
      R`<strong>Storlek:</strong> <code>sizeof(temperatures)</code> ger antal bytes (20), <code>sizeof(temperatures) / sizeof(temperatures[0])</code> ger antal element (5). I C++17 finns <code>std::size(temperatures)</code>.`,
    ]],
    ["h", "Arrayer och pekare"],
    ["p", R`I de flesta uttryck omvandlas arrayens namn till en pekare till första elementet: <code>temperatures == &amp;temperatures[0]</code>. Lägger du till 1 till en pekare flyttas den ett helt <em>element</em> framåt, inte en byte. Därför är <code>arr[i]</code> och <code>*(arr + i)</code> samma sak.`],
    ["widget", "pointer"],
    ["code", "cpp", R`int arr[] = {10, 20, 30};
int* p = arr;
std::cout << *p       << "\n";   // 10
std::cout << *(p + 1) << "\n";   // 20
std::cout << p[2]     << "\n";   // 30`],
    ["h", "Arrayer som parametrar"],
    ["p", R`När du skickar en array till en funktion skickas bara pekaren till första elementet. Funktionen vet alltså inte hur lång arrayen är, så storleken måste skickas med.`],
    ["code", "c", R`int sum(int* arr, int size) {
    int total = 0;
    for (int i = 0; i < size; i++) {
        total += *(arr + i);       // samma som arr[i]
    }
    return total;
}

int data[] = {4, 8, 15, 16, 23};
int s = sum(data, 5);`],
    ["h", "std::vector i C++"],
    ["p", R`Råa arrayer har ingen automatisk storlekskontroll, och det är lätt att skriva utanför gränsen. <code>std::vector</code> löser mycket av det: storleken är dynamisk, minnet hanteras automatiskt och vektorn vet själv hur många element den har.`],
    ["code", "cpp", R`#include <vector>

double average(const std::vector<int>& v) {
    if (v.empty()) return 0.0;
    double sum = 0;
    for (int x : v) sum += x;
    return sum / v.size();
}

int main() {
    std::vector<int> temps = {21, 22, 20, 19, 23};
    temps.push_back(25);                       // lägg till sist
    std::cout << temps.size() << "\n";         // 6
    std::cout << average(temps) << "\n";
    std::cout << temps.at(10);                 // at() kastar exception istället för att läsa skräp
}`],
    ["h", "Dynamiska listor i C"],
    ["p", R`C har ingen vector. Där allokerar du minne på heapen själv med <code>malloc</code>, ändrar storleken med <code>realloc</code> och lämnar tillbaka det med <code>free</code>. Det här är vardag i inbyggda system och IoT.`],
    ["code", "c", R`#include <stdlib.h>

int size = 5;
int* data = malloc(size * sizeof(int));
if (data == NULL) { /* slut på minne */ return 1; }

for (int i = 0; i < size; ++i) data[i] = i * 2;

size = 10;
int* tmp = realloc(data, size * sizeof(int));   // spara i tmp först
if (tmp == NULL) { free(data); return 1; }      // annars tappar du data vid fel
data = tmp;

free(data);       // varje malloc ska ha en free
data = NULL;`],
    ["note", "warn", R`Kontrollera alltid att <code>malloc</code> och <code>realloc</code> inte returnerade <code>NULL</code>. Använd inte minnet efter <code>free</code>.`],
    ["h", "2D-arrayer"],
    ["code", "cpp", R`int grid[2][3] = {{1, 2, 3}, {4, 5, 6}};
for (int i = 0; i < 2; ++i)
    for (int j = 0; j < 3; ++j)
        std::cout << grid[i][j] << " ";

// C++: nästlade vektorer
std::vector<std::vector<int>> g = {{1, 2, 3}, {4, 5, 6}};
for (auto& row : g)
    for (int val : row)
        std::cout << val << " ";`],
    ["h", "std::map"],
    ["p", R`En map lagrar par av <strong>nyckel → värde</strong>, sorterade på nyckeln. Perfekt när du vill slå upp en sensor på namn istället för index.`],
    ["code", "cpp", R`#include <map>
#include <string>

std::map<std::string, int> readings = {
    {"Temp", 22},
    {"Humidity", 45},
};
readings["Pressure"] = 1013;          // lägg till eller skriv över

for (auto& [key, value] : readings)   // C++17
    std::cout << key << ": " << value << "\n";

if (readings.count("CO2") == 0)
    std::cout << "Ingen CO2-sensor\n";`],
    ["h", "Vänd en array på plats"],
    ["code", "c", R`void reverseArray(int* arr, int size) {
    for (int i = 0; i < size / 2; ++i) {
        int tmp = arr[i];
        arr[i] = arr[size - 1 - i];
        arr[size - 1 - i] = tmp;
    }
}`, "C"],
    ["code", "cpp", R`void reverseArray(std::vector<int>& arr) {
    for (size_t i = 0; i < arr.size() / 2; ++i)
        std::swap(arr[i], arr[arr.size() - 1 - i]);
}`, "C++"],
    ["h", "Övningar"],
    ["ex", "Medeltemperatur", R`<p>Läs in 5 temperaturer från användaren och beräkna medelvärdet. Använd en for-loop för både inläsning och summering.</p>`],
    ["ex", "Index och pekarnotation", R`<ol><li>Skriv ut arrayens värden med både <code>arr[i]</code> och <code>*(arr + i)</code>.</li><li>Skriv <code>int sum(int* arr, int size)</code> som summerar med pekare.</li></ol>`],
    ["ex", "makeArray", R`<p>Skriv <code>int* makeArray(int size)</code> som returnerar en dynamiskt allokerad array fylld med nollor. Skriv ut innehållet och glöm inte <code>free</code>.</p>`,
      R`int* makeArray(int size) {
    int* a = malloc(size * sizeof(int));
    if (a == NULL) return NULL;
    for (int i = 0; i < size; i++) a[i] = 0;
    return a;          // anroparen ansvarar för free(a)
}
// Alternativ: calloc(size, sizeof(int)) nollställer åt dig`, "c"],
    ["ex", "map med flera mätvärden", R`<ol><li>Skapa en <code>map&lt;string, vector&lt;int&gt;&gt;</code> där varje sensor har flera mätvärden.</li><li>Skriv en funktion som skriver ut medelvärdet för varje sensor.</li></ol>`,
      R`void printAverages(const std::map<std::string, std::vector<int>>& m) {
    for (const auto& [name, values] : m) {
        if (values.empty()) continue;
        double sum = 0;
        for (int v : values) sum += v;
        std::cout << name << ": " << sum / values.size() << "\n";
    }
}`, "cpp"],
    ["ex", "reverseArray", R`<p>Implementera <code>reverseArray</code> i C och C++ och skriv ut arrayen före och efter. Bonus: vänd en <code>vector&lt;string&gt;</code> med sensornamn.</p>`],
  ],
  quiz: [
    { q: R`<code>int arr[] = {10, 20, 30}; int* p = arr;</code> Vad är <code>*(p + 2)</code>?`, o: ["12", "20", "30", "Adressen till arr[2]"], a: 2,
      why: R`<code>p + 2</code> pekar två element framåt, alltså på <code>arr[2]</code>, och <code>*</code> läser värdet där.` },
    { q: R`Varför har <code>int sum(int* arr, int size)</code> en size-parameter?`, o: ["För att kompilatorn kräver det", "Funktionen får bara en pekare och kan inte veta arrayens längd", "För att kunna ändra arrayens storlek", "Den behövs bara i C++"], a: 1,
      why: R`Arrayen omvandlas till en pekare vid anropet. <code>sizeof(arr)</code> inuti funktionen ger pekarens storlek, inte arrayens.` },
    { q: R`Vad gör <code>temps.push_back(25)</code>?`, o: ["Lägger 25 först i vektorn", "Ersätter sista elementet med 25", "Lägger till 25 sist, och vektorn växer", "Tar bort alla element som är 25"], a: 2,
      why: R`<code>push_back</code> lägger till ett element i slutet. Vektorn allokerar mer minne själv vid behov.` },
    { q: R`Vad måste följa varje lyckad <code>malloc</code>?`, o: [R`<code>delete</code>`, R`<code>free</code>, när minnet inte behövs längre`, R`<code>realloc</code>`, "Ingenting, minnet frigörs när funktionen returnerar"], a: 1,
      why: R`Heapminne frigörs inte automatiskt. <code>malloc</code> hör ihop med <code>free</code>, och <code>new</code> med <code>delete</code>. Annars blir det en minnesläcka.` },
    { q: R`I <code>map&lt;string, int&gt; m; m["Temp"] = 22;</code> – vad är "Temp"?`, o: ["Värdet", "Nyckeln", "Indexet 0", "Mapens namn"], a: 1,
      why: R`En map lagrar nyckel → värde. "Temp" är nyckeln och 22 är värdet.` },
  ],
},

/* ================================================================ 06 */
{
  id: "c-strangar", cat: "Minne", min: 10,
  title: "C-strängar och säker indata",
  lead: "Förstå nolltecknet, undvik buffer overflow och tolka IoT-kommandon som LED=ON utan att programmet kraschar.",
  src: ["Övningar: C-strängar, pekare och säker indata"],
  goals: [
    R`Förklara varför C-strängar behöver plats för <code>'\0'</code>`,
    R`Skilja på <code>strlen</code> och <code>sizeof</code>`,
    R`Läsa och kopiera text säkert med <code>fgets</code> och <code>strncpy</code>`,
    "Dela upp och validera kommandon i både C och C++",
  ],
  blocks: [
    ["h", "Vad är en C-sträng?"],
    ["p", R`I C finns ingen strängtyp. En sträng är en <code>char</code>-array där texten avslutas med nolltecknet <code>'\0'</code>. Alla strängfunktioner (<code>printf("%s")</code>, <code>strlen</code>, <code>strcpy</code>) läser tecken tills de hittar det. Saknas det fortsätter de läsa i minnet efter arrayen.`],
    ["code", "c", R`char text[5] = "Hello";     // fel: "Hello" behöver 6 bytes
printf("%s\n", text);       // läser vidare tills den råkar hitta en 0:a

char ok[6] = "Hello";       // 5 tecken + '\0'
char auto_[] = "Hello";     // låt kompilatorn räkna: 6 bytes`],
    ["p", R`Prova själv. Skriv en text och välj buffertstorlek:`],
    ["widget", "cstring"],
    ["h", "Storlek eller längd?"],
    ["p", R`<code>strlen</code> räknar tecknen fram till <code>'\0'</code>. <code>sizeof</code> mäter hur mycket minne arrayen tar, inklusive nolltecknet och eventuellt oanvänt utrymme.`],
    ["code", "c", R`char s[] = "IoT";
printf("strlen: %zu, sizeof: %zu\n", strlen(s), sizeof(s));   // strlen: 3, sizeof: 4

char buf[32] = "IoT";
// strlen(buf) == 3, sizeof(buf) == 32`],
    ["h", "Gå igenom en sträng med pekare"],
    ["code", "c", R`int my_strlen(const char* str) {
    int len = 0;
    while (*str++) len++;       // stannar när *str är '\0' (0 = falskt)
    return len;
}

void printChars(const char* str) {
    while (*str) {
        printf("%c\n", *str);
        str++;
    }
}`],
    ["h", "Kopiera säkert"],
    ["p", R`<code>strcpy</code> kopierar tills källan tar slut, oavsett hur stor målbufferten är. <code>strncpy</code> begränsar antalet tecken men lägger <em>inte</em> alltid till <code>'\0'</code>, så du måste avsluta själv.`],
    ["code", "c", R`void safeCopy(char* dest, const char* src, int size) {
    strncpy(dest, src, size - 1);
    dest[size - 1] = '\0';      // alltid avslutad
}

// Alternativ som alltid avslutar:
snprintf(dest, size, "%s", src);`],
    ["h", "Läs in text säkert"],
    ["p", R`<code>gets()</code> vet inte hur stor bufferten är och är borttagen ur språket. Använd <code>fgets</code>, som tar buffertstorleken som argument. <code>fgets</code> sparar radbrytningen om den får plats, så ta bort den efteråt.`],
    ["code", "c", R`char buffer[64];
if (fgets(buffer, sizeof(buffer), stdin) != NULL) {
    buffer[strcspn(buffer, "\n")] = '\0';   // ersätt '\n' med '\0'
}`],
    ["h", "Jämför strängar"],
    ["p", R`<code>==</code> jämför två adresser, inte texten. Använd <code>strcmp</code>, som returnerar 0 när strängarna är lika.`],
    ["code", "c", R`char pw[16];
fgets(pw, sizeof(pw), stdin);
pw[strcspn(pw, "\n")] = '\0';
if (strcmp(pw, "secret") == 0) printf("Rätt!\n");
else                           printf("Fel.\n");`],
    ["h", "Tolka IoT-kommandon"],
    ["p", R`Kommandon som <code>LED=ON</code> och <code>TEMP=25</code> delas upp i nyckel och värde. <code>strchr</code> hittar <code>=</code>. Genom att skriva <code>'\0'</code> där blir den första delen en egen sträng.`],
    ["code", "c", R`#include <ctype.h>
#include <string.h>

char cmd[] = "TEMP=25";
char* value = strchr(cmd, '=');
if (value != NULL) {
    *value = '\0';                 // cmd blir "TEMP"
    value++;                       // value pekar på "25"

    int valid = (*value != '\0');
    for (char* p = value; *p; p++)
        if (!isdigit((unsigned char)*p)) valid = 0;

    printf("Nyckel: %s, värde: %s (%s)\n", cmd, value, valid ? "numeriskt" : "ogiltigt");
}`, "C"],
    ["p", R`Samma sak i C++ med <code>std::string</code> blir kortare och utan risk för buffer overflow:`],
    ["code", "cpp", R`std::string cmd;
std::getline(std::cin, cmd);

auto pos = cmd.find('=');
if (pos != std::string::npos) {
    std::string key = cmd.substr(0, pos);
    std::string val = cmd.substr(pos + 1);
    if (key == "LED" && val == "ON") std::cout << "Tänder LED.\n";
    if (key == "TEMP") {
        try { int t = std::stoi(val); std::cout << "Mål: " << t << " °C\n"; }
        catch (const std::exception&) { std::cout << "Ogiltigt tal\n"; }
    }
}`, "C++"],
    ["code", "cpp", R`std::string trim(const std::string& s) {
    size_t start = s.find_first_not_of(" \t");
    if (start == std::string::npos) return "";
    size_t end = s.find_last_not_of(" \t");
    return s.substr(start, end - start + 1);
}`, "ta bort inledande och avslutande mellanslag"],
    ["h", "Sammanfattning"],
    ["list", [
      R`Ange alltid buffertgränser: <code>fgets</code>, <code>strncpy</code>, <code>snprintf</code>.`,
      R`Undvik <code>gets()</code> helt.`,
      "Förstå pekarlogiken. Den är grunden för minnessäkerhet.",
      R`<code>std::string</code> förenklar mycket, men finns inte alltid på små mikrokontroller.`,
      "Inputvalidering är minst lika viktig som minnessäkerhet i IoT.",
    ]],
    ["h", "Övningar"],
    ["ex", "Trunka en sträng", R`<p>Skriv <code>void truncate(char* str, int maxlen)</code> som kapar strängen efter maxlen tecken.</p>`,
      R`void truncate(char* str, int maxlen) {
    if ((int)strlen(str) > maxlen)
        str[maxlen] = '\0';
}`, "c"],
    ["ex", "Räkna vokaler", R`<p>Räkna vokalerna (a, e, i, o, u, y) i en C-sträng. Använd <code>tolower()</code>.</p>`,
      R`int countVowels(const char* s) {
    int c = 0;
    for (; *s; s++) {
        char ch = tolower((unsigned char)*s);
        if (strchr("aeiouy", ch)) c++;
    }
    return c;
}`, "c"],
    ["ex", "Säkert IoT-kommando (avslutande)", R`<p>Skriv ett program som läser ett kommando som <code>LED=ON</code>, <code>TEMP=23</code> eller <code>MOTOR=OFF</code>, delar upp nyckel och värde, validerar texten och skriver ut en åtgärd. Lösningen får inte riskera buffer overflow.</p>`],
  ],
  quiz: [
    { q: R`Hur många bytes behövs för att lagra "Hello" som C-sträng?`, o: ["4", "5", "6", "Det beror på kompilatorn"], a: 2,
      why: R`5 tecken plus nolltecknet <code>'\0'</code> = 6 bytes.` },
    { q: R`<code>char s[] = "IoT";</code> Vad ger <code>strlen(s)</code> och <code>sizeof(s)</code>?`, o: ["3 och 3", "3 och 4", "4 och 4", "4 och 3"], a: 1,
      why: R`strlen räknar tecknen före <code>'\0'</code> (3). sizeof mäter hela arrayen inklusive nolltecknet (4).` },
    { q: R`Varför ska <code>gets()</code> aldrig användas?`, o: ["Den är långsam", "Den kan inte begränsa hur mycket som läses, vilket ger buffer overflow", "Den läser bara siffror", "Den finns bara i C++"], a: 1,
      why: R`<code>gets</code> vet inte buffertens storlek. Använd <code>fgets(buf, sizeof(buf), stdin)</code>.` },
    { q: "Hur jämför du textinnehållet i två C-strängar a och b?", o: [R`<code>a == b</code>`, R`<code>strcmp(a, b) == 0</code>`, R`<code>strlen(a) == strlen(b)</code>`, R`<code>*a == *b</code>`], a: 1,
      why: R`<code>a == b</code> jämför adresser. <code>*a == *b</code> jämför bara första tecknet. <code>strcmp</code> jämför hela texten.` },
    { q: R`Vad gör <code>buffer[strcspn(buffer, "\n")] = '\0';</code>?`, o: ["Tömmer bufferten", "Tar bort radbrytningen som fgets sparade", "Lägger till en radbrytning", "Räknar antalet rader"], a: 1,
      why: R`<code>strcspn</code> ger positionen för första <code>'\n'</code> (eller strängens längd om den saknas). Där skrivs <code>'\0'</code>.` },
  ],
},
];
