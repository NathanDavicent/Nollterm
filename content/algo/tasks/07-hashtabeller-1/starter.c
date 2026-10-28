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
    // TODO: hashfunktionen key % CAP
    return 0;
}

void init(HashMap* map) {
    map->size = 0;
    for (int i = 0; i < CAP; i++) { map->table[i].key = EMPTY_KEY; map->table[i].value = 0; }
}

void put(HashMap* map, int key, int value) {
    // TODO: linjär sondering. Tom plats: lägg in. Samma nyckel: uppdatera.
    //       Hittas ingen plats: printf("FULL: key=%d\n", key);
}

int get(HashMap* map, int key, int* outValue) {
    // TODO: samma sondering. Stoppa på tom plats.
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
