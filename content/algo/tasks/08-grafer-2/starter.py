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
    # TODO: markera v, lägg den i order och gå rekursivt till varje obesökt granne
    pass


dfs(start)
print(*order)
