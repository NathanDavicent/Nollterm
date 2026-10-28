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
queue = deque([start])
visited[start] = True        # markera när noden läggs i kön, så att den inte läggs dit två gånger
order = []
while queue:
    v = queue.popleft()      # kö: först in, först ut
    order.append(v)
    for u in adj[v]:
        if not visited[u]:
            visited[u] = True
            queue.append(u)
print(*order)
