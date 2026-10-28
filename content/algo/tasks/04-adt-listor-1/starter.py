class Node:
    def __init__(self, d, rest=None):
        self.d = d
        self.rest = rest


class LinkedList:
    """Enkellänkad lista byggd av Node-objekt. Använd inte Pythons inbyggda list här."""

    def __init__(self):
        self.head = None

    def empty(self):
        return self.head is None

    # TODO: implementera metoderna
    def add_first(self, d): pass
    def add_last(self, d): pass
    def remove_first(self): assert not self.empty()
    def remove_last(self): assert not self.empty()
    def remove_element(self, d): return False
    def contains(self, d): return False
    def length(self): return 0
    def __str__(self): return "[]"


lst = LinkedList()
for _ in range(int(input())):
    cmd, *arg = input().split()
    if cmd == "addFirst": lst.add_first(int(arg[0]))
    elif cmd == "addLast": lst.add_last(int(arg[0]))
    elif cmd == "removeFirst": lst.remove_first()
    elif cmd == "removeLast": lst.remove_last()
    elif cmd == "remove": print(int(lst.remove_element(int(arg[0]))))
    elif cmd == "contains": print(int(lst.contains(int(arg[0]))))
    elif cmd == "length": print(lst.length())
    elif cmd == "print": print(lst)
