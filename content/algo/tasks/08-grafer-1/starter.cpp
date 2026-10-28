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
    // TODO: markera start och lägg den i kön. Plocka ut, skriv ut och lägg till obesökta grannar.
    cout << endl;
}

int main() {
    int start;
    auto adj = readGraph(start);
    bfs(adj, start);
    return 0;
}
