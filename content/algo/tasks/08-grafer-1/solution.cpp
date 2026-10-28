#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

vector<vector<int>> readGraph(int& start) {
    int n, m;
    cin >> n >> m;
    vector<vector<int>> adj(n);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);   // oriktad graf: bågen går åt båda hållen
    }
    for (auto& list : adj) sort(list.begin(), list.end());   // grannar i stigande ordning
    cin >> start;
    return adj;
}

void bfs(const vector<vector<int>>& adj, int start) {
    vector<bool> visited(adj.size(), false);
    queue<int> q;
    visited[start] = true;         // markera när noden läggs i kön, så att den inte läggs dit två gånger
    q.push(start);
    bool first = true;
    while (!q.empty()) {
        int v = q.front();
        q.pop();
        cout << (first ? "" : " ") << v;
        first = false;
        for (int u : adj[v]) {
            if (!visited[u]) {
                visited[u] = true;
                q.push(u);
            }
        }
    }
    cout << endl;
}

int main() {
    int start;
    auto adj = readGraph(start);
    bfs(adj, start);
    return 0;
}
