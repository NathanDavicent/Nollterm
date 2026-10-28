n, m = (int(x) for x in input().split())
adj = [[] for _ in range(n)]
for _ in range(m):
    u, v = (int(x) for x in input().split())
    adj[u].append(v)
    adj[v].append(u)   # oriktad graf: bågen går åt båda hållen
for lst in adj:
    lst.sort()         # grannar i stigande ordning
start = int(input())

visited = [False] * n
order = []


def dfs(v):
    visited[v] = True          # markera när vi går in i noden
    order.append(v)
    for u in adj[v]:
        if not visited[u]:
            dfs(u)             # gå så djupt som möjligt innan nästa granne


dfs(start)
print(*order)
