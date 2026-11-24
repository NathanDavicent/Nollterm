# Kolumner: udi,type,air_temperature_k,process_temperature_k,rotational_speed_rpm,torque_nm,tool_wear_min,machine_failure
# Giltig rad: luft 250-350 K, process 250-400 K, varvtal > 0, vridmoment >= 0, slitage >= 0, maskinfel 0 eller 1.
# Ett värde som inte är ett tal räknas som saknat och gör raden ogiltig.

NAMES = ["air_temperature_k", "process_temperature_k", "rotational_speed_rpm", "torque_nm", "tool_wear_min", "machine_failure"]

def to_number(text):
    try:
        return float(text)
    except ValueError:
        return None          # som pd.to_numeric(errors="coerce")

def first_problem(values):
    """Namnet på den första kolumnen som inte klarar kontrollen, eller None."""
    return None              # TODO

n = int(input())
lines = [input().strip() for _ in range(n)]
unique = lines               # TODO: ta bort dubbletter men behåll ordningen
duplicates = n - len(unique)

clean_failures = []
invalid = 0
for line in unique:
    parts = line.split(",")
    values = [to_number(p) for p in parts[2:]]
    problem = first_problem(values)
    if problem:
        invalid += 1
        print(f"Ogiltig rad {parts[0]}: {problem}")
    else:
        clean_failures.append(values[5])

print(f"Rader: {n}")
print(f"Dubbletter: {duplicates}")
print(f"Ogiltiga: {invalid}")
print(f"Rena rader: {len(clean_failures)}")
print(f"Maskinfel: {int(sum(clean_failures))}")
print(f"Felandel: {100 * sum(clean_failures) / len(clean_failures):.2f} %")
