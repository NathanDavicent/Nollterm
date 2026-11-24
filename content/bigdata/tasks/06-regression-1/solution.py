n = int(input())
pairs = [tuple(float(x) for x in input().split()) for _ in range(n)]
y_true = [t for t, _ in pairs]
y_pred = [p for _, p in pairs]
mean = sum(y_true) / n

mae = sum(abs(t - p) for t, p in pairs) / n
baseline_mae = sum(abs(t - mean) for t in y_true) / n
ss_res = sum((t - p) ** 2 for t, p in pairs)     # modellens fel
ss_tot = sum((t - mean) ** 2 for t in y_true)    # felet om vi alltid gissar medelvärdet
r2 = 1 - ss_res / ss_tot
print(f"MAE: {mae:.3f}")
print(f"MAE för medelvärdesbaslinjen: {baseline_mae:.3f}")
print(f"R2: {r2:.3f}")
