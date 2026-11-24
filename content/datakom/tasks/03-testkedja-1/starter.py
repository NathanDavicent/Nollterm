STEPS = ["ping 127.0.0.1", "ping gateway", "ping 8.8.8.8", "ping dns.google", "ping sti.se"]
CAUSES = ["nätverkskortet", "lokala nätverket eller gatewayen", "internet bortom routern",
          "DNS", "tjänsten eller dess DNS-server"]

results = [input().strip() for _ in range(5)]

# TODO: skriv ut "1 ping 127.0.0.1: ok" och så vidare, men sluta vid första "fail"
#       och skriv då "Felet ligger i: <orsak>". Om allt är ok: "Allt fungerar"
for i in range(5):
    print(f"{i + 1} {STEPS[i]}: {results[i]}")
