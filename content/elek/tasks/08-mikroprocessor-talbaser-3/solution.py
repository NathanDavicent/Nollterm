bitar = input().strip()
varde = 0
# Läs från vänster: varje ny bit flyttar de tidigare ett steg upp (gånger 2).
for b in bitar:
    varde = varde * 2 + int(b)
print(varde)
