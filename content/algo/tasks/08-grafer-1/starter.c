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

typedef struct {
    int data[N];
    int head, tail, count;
} Queue;

void queue_init(Queue* q) { q->head = q->tail = q->count = 0; }
int queue_is_empty(Queue* q) { return q->count == 0; }
void queue_push(Queue* q, int x) { /* TODO */ }
int queue_pop(Queue* q) { /* TODO */ return -1; }

void bfs(int start) {
    int visited[N] = {0};
    Queue q;
    queue_init(&q);
    // TODO: markera start och lägg den i kön, och loopa tills kön är tom
    printf("\n");
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

    bfs(start);
    return 0;
}
