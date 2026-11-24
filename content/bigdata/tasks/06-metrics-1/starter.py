def report(name, y_true, y_pred):
    tn = fp = fn = tp = 0
    # TODO: räkna sant negativa, falskt positiva, falskt negativa och sant positiva
    accuracy = 0.0
    precision = 0.0    # TODO: tp / (tp + fp), 0 om nämnaren är 0
    recall = 0.0       # TODO: tp / (tp + fn), 0 om nämnaren är 0
    f1 = 0.0           # TODO: 2pr / (p + r), 0 om nämnaren är 0
    print(f"{name}: [[{tn}, {fp}], [{fn}, {tp}]]")
    print(f"  accuracy {accuracy:.3f}, precision {precision:.3f}, recall {recall:.3f}, f1 {f1:.3f}")


n = int(input())
y_true = [int(x) for x in input().split()]
y_pred = [int(x) for x in input().split()]
report("Modell", y_true, y_pred)
majority = 1 if sum(y_true) * 2 > n else 0
report("Baslinje", y_true, [majority] * n)    # gissar alltid den vanligaste klassen
