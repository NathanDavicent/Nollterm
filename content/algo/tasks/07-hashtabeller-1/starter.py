CAP = 11
table = [None] * CAP   # varje plats är None eller en tupel (key, value)


def put(key, value):
    # TODO: linjär sondering från key % CAP. Tom plats: lägg in. Samma nyckel: uppdatera.
    #       Hittas ingen plats: print(f"FULL: key={key}")
    pass


def get(key):
    # TODO: samma sondering. Stoppa på tom plats. Returnera värdet eller None.
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
