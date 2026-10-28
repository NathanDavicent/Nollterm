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

    def add_first(self, d):          # O(1)
        self.head = Node(d, self.head)

    def add_last(self, d):           # O(n)
        if self.empty():
            self.add_first(d)
            return
        n = self.head
        while n.rest is not None:
            n = n.rest
        n.rest = Node(d)

    def remove_first(self):          # O(1)
        assert not self.empty()      # precondition
        self.head = self.head.rest

    def remove_last(self):           # O(n)
        assert not self.empty()
        if self.head.rest is None:
            self.head = None
            return
        n = self.head
        while n.rest.rest is not None:   # stanna på den näst sista
            n = n.rest
        n.rest = None

    def remove_element(self, d):     # O(n), första förekomsten
        prev, cur = None, self.head
        while cur is not None:
            if cur.d == d:
                if prev is None:
                    self.head = cur.rest
                else:
                    prev.rest = cur.rest
                return True
            prev, cur = cur, cur.rest
        return False

    def contains(self, d):           # O(n)
        n = self.head
        while n is not None:
            if n.d == d:
                return True
            n = n.rest
        return False

    def length(self):                # O(n)
        count, n = 0, self.head
        while n is not None:
            count, n = count + 1, n.rest
        return count

    def __str__(self):
        values, n = [], self.head
        while n is not None:
            values.append(str(n.d))
            n = n.rest
        return "[" + ", ".join(values) + "]"


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
