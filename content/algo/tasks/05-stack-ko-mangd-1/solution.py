line = input()
stack = []   # en Python-lista fungerar som stack: append = push, pop = pop
pairs = {")": "(", "]": "[", "}": "{"}
ok = True
for c in line:
    if c in "([{":
        stack.append(c)
    elif c in pairs:
        # Den senast öppnade måste stängas först: LIFO.
        if not stack or stack.pop() != pairs[c]:
            ok = False
            break
if stack:
    ok = False   # något öppnades men stängdes aldrig
print("OK" if ok else "FEL")
