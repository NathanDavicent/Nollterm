/* Extra questions per lesson. Types: mc (default), multi, text, code. */
const EXTRA = {
/* ------------------------------------------------------------ 01 */
"kom-igang": [
  { t: "mc", q: R`Vilket kommando kompilerar <code>main.cpp</code> till programmet <code>app</code>?`, o: [R`<code>gcc main.cpp app</code>`, R`<code>g++ main.cpp -o app</code>`, R`<code>g++ -o main.cpp app</code>`, R`<code>run main.cpp</code>`], a: 1,
    why: R`<code>g++</code> är C++-kompilatorn och <code>-o</code> anger namnet på den körbara filen.` },
  { t: "mc", q: R`Vad returnerar <code>main</code> för att signalera att allt gick bra?`, o: ["1", "0", "-1", "true"], a: 1,
    why: R`<code>return 0;</code> betyder att programmet avslutades utan fel. Allt annat tolkas som en felkod.` },
  { t: "multi", q: "Vilka av följande är jämförelseoperatorer? Välj alla som stämmer.", o: [R`<code>==</code>`, R`<code>!=</code>`, R`<code>=</code>`, R`<code>&lt;=</code>`, R`<code>&amp;&amp;</code>`], a: [0, 1, 3],
    why: R`<code>=</code> är tilldelning och <code>&amp;&amp;</code> är en logisk operator.` },
  { t: "text", q: R`Vilken datatyp ger dubbel precision för decimaltal? Skriv typens namn.`, accept: ["double"], ph: "typnamn",
    why: R`<code>double</code> har ungefär 15–16 siffrors precision, <code>float</code> ungefär 7.` },
  { t: "text", q: R`Vad skriver <code>std::cout &lt;&lt; 17 % 5;</code> ut?`, accept: ["2"], ph: "svar",
    why: "17 = 3 · 5 + 2, så resten är 2." },
  { t: "text", q: R`Vilken header inkluderar du för att använda <code>printf</code> i C? Skriv hela raden.`, accept: ["#include <stdio.h>", "#include<stdio.h>", "stdio.h", "<stdio.h>"], ph: "#include ...",
    why: R`<code>#include &lt;stdio.h&gt;</code> (i C++ heter den <code>&lt;cstdio&gt;</code>).` },
  { t: "code", q: R`Läs in två heltal och skriv ut deras summa, skillnad och produkt på var sin rad.`,
    starter: R`#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    // skriv ut summa, skillnad och produkt på var sin rad

    return 0;
}`,
    tests: [{ in: "7 3", out: "10\n4\n21" }, { in: "-2 5", out: "3\n-7\n-10" }],
    sol: R`#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    cout << a - b << endl;
    cout << a * b << endl;
    return 0;
}`, why: R`Tre utskrifter med <code>endl</code> efter varje ger tre rader.` },
  { t: "code", q: R`Läs in en temperatur i Celsius (decimaltal) och skriv ut den i Fahrenheit. Formel: F = C · 9 / 5 + 32.`,
    starter: R`#include <iostream>
using namespace std;

int main() {
    double c;
    cin >> c;
    // räkna ut och skriv ut Fahrenheit

    return 0;
}`,
    tests: [{ in: "100", out: "212" }, { in: "37", out: "98.6" }, { in: "20", out: "68" }],
    sol: R`#include <iostream>
using namespace std;

int main() {
    double c;
    cin >> c;
    cout << c * 9 / 5 + 32 << endl;
    return 0;
}`, why: R`Eftersom <code>c</code> är en double blir hela uttrycket en decimalberäkning.` },
],

/* ------------------------------------------------------------ 02 */
"villkor": [
  { t: "mc", q: R`Vad skrivs ut?<br><code>int t = 25; if (t &gt; 30) cout &lt;&lt; "A"; else if (t &gt; 20) cout &lt;&lt; "B"; else cout &lt;&lt; "C";</code>`, o: ["A", "B", "C", "BC"], a: 1,
    why: "Första villkoret är falskt, andra är sant. Efter första sanna grenen hoppas resten över." },
  { t: "mc", q: R`Vad gör <code>default</code> i en switch?`, o: ["Körs alltid först", "Körs när inget case matchar", "Avslutar switchen", "Är ett obligatoriskt case"], a: 1,
    why: R`<code>default</code> fångar alla värden som inte matchar något case, ungefär som en avslutande <code>else</code>.` },
  { t: "multi", q: R`Vilka uttryck är sanna när <code>x = 0</code>? Välj alla.`, o: [R`<code>!x</code>`, R`<code>x == 0</code>`, R`<code>x</code>`, R`<code>x &lt;= 0 &amp;&amp; x &gt;= 0</code>`], a: [0, 1, 3],
    why: R`0 räknas som falskt, så <code>x</code> är falskt och <code>!x</code> är sant.` },
  { t: "text", q: R`Vilket nyckelord avslutar ett case i en switch så att körningen inte fortsätter till nästa?`, accept: ["break", "break;"], ph: "nyckelord",
    why: R`<code>break;</code> hoppar ut ur switchen.` },
  { t: "text", q: R`Skriv villkoret (utan <code>if</code> och parenteser) som är sant när <code>temp</code> ligger utanför intervallet 18–24, gränserna inräknade som inne.`, accept: ["temp < 18 || temp > 24", "temp>24||temp<18", "!(temp>=18&&temp<=24)"], ph: "temp ...",
    why: R`Utanför betyder under 18 <em>eller</em> över 24: <code>temp &lt; 18 || temp &gt; 24</code>.` },
  { t: "code", q: R`Läs in ett heltal och skriv ut <code>positivt</code>, <code>negativt</code> eller <code>noll</code>.`,
    starter: R`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    // skriv ut positivt, negativt eller noll

    return 0;
}`,
    tests: [{ in: "5", out: "positivt" }, { in: "-3", out: "negativt" }, { in: "0", out: "noll" }],
    sol: R`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n > 0) {
        cout << "positivt" << endl;
    } else if (n < 0) {
        cout << "negativt" << endl;
    } else {
        cout << "noll" << endl;
    }
    return 0;
}`, why: "Tre grenar: if, else if och else." },
  { t: "code", q: R`Läs in ett årtal och skriv ut <code>ja</code> om det är ett skottår, annars <code>nej</code>. Delbart med 4, men inte med 100, om det inte också är delbart med 400.`,
    starter: R`#include <iostream>
using namespace std;

int main() {
    int y;
    cin >> y;

    return 0;
}`,
    tests: [{ in: "2024", out: "ja" }, { in: "1900", out: "nej" }, { in: "2000", out: "ja" }, { in: "2023", out: "nej" }],
    sol: R`#include <iostream>
using namespace std;

int main() {
    int y;
    cin >> y;
    if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
        cout << "ja" << endl;
    } else {
        cout << "nej" << endl;
    }
    return 0;
}`, why: "1900 är delbart med 100 men inte med 400, så det är inget skottår." },
],

/* ------------------------------------------------------------ 03 */
"loopar": [
  { t: "mc", q: R`Hur många gånger körs kroppen i <code>for (int i = 10; i &gt; 0; i -= 3)</code>?`, o: ["3", "4", "10", "Oändligt många"], a: 1,
    why: "i = 10, 7, 4, 1. Sedan blir i = -2 och villkoret är falskt." },
  { t: "mc", q: R`Vad skrivs ut?<br><code>int i = 5; while (i &lt; 5) { cout &lt;&lt; i; i++; }</code>`, o: ["5", "Ingenting", "01234", "Oändlig loop"], a: 1,
    why: "Villkoret är falskt redan från början, så while-kroppen körs aldrig. Med do-while hade 5 skrivits ut." },
  { t: "multi", q: "Vilka är vanliga orsaker till buggar i loopar? Välj alla.", o: ["Off-by-one i villkoret", "Summan nollställs inte före loopen", "Att använda range-based for", "Loopvariabeln uppdateras aldrig"], a: [0, 1, 3],
    why: "Range-based for är tvärtom ett sätt att undvika indexfel." },
  { t: "text", q: R`Vilket nyckelord avbryter en loop direkt?`, accept: ["break", "break;"], ph: "nyckelord",
    why: R`<code>break</code> lämnar loopen. <code>continue</code> hoppar bara till nästa varv.` },
  { t: "text", q: R`En array har 8 element. Vilket är det sista giltiga indexet?`, accept: ["7"], ph: "index",
    why: "Index börjar på 0, så 8 element har index 0–7." },
  { t: "code", q: R`Läs in ett heltal <code>n</code> och skriv ut summan 1 + 2 + … + n.`,
    starter: R`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int sum = 0;
    // loopa och summera

    cout << sum << endl;
    return 0;
}`,
    tests: [{ in: "4", out: "10" }, { in: "100", out: "5050" }, { in: "1", out: "1" }],
    sol: R`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int sum = 0;
    for (int i = 1; i <= n; i++) {
        sum += i;
    }
    cout << sum << endl;
    return 0;
}`, why: R`Här ska loopen ta med n, därför <code>&lt;=</code>.` },
  { t: "code", q: R`FizzBuzz: läs in <code>n</code> och skriv ut 1 till n, ett tal per rad. Byt multipler av 3 mot <code>Fizz</code>, av 5 mot <code>Buzz</code> och av båda mot <code>FizzBuzz</code>.`,
    starter: R`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    return 0;
}`,
    tests: [{ in: "15", out: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz" }, { in: "5", out: "1\n2\nFizz\n4\nBuzz" }],
    sol: R`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        if (i % 15 == 0)     cout << "FizzBuzz" << endl;
        else if (i % 3 == 0) cout << "Fizz" << endl;
        else if (i % 5 == 0) cout << "Buzz" << endl;
        else                 cout << i << endl;
    }
    return 0;
}`, why: "Testa det mest specifika fallet (delbart med 15) först." },
  { t: "code", q: R`Läs in <code>n</code> och sedan n heltal. Skriv ut det minsta och det största talet, separerade med ett mellanslag.`,
    starter: R`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    return 0;
}`,
    tests: [{ in: "5\n3 9 -2 7 4", out: "-2 9" }, { in: "1\n42", out: "42 42" }, { in: "3\n-5 -1 -9", out: "-9 -1" }],
    sol: R`#include <iostream>
using namespace std;

int main() {
    int n, x;
    cin >> n >> x;
    int minV = x, maxV = x;          // starta med första värdet, inte 0
    for (int i = 1; i < n; i++) {
        cin >> x;
        if (x < minV) minV = x;
        if (x > maxV) maxV = x;
    }
    cout << minV << " " << maxV << endl;
    return 0;
}`, why: "Startar du min med 0 blir svaret fel när alla tal är positiva, och max blir fel när alla är negativa." },
],

/* ------------------------------------------------------------ 04 */
"funktioner": [
  { t: "mc", q: R`Vad är returtypen för en funktion som inte returnerar något?`, o: [R`<code>null</code>`, R`<code>void</code>`, R`<code>int</code>`, R`<code>empty</code>`], a: 1,
    why: R`<code>void</code> betyder att funktionen inte lämnar tillbaka något värde.` },
  { t: "mc", q: R`<code>void f(int&amp; x) { x = 10; }</code> anropas med <code>a</code> som är 3. Vad är a efteråt?`, o: ["3", "10", "13", "Kompileringsfel"], a: 1,
    why: R`x är en referens till a, så tilldelningen ändrar originalet.` },
  { t: "multi", q: "Vilka påståenden om överlagring i C++ stämmer? Välj alla.", o: ["Funktionerna har samma namn", "Parameterlistorna måste skilja sig", "Det räcker att returtypen skiljer sig", "Finns även i C"], a: [0, 1],
    why: "Kompilatorn väljer version utifrån argumenten. Returtypen ensam räcker inte, och C saknar överlagring." },
  { t: "text", q: R`Vad kallas minnesområdet där funktioners parametrar och lokala variabler hamnar? Ett ord.`, accept: ["stacken", "stack", "anropsstacken", "callstack", "call stack", "stackminnet"], ph: "ett ord",
    why: "Stacken (anropsstacken). Varje anrop får en egen stack frame." },
  { t: "text", q: R`Skriv prototypen (deklarationen) för en funktion <code>toKelvin</code> som tar en <code>float celsius</code> och returnerar <code>float</code>.`, accept: ["float toKelvin(float celsius);", "float toKelvin(float);", "float toKelvin(float c);"], ph: "float ...",
    why: R`<code>float toKelvin(float celsius);</code> En prototyp slutar med semikolon istället för en kropp.` },
  { t: "code", q: R`Skriv funktionen <code>int square(int x)</code> som returnerar kvadraten. main är färdig.`,
    starter: R`#include <iostream>
using namespace std;

int square(int x) {
    // returnera x i kvadrat
}

int main() {
    int n;
    cin >> n;
    cout << square(n) << endl;
    return 0;
}`,
    tests: [{ in: "5", out: "25" }, { in: "-4", out: "16" }, { in: "0", out: "0" }],
    sol: R`#include <iostream>
using namespace std;

int square(int x) {
    return x * x;
}

int main() {
    int n;
    cin >> n;
    cout << square(n) << endl;
    return 0;
}`, why: "Funktionen returnerar värdet istället för att skriva ut det. main bestämmer vad som händer med det." },
  { t: "code", q: R`Skriv <code>bool isPrime(int n)</code>. main skriver ut <code>primtal</code> eller <code>inte primtal</code>.`,
    starter: R`#include <iostream>
using namespace std;

bool isPrime(int n) {

}

int main() {
    int n;
    cin >> n;
    if (isPrime(n)) cout << "primtal" << endl;
    else cout << "inte primtal" << endl;
    return 0;
}`,
    tests: [{ in: "97", out: "primtal" }, { in: "1", out: "inte primtal" }, { in: "91", out: "inte primtal" }, { in: "2", out: "primtal" }],
    sol: R`#include <iostream>
using namespace std;

bool isPrime(int n) {
    if (n < 2) return false;
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) return false;
    }
    return true;
}

int main() {
    int n;
    cin >> n;
    if (isPrime(n)) cout << "primtal" << endl;
    else cout << "inte primtal" << endl;
    return 0;
}`, why: "91 = 7 · 13. Det räcker att testa delare upp till roten ur n." },
  { t: "code", q: R`Skriv <code>void swap(int* a, int* b)</code> som byter plats på två värden via pekare.`,
    starter: R`#include <iostream>
using namespace std;

void swap(int* a, int* b) {

}

int main() {
    int x, y;
    cin >> x >> y;
    swap(&x, &y);
    cout << x << " " << y << endl;
    return 0;
}`,
    tests: [{ in: "1 2", out: "2 1" }, { in: "-7 30", out: "30 -7" }],
    sol: R`#include <iostream>
using namespace std;

void swap(int* a, int* b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int main() {
    int x, y;
    cin >> x >> y;
    swap(&x, &y);
    cout << x << " " << y << endl;
    return 0;
}`, why: R`<code>*a</code> läser och skriver värdet på adressen. Utan en temporär variabel skulle det ena värdet skrivas över.` },
],

/* ------------------------------------------------------------ 05 */
"arrayer-pekare": [
  { t: "mc", q: R`<code>int a[10];</code> på en dator där int är 4 bytes. Vad är <code>sizeof(a)</code>?`, o: ["4", "10", "40", "8"], a: 2,
    why: R`sizeof för en array ger hela storleken: 10 · 4 = 40 bytes.` },
  { t: "mc", q: R`Vad är skillnaden mellan <code>v[10]</code> och <code>v.at(10)</code> på en vector med 5 element?`, o: ["Ingen skillnad", R`<code>at</code> kontrollerar gränsen och kastar ett undantag, <code>[]</code> gör det inte`, R`<code>[]</code> lägger till element som saknas`, R`<code>at</code> returnerar 0`], a: 1,
    why: R`<code>v[10]</code> är odefinierat beteende. <code>v.at(10)</code> kastar <code>std::out_of_range</code>.` },
  { t: "multi", q: R`<code>int arr[] = {4, 8, 15}; int* p = arr;</code> Vilka uttryck ger värdet 8? Välj alla.`, o: [R`<code>arr[1]</code>`, R`<code>*(p + 1)</code>`, R`<code>p[1]</code>`, R`<code>*p + 1</code>`], a: [0, 1, 2],
    why: R`<code>*p + 1</code> läser första värdet (4) och lägger till 1, vilket ger 5.` },
  { t: "text", q: R`Vilken C-funktion lämnar tillbaka minne som allokerats med <code>malloc</code>?`, accept: ["free", "free()"], ph: "funktion",
    why: R`<code>free(ptr);</code> Varje malloc ska ha en free.` },
  { t: "text", q: R`Vilken vector-metod lägger till ett element sist?`, accept: ["push_back", "push_back()", ".push_back", "emplace_back"], ph: "metod",
    why: R`<code>push_back</code> (eller <code>emplace_back</code>, som bygger elementet på plats).` },
  { t: "code", q: R`Skriv <code>int sum(int* arr, int size)</code> som summerar arrayen. main läser in n tal.`,
    starter: R`#include <iostream>
using namespace std;

int sum(int* arr, int size) {

}

int main() {
    int n;
    cin >> n;
    int data[100];
    for (int i = 0; i < n; i++) cin >> data[i];
    cout << sum(data, n) << endl;
    return 0;
}`,
    tests: [{ in: "5\n4 8 15 16 23", out: "66" }, { in: "1\n-3", out: "-3" }],
    sol: R`#include <iostream>
using namespace std;

int sum(int* arr, int size) {
    int total = 0;
    for (int i = 0; i < size; i++) {
        total += *(arr + i);
    }
    return total;
}

int main() {
    int n;
    cin >> n;
    int data[100];
    for (int i = 0; i < n; i++) cin >> data[i];
    cout << sum(data, n) << endl;
    return 0;
}`, why: R`<code>*(arr + i)</code> och <code>arr[i]</code> är samma sak.` },
  { t: "code", q: R`Skriv <code>void reverseArray(int* arr, int size)</code> som vänder arrayen på plats.`,
    starter: R`#include <iostream>
using namespace std;

void reverseArray(int* arr, int size) {

}

int main() {
    int n;
    cin >> n;
    int a[100];
    for (int i = 0; i < n; i++) cin >> a[i];
    reverseArray(a, n);
    for (int i = 0; i < n; i++) {
        cout << a[i];
        if (i < n - 1) cout << " ";
    }
    cout << endl;
    return 0;
}`,
    tests: [{ in: "5\n1 2 3 4 5", out: "5 4 3 2 1" }, { in: "4\n10 20 30 40", out: "40 30 20 10" }, { in: "1\n7", out: "7" }],
    sol: R`#include <iostream>
using namespace std;

void reverseArray(int* arr, int size) {
    for (int i = 0; i < size / 2; i++) {
        int tmp = arr[i];
        arr[i] = arr[size - 1 - i];
        arr[size - 1 - i] = tmp;
    }
}

int main() {
    int n;
    cin >> n;
    int a[100];
    for (int i = 0; i < n; i++) cin >> a[i];
    reverseArray(a, n);
    for (int i = 0; i < n; i++) {
        cout << a[i];
        if (i < n - 1) cout << " ";
    }
    cout << endl;
    return 0;
}`, why: "Byt första med sista, andra med näst sista, och stanna på mitten. Går du hela vägen vänds arrayen tillbaka igen." },
  { t: "code", q: R`Skriv <code>int countEven(int* a, int n)</code> som räknar hur många tal som är jämna.`,
    starter: R`#include <iostream>
using namespace std;

int countEven(int* a, int n) {

}

int main() {
    int n;
    cin >> n;
    int a[100];
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << countEven(a, n) << endl;
    return 0;
}`,
    tests: [{ in: "6\n1 2 3 4 5 6", out: "3" }, { in: "3\n1 3 5", out: "0" }, { in: "4\n-2 0 7 8", out: "3" }],
    sol: R`#include <iostream>
using namespace std;

int countEven(int* a, int n) {
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (a[i] % 2 == 0) count++;
    }
    return count;
}

int main() {
    int n;
    cin >> n;
    int a[100];
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << countEven(a, n) << endl;
    return 0;
}`, why: "0 och negativa jämna tal räknas också: -2 % 2 är 0." },
],

/* ------------------------------------------------------------ 06 */
"c-strangar": [
  { t: "mc", q: R`Vilket tecken avslutar alltid en C-sträng?`, o: [R`<code>'\n'</code>`, R`<code>'\0'</code>`, R`<code>' '</code>`, R`<code>'0'</code>`], a: 1,
    why: R`Nolltecknet <code>'\0'</code> har värdet 0. Tecknet <code>'0'</code> är siffran noll och har värdet 48.` },
  { t: "mc", q: R`Varför måste du lägga till <code>'\0'</code> själv efter <code>strncpy(dest, src, n)</code>?`, o: ["strncpy lägger aldrig till det", "strncpy lägger inte till det om källan är n tecken eller längre", "Det behövs inte", "För att strncpy tar bort det"], a: 1,
    why: R`Om källan inte får plats kopierar strncpy exakt n tecken utan avslutning. Skriv <code>dest[size - 1] = '\0';</code>.` },
  { t: "multi", q: "Vilka funktioner begränsar hur mycket som skrivs till bufferten? Välj alla.", o: [R`<code>fgets</code>`, R`<code>gets</code>`, R`<code>snprintf</code>`, R`<code>strcpy</code>`, R`<code>strncpy</code>`], a: [0, 2, 4],
    why: R`<code>gets</code> och <code>strcpy</code> vet inget om buffertens storlek.` },
  { t: "text", q: R`Vilken funktion i <code>&lt;string.h&gt;</code> hittar första förekomsten av ett tecken i en sträng?`, accept: ["strchr", "strchr()"], ph: "funktion",
    why: R`<code>strchr(cmd, '=')</code> returnerar en pekare till tecknet, eller NULL om det saknas.` },
  { t: "text", q: R`Vilken std::string-metod letar efter ett tecken och returnerar <code>std::string::npos</code> om det saknas?`, accept: ["find", "find()", ".find"], ph: "metod",
    why: R`<code>cmd.find('=')</code>` },
  { t: "code", q: R`Skriv <code>int my_strlen(const char* str)</code> som räknar tecknen fram till <code>'\0'</code>. Använd inte <code>strlen</code>.`,
    starter: R`#include <stdio.h>

int my_strlen(const char* str) {

}

int main() {
    char buf[64];
    scanf("%s", buf);
    printf("%d\n", my_strlen(buf));
    return 0;
}`,
    tests: [{ in: "Hello", out: "5" }, { in: "IoT", out: "3" }, { in: "a", out: "1" }],
    sol: R`#include <stdio.h>

int my_strlen(const char* str) {
    int len = 0;
    while (*str != '\0') {
        len++;
        str++;
    }
    return len;
}

int main() {
    char buf[64];
    scanf("%s", buf);
    printf("%d\n", my_strlen(buf));
    return 0;
}`, why: R`Pekaren flyttas ett tecken i taget tills den når nolltecknet.` },
  { t: "code", q: R`Skriv <code>int countVowels(const char* s)</code> som räknar vokalerna a, e, i, o, u och y, oavsett stor eller liten bokstav.`,
    starter: R`#include <stdio.h>
#include <ctype.h>

int countVowels(const char* s) {

}

int main() {
    char buf[64];
    scanf("%s", buf);
    printf("%d\n", countVowels(buf));
    return 0;
}`,
    tests: [{ in: "Mikrokontroller", out: "5" }, { in: "IoT", out: "2" }, { in: "xyz", out: "1" }],
    sol: R`#include <stdio.h>
#include <ctype.h>

int countVowels(const char* s) {
    int c = 0;
    for (; *s; s++) {
        char ch = tolower(*s);
        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u' || ch == 'y')
            c++;
    }
    return c;
}

int main() {
    char buf[64];
    scanf("%s", buf);
    printf("%d\n", countVowels(buf));
    return 0;
}`, why: R`<code>tolower</code> gör att 'I' och 'i' räknas likadant.` },
],

/* ------------------------------------------------------------ 07 */
"klasser": [
  { t: "mc", q: R`Vad är en <em>instans</em>?`, o: ["En metod i en klass", "Ett konkret objekt skapat från en klass eller struct", "En headerfil", "En privat medlem"], a: 1,
    why: R`<code>Device d1;</code> skapar en instans av Device. Klassen är ritningen, instansen är det som byggs.` },
  { t: "mc", q: R`Vad betyder <code>const</code> efter metoden i <code>void print() const</code>?`, o: ["Metoden returnerar en konstant", "Metoden ändrar inte objektets medlemmar", "Metoden kan inte anropas", "Metoden är private"], a: 1,
    why: "Kompilatorn stoppar alla ändringar av medlemmar i metoden, och den kan anropas på konstanta objekt." },
  { t: "multi", q: "Vilka hamnar på stacken? Välj alla.", o: [R`<code>int x = 5;</code> i en funktion`, "En funktions parametrar", R`Objektet som skapas av <code>new Device{}</code>`, R`<code>Device d1;</code> i main`], a: [0, 1, 3],
    why: R`<code>new</code> allokerar på heapen. Pekaren som håller adressen kan däremot ligga på stacken.` },
  { t: "multi", q: "Vilka åtkomstnivåer finns i C++? Välj alla.", o: ["public", "private", "protected", "internal", "hidden"], a: [0, 1, 2],
    why: R`<code>internal</code> finns i C#, inte i C++.` },
  { t: "text", q: R`Vilken operator använder du för att nå en medlem via en pekare till ett objekt?`, accept: ["->"], ph: "operator",
    why: R`<code>ptr-&gt;medlem</code> är samma som <code>(*ptr).medlem</code>.` },
  { t: "text", q: R`Vilket nyckelord frigör ett objekt som skapats med <code>new</code>?`, accept: ["delete", "delete;"], ph: "nyckelord",
    why: R`<code>delete ptr;</code> (för arrayer: <code>delete[] ptr;</code>).` },
  { t: "text", q: R`Vad kallas idén att en klass döljer sin data och bara visar ett gränssnitt? Ett ord, svenska eller engelska.`, accept: ["inkapsling", "encapsulation"], ph: "begrepp",
    why: "Inkapsling (encapsulation): privat data, publika metoder." },
],

/* ------------------------------------------------------------ 08 */
"headerfiler": [
  { t: "mc", q: R`Vilken fil ska normalt <em>inte</em> inkluderas med #include?`, o: [R`<code>sensor.h</code>`, R`<code>sensor.cpp</code>`, R`<code>&lt;iostream&gt;</code>`, R`<code>measurement.h</code>`], a: 1,
    why: R`.cpp-filer kompileras separat. Inkluderar du dem blir definitionerna dubbla vid länkningen.` },
  { t: "mc", q: R`Var placeras <code>#endif</code> i en include guard?`, o: ["Först i filen", "Sist i filen", "Direkt efter #define", "I .cpp-filen"], a: 1,
    why: R`<code>#ifndef</code> och <code>#define</code> överst, <code>#endif</code> sist, så att hela innehållet skyddas.` },
  { t: "multi", q: "Vad hör hemma i data_manager.cpp? Välj alla.", o: ["Implementationen av DataManager::addMeasurement", R`<code>#include "data_manager.h"</code>`, "Include guards", "Implementationen av calculateStatistics"], a: [0, 1, 3],
    why: "Include guards behövs bara i headerfiler." },
  { t: "text", q: R`Skriv det moderna direktivet som ersätter include guards med en enda rad.`, accept: ["#pragma once", "#pragmaonce"], ph: "#...",
    why: R`<code>#pragma once</code> stöds av alla stora kompilatorer.` },
  { t: "text", q: R`Vad heter operatorn <code>::</code> i <code>Sensor::setValue</code>? Skriv namnet på svenska eller engelska.`, accept: ["scope-operatorn", "scopeoperatorn", "scope", "scope resolution operator", "scope resolution", "räckviddsoperatorn"], ph: "namn",
    why: "Scope-operatorn (scope resolution operator)." },
  { t: "text", q: R`Skriv kommandot som kompilerar <code>main.cpp</code> och <code>sensor.cpp</code> till programmet <code>app</code> med g++.`, accept: ["g++ main.cpp sensor.cpp -o app", "g++ sensor.cpp main.cpp -o app", "g++ -o app main.cpp sensor.cpp", "g++ -o app sensor.cpp main.cpp"], ph: "g++ ...",
    why: R`<code>g++ main.cpp sensor.cpp -o app</code>. Alla .cpp-filer måste med.` },
],

/* ------------------------------------------------------------ 09 */
"filhantering": [
  { t: "mc", q: R`Vad händer med innehållet i en befintlig fil som öppnas med <code>std::ofstream out("data.txt");</code>?`, o: ["Det behålls och nytt läggs till sist", "Filen töms", "Det går inte att öppna filen", "Innehållet läses in"], a: 1,
    why: R`Standardläget skriver över. Använd <code>std::ios::app</code> för att lägga till.` },
  { t: "mc", q: R`Vilken loop läser en fil rad för rad i C++?`, o: [R`<code>while (std::getline(in, line))</code>`, R`<code>for (line : in)</code>`, R`<code>while (!in.eof()) in &gt;&gt; line;</code>`, R`<code>do { getline(line); } while (in);</code>`], a: 0,
    why: R`getline returnerar strömmen, som blir falsk när inget mer kan läsas. Att testa <code>eof()</code> först ger ofta ett extra varv.` },
  { t: "multi", q: R`Vilka sätt kontrollerar att <code>std::ifstream in("x.txt")</code> lyckades? Välj alla.`, o: [R`<code>if (!in)</code>`, R`<code>if (!in.is_open())</code>`, R`<code>if (in == NULL)</code>`, R`<code>if (in.fail())</code>`], a: [0, 1, 3],
    why: R`En ifstream är ett objekt, inte en pekare, så den jämförs inte med NULL.` },
  { t: "text", q: R`Vilken C-funktion stänger en fil som öppnats med <code>fopen</code>?`, accept: ["fclose", "fclose()"], ph: "funktion",
    why: R`<code>fclose(file);</code>` },
  { t: "text", q: R`Vilken flagga skickar du till ofstream för att lägga till i slutet av filen?`, accept: ["std::ios::app", "ios::app", "app", "ios_base::app", "std::ios_base::app"], ph: "std::ios::...",
    why: R`<code>std::ofstream log("log.txt", std::ios::app);</code>` },
  { t: "text", q: R`Vilken klass i <code>&lt;sstream&gt;</code> låter dig läsa från en sträng som om den vore en fil?`, accept: ["stringstream", "std::stringstream", "istringstream", "std::istringstream"], ph: "klass",
    why: R`<code>std::stringstream ss(line);</code>` },
],

/* ------------------------------------------------------------ 10 */
"felhantering": [
  { t: "mc", q: "Ett saknat semikolon är vilken typ av fel?", o: ["Logiskt fel", "Körningsfel", "Syntaxfel", "Länkningsfel"], a: 2,
    why: "Kompilatorn hittar det innan programmet ens körs." },
  { t: "mc", q: R`Vilket block körs om ett undantag kastas inuti <code>try</code>?`, o: ["Det första matchande catch-blocket", "Alla catch-block", "Inget, programmet avslutas alltid", "finally"], a: 0,
    why: R`Körningen hoppar till första <code>catch</code> vars typ matchar. C++ har inget finally.` },
  { t: "multi", q: "Vilka är rimliga sätt att felsöka? Välj alla.", o: ["Breakpoints och stegning", "Utskrifter av mellanresultat", R`<code>assert()</code> för antaganden`, "Ta bort felkontroller tills det fungerar"], a: [0, 1, 2],
    why: "Felkontroller hjälper dig hitta fel. De är inte orsaken till dem." },
  { t: "text", q: R`Vilken metod på ett undantag ger felmeddelandet som text?`, accept: ["what", "what()", "e.what()", ".what()"], ph: "metod",
    why: R`<code>e.what()</code>` },
  { t: "text", q: R`Vilken tangent i Visual Studio kör nästa rad utan att gå in i funktioner (step over)?`, accept: ["f10"], ph: "tangent",
    why: "F10 = step over, F11 = step into." },
  { t: "text", q: R`Vilken C-funktion skriver ut ett felmeddelande följt av orsaken från <code>errno</code>?`, accept: ["perror", "perror()"], ph: "funktion",
    why: R`<code>perror("Kunde inte öppna filen");</code>` },
  { t: "code", q: R`Funktionen <code>average</code> har tre buggar (oinitierad summa, off-by-one och heltalsdivision). Rätta den. Om n är 0 ska den returnera 0.`,
    starter: R`#include <iostream>
using namespace std;

float average(int arr[], int n) {
    int sum;
    for (int i = 0; i <= n; i++)
        sum += arr[i];
    return sum / n;
}

int main() {
    int n;
    cin >> n;
    int a[100];
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << average(a, n) << endl;
    return 0;
}`,
    tests: [{ in: "5\n2 4 6 8 10", out: "6" }, { in: "2\n1 2", out: "1.5" }, { in: "0", out: "0" }],
    sol: R`#include <iostream>
using namespace std;

float average(int arr[], int n) {
    if (n <= 0) return 0;
    int sum = 0;
    for (int i = 0; i < n; i++)
        sum += arr[i];
    return (float)sum / n;
}

int main() {
    int n;
    cin >> n;
    int a[100];
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << average(a, n) << endl;
    return 0;
}`, why: R`<code>sum = 0</code>, <code>i &lt; n</code> och en konvertering till float före divisionen.` },
  { t: "code", q: R`Statuskoder: skriv <code>int readSensor(int raw, float* val)</code>. Giltiga råvärden är 0–1023. Vid fel: returnera -1 och rör inte val. Annars: sätt <code>*val = raw * 100.0 / 1023</code> och returnera 0. main skriver ut <code>OK</code> eller <code>SENSOR_ERROR</code>.`,
    starter: R`#include <iostream>
using namespace std;

int readSensor(int raw, float* val) {

}

int main() {
    int raw;
    cin >> raw;
    float v = 0;
    if (readSensor(raw, &v) == 0) cout << "OK" << endl;
    else cout << "SENSOR_ERROR" << endl;
    return 0;
}`,
    tests: [{ in: "512", out: "OK" }, { in: "2000", out: "SENSOR_ERROR" }, { in: "-1", out: "SENSOR_ERROR" }, { in: "1023", out: "OK" }],
    sol: R`#include <iostream>
using namespace std;

int readSensor(int raw, float* val) {
    if (raw < 0 || raw > 1023) return -1;
    *val = raw * 100.0 / 1023;
    return 0;
}

int main() {
    int raw;
    cin >> raw;
    float v = 0;
    if (readSensor(raw, &v) == 0) cout << "OK" << endl;
    else cout << "SENSOR_ERROR" << endl;
    return 0;
}`, why: "Felet signaleras via returvärdet och resultatet via pekaren, precis som i många inbyggda bibliotek." },
],

/* ------------------------------------------------------------ 11 */
"git": [
  { t: "mc", q: "Vad är skillnaden mellan fetch och pull?", o: ["Ingen", "Fetch kollar efter ändringar utan att slå ihop dem, pull hämtar och slår ihop", "Pull laddar upp, fetch laddar ner", "Fetch tar bort lokala ändringar"], a: 1,
    why: "Fetch uppdaterar bara din bild av GitHub. Pull = fetch + merge." },
  { t: "mc", q: "Vilket commit-meddelande följer riktlinjerna bäst?", o: ["fix", "Ändringar", "Lägg till medelvärdesberäkning", "Jag har nu lagt till en funktion som räknar ut medelvärdet av alla mätvärden i listan"], a: 2,
    why: "Kort, under 50 tecken, börjar med ett verb och säger vad som ändrats." },
  { t: "multi", q: "Vad bör du titta på i en kodgranskning? Välj alla.", o: ["Fungerar koden och hanteras fel?", "Är namnen tydliga?", "Finns onödig upprepning?", "Vem som skrev koden"], a: [0, 1, 2],
    why: "Granskningen handlar om koden, inte om personen." },
  { t: "text", q: R`Skriv kommandot som skickar dina commits till GitHub.`, accept: ["git push", "git push origin", "git push origin main"], ph: "git ...",
    why: R`<code>git push</code>` },
  { t: "text", q: R`Skriv kommandot som skapar och byter till branchen <code>feature-temp</code>.`, accept: ["git checkout -b feature-temp", "git switch -c feature-temp"], ph: "git ...",
    why: R`<code>git checkout -b feature-temp</code> eller <code>git switch -c feature-temp</code>.` },
  { t: "text", q: R`Skriv kommandot som sparar en commit med meddelandet <code>Fixa off-by-one</code>.`, accept: ['git commit -m "Fixa off-by-one"', "git commit -m 'Fixa off-by-one'"], ph: "git commit ...",
    why: R`<code>git commit -m "Fixa off-by-one"</code>` },
  { t: "text", q: R`Vilket kommando markerar <code>main.cpp</code> för nästa commit (stage)?`, accept: ["git add main.cpp"], ph: "git ...",
    why: R`<code>git add main.cpp</code> (eller <code>git add .</code> för alla ändrade filer).` },
],
};
