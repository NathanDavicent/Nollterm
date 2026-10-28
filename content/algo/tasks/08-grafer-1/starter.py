n, m = (int(x) for x in input().split())
adj = [[] for _ in range(n)]
for _ in range(m):
    u, v = (int(x) for x in input().split())
    adj[u].append(v)
    adj[v].append(u)   # oriktad graf: bågen går åt båda hållen
for lst in adj:
    lst.sort()         # grannar i stigande ordning
start = int(input())

from collections import deque

visited = [False] * n
queue = deque()
order = []
# TODO: BFS från start. Markera när noden läggs i kön.
print(*order)
