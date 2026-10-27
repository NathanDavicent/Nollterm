// Checks that the g++ bridge compiles and runs programs. Used in CI before packaging.
const { run, info } = require("../compiler");
(async () => {
  const i = await info();
  console.log("compiler:", i.path, i.version || i.error);
  if (!i.ok) process.exit(1);
  const cases = [
    { name: "C++ med string/vector", files: [{ name: "main.cpp", content: '#include <iostream>\n#include <string>\n#include <vector>\nint main(){ std::string s; std::getline(std::cin, s); std::vector<int> v{1,2,3}; std::cout << s << " " << v.size() << "\\n"; }' }], stdin: "hej", want: "hej 3" },
    { name: "flera filer + header", files: [
      { name: "main.cpp", content: '#include "add.h"\n#include <iostream>\nint main(){ std::cout << add(2, 3) << "\\n"; }' },
      { name: "add.h", content: "#ifndef ADD_H\n#define ADD_H\nint add(int a, int b);\n#endif\n" },
      { name: "add.cpp", content: '#include "add.h"\nint add(int a, int b){ return a + b; }\n' }], want: "5" },
    { name: "C med malloc", files: [{ name: "main.c", content: '#include <stdio.h>\n#include <stdlib.h>\nint main(void){ int *p = malloc(3 * sizeof(int)); p[0] = 7; printf("%d\\n", p[0]); free(p); return 0; }' }], want: "7" },
    { name: "kompileringsfel", files: [{ name: "main.cpp", content: "int main(){ int x = 5 return 0; }" }], expectFail: "compile" },
    { name: "oändlig loop", files: [{ name: "main.cpp", content: "int main(){ while(true){} }" }], timeoutMs: 1500, expectFail: "run" },
  ];
  let bad = 0;
  for (const c of cases) {
    const r = await run({ files: c.files, stdin: c.stdin || "", timeoutMs: c.timeoutMs });
    const pass = c.expectFail ? (!r.ok && r.stage === c.expectFail) : (r.ok && r.out.trim() === c.want);
    console.log(pass ? "OK  " : "FEL ", c.name, pass ? "" : JSON.stringify(r).slice(0, 300));
    if (!pass) bad++;
  }
  process.exit(bad ? 1 : 0);
})();
