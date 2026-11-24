# IDLE      --TICK-->          MEASURING
# MEASURING --DATA_READY-->    SENDING
# MEASURING --SENSOR_ERROR-->  ERROR
# SENDING   --SENT-->          IDLE
# SENDING   --WIFI_DOWN-->     BUFFERING
# BUFFERING --WIFI_UP-->       SENDING
# ERROR     --RESET-->         IDLE
# Alla andra händelser ignoreras.

TRANSITIONS = {
    ("IDLE", "TICK"): "MEASURING",
    # TODO: resten av övergångarna
}

def process_event(state, event):
    return state    # TODO: slå upp (state, event), annars None


state = "IDLE"
for _ in range(int(input())):
    event = input().strip()
    nxt = process_event(state, event)
    if nxt is None:
        print(f"{event}: {state} (ignorerad)")
    else:
        print(f"{event}: {state} -> {nxt}")
        state = nxt
