#include <stdio.h>
#include <string.h>

typedef enum { IDLE, MEASURING, SENDING, BUFFERING, ERROR_STATE } state_t;
const char *STATE_NAMES[] = {"IDLE", "MEASURING", "SENDING", "BUFFERING", "ERROR"};

/* IDLE --TICK--> MEASURING --DATA_READY--> SENDING --SENT--> IDLE
   MEASURING --SENSOR_ERROR--> ERROR --RESET--> IDLE
   SENDING --WIFI_DOWN--> BUFFERING --WIFI_UP--> SENDING
   Returnerar -1 om händelsen ska ignoreras. */
int process_event(state_t s, const char *event) {
    if (s == IDLE && strcmp(event, "TICK") == 0) return MEASURING;
    // TODO: resten av övergångarna
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
