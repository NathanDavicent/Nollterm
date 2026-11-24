n = int(input())
pairs = [tuple(float(x) for x in input().split()) for _ in range(n)]
y_true = [t for t, _ in pairs]
y_pred = [p for _, p in pairs]
mean = sum(y_true) / n

mae = 0.0           # TODO: medel av |sant - prediktion|
baseline_mae = 0.0  # TODO: samma mått om man alltid gissar medelvärdet
r2 = 0.0            # TODO: 1 - (summa (sant - pred)^2) / (summa (sant - medel)^2)
print(f"MAE: {mae:.3f}")
print(f"MAE för medelvärdesbaslinjen: {baseline_mae:.3f}")
print(f"R2: {r2:.3f}")
