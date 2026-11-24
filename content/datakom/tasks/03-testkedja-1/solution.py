STEPS = ["ping 127.0.0.1", "ping gateway", "ping 8.8.8.8", "ping dns.google", "ping sti.se"]
CAUSES = ["nätverkskortet", "lokala nätverket eller gatewayen", "internet bortom routern",
          "DNS", "tjänsten eller dess DNS-server"]

results = [input().strip() for _ in range(5)]

for i in range(5):
    print(f"{i + 1} {STEPS[i]}: {results[i]}")
    if results[i] == "fail":
        # Allt nedanför fungerade, så felet sitter i det här steget.
        print(f"Felet ligger i: {CAUSES[i]}")
        break
else:
    print("Allt fungerar")
