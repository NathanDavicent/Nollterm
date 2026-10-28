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

vector<bool> visited;
vector<int> order;

void dfs(const vector<vector<int>>& adj, int v) {
    // TODO: markera v, lägg den i order och gå rekursivt till varje obesökt granne
}

int main() {
    int start;
    auto adj = readGraph(start);
    visited.assign(adj.size(), false);
    dfs(adj, start);
    for (size_t i = 0; i < order.size(); i++) cout << (i ? " " : "") << order[i];
    cout << endl;
    return 0;
}
