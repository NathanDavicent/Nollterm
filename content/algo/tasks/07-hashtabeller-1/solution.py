CAP = 11
table = [None] * CAP   # varje plats är None eller en tupel (key, value)


def put(key, value):
    start = key % CAP
    for step in range(CAP):
        idx = (start + step) % CAP     # nästa plats, runt till 0 efter sista
        if table[idx] is None or table[idx][0] == key:
            table[idx] = (key, value)  # insert i tom plats, eller update av samma nyckel
            return
    print(f"FULL: key={key}")


def get(key):
    start = key % CAP
    for step in range(CAP):
        e = table[(start + step) % CAP]
        if e is None:
            return None                # hål: nyckeln kan inte finnas längre fram
        if e[0] == key:
            return e[1]
    return None


def print_table():
    for i, e in enumerate(table):
        print(f"[{i}] EMPTY" if e is None else f"[{i}] key={e[0]} value={e[1]}")


for _ in range(int(input())):
    cmd, *arg = input().split()
    if cmd == "put":
        put(int(arg[0]), int(arg[1]))
    elif cmd == "get":
        v = get(int(arg[0]))
        print(f"get({arg[0]}) -> {'NOT FOUND' if v is None else v}")
    elif cmd == "print":
        print_table()
