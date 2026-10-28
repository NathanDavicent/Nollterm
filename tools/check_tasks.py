"""Kontrollerar alla koduppgifter i content/.

För varje uppgift och varje språk (C, C++, Python) som har filer:
  * solution.<ext> ska klara ALLA tester i tests.txt
  * starter.<ext>  ska INTE klara alla tester (annars är uppgiften redan löst)

Kör:  python tools/check_tasks.py            (alla kurser)
      python tools/check_tasks.py oop        (bara en kurs)

Kräver gcc, g++ och python i PATH (på Windows: w64devkit + Python).
"""
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "content"
TIMEOUT = 5  # sekunder per körning

# Samma flaggor som appen använder
COMPILERS = {
    "c": ["gcc", "-std=c11", "-Wall", "-O0"],
    "cpp": ["g++", "-std=c++17", "-Wall", "-O0"],
}


def parse_tests(path):
    """Läser tests.txt: block med '--- in' följt av '--- out'."""
    tests, section, buf, current = [], None, [], {}
    for line in path.read_text(encoding="utf-8").splitlines() + ["--- in"]:
        if line in ("--- in", "--- out"):
            if section == "in":
                current = {"in": "\n".join(buf)}
            elif section == "out":
                current["out"] = "\n".join(buf).rstrip("\n")
                tests.append(current)
            section, buf = line[4:], []
        else:
            buf.append(line)
    return tests


def normalize(text):
    """Ignorera mellanslag i radslut och tomma rader på slutet."""
    return "\n".join(l.rstrip() for l in text.replace("\r", "").split("\n")).rstrip("\n")


def build(lang, source, workdir):
    """Kompilerar C/C++. Returnerar kommandot som kör programmet, eller None vid fel."""
    if lang == "py":
        src = workdir / "main.py"
        src.write_text(source, encoding="utf-8")
        return [sys.executable, str(src)], ""
    src = workdir / f"main.{lang}"
    exe = workdir / ("prog.exe" if sys.platform == "win32" else "prog")
    src.write_text(source, encoding="utf-8")
    result = subprocess.run(COMPILERS[lang] + [str(src), "-o", str(exe)] + (["-lm"] if lang == "c" else []),
                            capture_output=True, text=True)
    if result.returncode != 0:
        return None, result.stderr
    return [str(exe)], result.stderr


def run_all(lang, source, tests):
    """Kör alla tester. Returnerar (antal godkända, kompilatorvarningar, första felet)."""
    with tempfile.TemporaryDirectory() as tmp:
        cmd, warnings = build(lang, source, Path(tmp))
        if cmd is None:
            return 0, warnings, "kompileringsfel"
        passed, first_fail = 0, None
        for t in tests:
            try:
                r = subprocess.run(cmd, input=t["in"], capture_output=True, text=True, timeout=TIMEOUT,
                                   encoding="utf-8", env={"PYTHONIOENCODING": "utf-8", "PYTHONUTF8": "1",
                                                          "PATH": __import__("os").environ.get("PATH", "")})
                ok = r.returncode == 0 and normalize(r.stdout) == normalize(t["out"])
            except subprocess.TimeoutExpired:
                ok, r = False, None
            if ok:
                passed += 1
            elif first_fail is None:
                got = "timeout" if r is None else (r.stdout or r.stderr)[:120]
                first_fail = f"in={t['in']!r} väntat={t['out']!r} fick={got!r}"
        return passed, warnings, first_fail


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    problems = checked = 0
    for task in sorted(ROOT.glob("*/tasks/*")):
        course = task.parent.parent.name
        if only and course != only:
            continue
        tests = parse_tests(task / "tests.txt")
        for lang in ("c", "cpp", "py"):
            sol, start = task / f"solution.{lang}", task / f"starter.{lang}"
            if not sol.exists():
                continue
            checked += 1
            passed, warnings, fail = run_all(lang, sol.read_text(encoding="utf-8"), tests)
            name = f"{course}/{task.name} [{lang}]"
            if passed != len(tests):
                problems += 1
                print(f"FEL   {name}: lösningen klarar {passed}/{len(tests)} – {fail}")
            elif warnings.strip():
                print(f"VARN  {name}: {warnings.strip().splitlines()[0]}")
            if start.exists():
                passed, _, _ = run_all(lang, start.read_text(encoding="utf-8"), tests)
                if passed == len(tests):
                    problems += 1
                    print(f"FEL   {name}: startkoden klarar redan alla tester")
    print(f"\n{checked} lösningar kontrollerade, {problems} problem")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
