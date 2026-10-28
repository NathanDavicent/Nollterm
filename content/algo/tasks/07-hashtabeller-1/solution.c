#include <stdio.h>
#include <string.h>

#define CAP 11
#define EMPTY_KEY 0   // nyckeln 0 betyder tom plats

typedef struct {
    int key;
    int value;
} Entry;

typedef struct {
    Entry table[CAP];
    int size;
} HashMap;

int f(int key) {
    return key % CAP;
}

void init(HashMap* map) {
    map->size = 0;
    for (int i = 0; i < CAP; i++) { map->table[i].key = EMPTY_KEY; map->table[i].value = 0; }
}

void put(HashMap* map, int key, int value) {
    int start = f(key);
    for (int step = 0; step < CAP; step++) {
        int idx = (start + step) % CAP;   // nästa plats, och runt till 0 efter sista
        if (map->table[idx].key == EMPTY_KEY) {        // tom: insert
            map->table[idx].key = key;
            map->table[idx].value = value;
            map->size++;
            return;
        }
        if (map->table[idx].key == key) {              // samma nyckel: update
            map->table[idx].value = value;
            return;
        }
        // annan nyckel: kollision, prova nästa
    }
    printf("FULL: key=%d\n", key);
}

int get(HashMap* map, int key, int* outValue) {
    int start = f(key);
    for (int step = 0; step < CAP; step++) {
        int idx = (start + step) % CAP;
        if (map->table[idx].key == EMPTY_KEY) return 0;   // ett hål: nyckeln kan inte finnas längre fram
        if (map->table[idx].key == key) {
            *outValue = map->table[idx].value;
            return 1;
        }
    }
    return 0;
}

void printTable(const HashMap* map) {
    for (int i = 0; i < CAP; i++) {
        if (map->table[i].key == EMPTY_KEY) printf("[%d] EMPTY\n", i);
        else printf("[%d] key=%d value=%d\n", i, map->table[i].key, map->table[i].value);
    }
}

int main(void) {
    HashMap map;
    init(&map);
    int m;
    scanf("%d", &m);
    for (int i = 0; i < m; i++) {
        char cmd[16];
        int k, v;
        scanf("%15s", cmd);
        if (strcmp(cmd, "put") == 0) { scanf("%d %d", &k, &v); put(&map, k, v); }
        else if (strcmp(cmd, "get") == 0) {
            scanf("%d", &k);
            if (get(&map, k, &v)) printf("get(%d) -> %d\n", k, v);
            else printf("get(%d) -> NOT FOUND\n", k);
        } else if (strcmp(cmd, "print") == 0) printTable(&map);
    }
    return 0;
}
