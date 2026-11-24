#include <stdio.h>
#include <string.h>

typedef enum { IDLE, MEASURING, SENDING, BUFFERING, ERROR_STATE } state_t;
const char *STATE_NAMES[] = {"IDLE", "MEASURING", "SENDING", "BUFFERING", "ERROR"};

/* Returnerar -1 om händelsen ska ignoreras. */
int process_event(state_t s, const char *event) {
    switch (s) {
    case IDLE:
        if (strcmp(event, "TICK") == 0) return MEASURING;
        break;
    case MEASURING:
        if (strcmp(event, "DATA_READY") == 0) return SENDING;
        if (strcmp(event, "SENSOR_ERROR") == 0) return ERROR_STATE;
        break;
    case SENDING:
        if (strcmp(event, "SENT") == 0) return IDLE;
        if (strcmp(event, "WIFI_DOWN") == 0) return BUFFERING;
        break;
    case BUFFERING:
        if (strcmp(event, "WIFI_UP") == 0) return SENDING;
        break;
    case ERROR_STATE:
        if (strcmp(event, "RESET") == 0) return IDLE;
        break;
    }
    return -1;
}

int main(void) {
    int n;
    state_t state = IDLE;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        char event[32];
        scanf("%31s", event);
        int next = process_event(state, event);
        if (next < 0) {
            printf("%s: %s (ignorerad)\n", event, STATE_NAMES[state]);
        } else {
            printf("%s: %s -> %s\n", event, STATE_NAMES[state], STATE_NAMES[next]);
            state = (state_t)next;
        }
    }
    return 0;
}
