#include <stdio.h>

#define N 100

int deg[N];
int neighbors[N][N];   // grannlista: neighbors[v][0..deg[v]-1]

void addEdge(int u, int v) { neighbors[u][deg[u]++] = v; }

void sortNeighbors(int v) {   // grannar i stigande ordning (insertion sort)
    for (int i = 1; i < deg[v]; i++) {
        int key = neighbors[v][i], j = i - 1;
        while (j >= 0 && neighbors[v][j] > key) { neighbors[v][j + 1] = neighbors[v][j]; j--; }
        neighbors[v][j + 1] = key;
    }
}

int visited[N];
int printed = 0;

void dfs(int v) {
    visited[v] = 1;                // markera när vi går in i noden
    printf(printed++ ? " %d" : "%d", v);
    for (int i = 0; i < deg[v]; i++) {
        int u = neighbors[v][i];
        if (!visited[u]) dfs(u);   // gå så djupt som möjligt innan nästa granne
    }
}

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        addEdge(u, v);
        addEdge(v, u);    // oriktad graf: bågen går åt båda hållen
    }
    for (int v = 0; v < n; v++) sortNeighbors(v);
    int start;
    scanf("%d", &start);

    dfs(start);
    printf("\n");
    return 0;
}
