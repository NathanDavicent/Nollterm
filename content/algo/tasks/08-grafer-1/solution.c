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

void queue_push(Queue* q, int x) {
    q->data[q->tail] = x;
    q->tail = (q->tail + 1) % N;   // ringbuffert
    q->count++;
}

int queue_pop(Queue* q) {
    int x = q->data[q->head];
    q->head = (q->head + 1) % N;
    q->count--;
    return x;
}

void bfs(int start) {
    int visited[N] = {0};
    Queue q;
    queue_init(&q);
    visited[start] = 1;            // markera när noden läggs i kön, så att den inte läggs dit två gånger
    queue_push(&q, start);
    int first = 1;
    while (!queue_is_empty(&q)) {
        int v = queue_pop(&q);
        printf(first ? "%d" : " %d", v);
        first = 0;
        for (int i = 0; i < deg[v]; i++) {
            int u = neighbors[v][i];
            if (!visited[u]) {
                visited[u] = 1;
                queue_push(&q, u);
            }
        }
    }
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
