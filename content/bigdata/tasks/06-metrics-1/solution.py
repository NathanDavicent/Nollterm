def safe_div(a, b):
    return a / b if b else 0.0        # som zero_division=0 i sklearn

def report(name, y_true, y_pred):
    tn = fp = fn = tp = 0
    for t, p in zip(y_true, y_pred):
        if t == 1 and p == 1: tp += 1      # hittat fel
        elif t == 0 and p == 1: fp += 1    # falskt larm
        elif t == 1 and p == 0: fn += 1    # missat fel
        else: tn += 1                      # sant normal
    accuracy = (tp + tn) / len(y_true)
    precision = safe_div(tp, tp + fp)
    recall = safe_div(tp, tp + fn)
    f1 = safe_div(2 * precision * recall, precision + recall)
    print(f"{name}: [[{tn}, {fp}], [{fn}, {tp}]]")
    print(f"  accuracy {accuracy:.3f}, precision {precision:.3f}, recall {recall:.3f}, f1 {f1:.3f}")


n = int(input())
y_true = [int(x) for x in input().split()]
y_pred = [int(x) for x in input().split()]
report("Modell", y_true, y_pred)
majority = 1 if sum(y_true) * 2 > n else 0
report("Baslinje", y_true, [majority] * n)    # gissar alltid den vanligaste klassen
