from enum import Enum


class SafeState(Enum):
    IDLE = "IDLE"
    ONE = "1"
    ONE_TWO = "12"
    ONE_TWO_THREE = "123"
    UNLOCKED = "OLÅST"


# För varje tillstånd på väg mot koden: (rätt siffra, nästa tillstånd)
PROGRESS = {
    SafeState.IDLE: ("1", SafeState.ONE),
    SafeState.ONE: ("2", SafeState.ONE_TWO),
    SafeState.ONE_TWO: ("3", SafeState.ONE_TWO_THREE),
    SafeState.ONE_TWO_THREE: ("4", SafeState.UNLOCKED),
}


def next_state(state, key):
    """Koden är 1234. Fel siffra skickar tillbaka till IDLE. 0 låser när skåpet är olåst."""
    if state == SafeState.UNLOCKED:
        return SafeState.IDLE if key == "0" else SafeState.UNLOCKED
    want, to = PROGRESS[state]
    return to if key == want else SafeState.IDLE


state = SafeState.IDLE
for key in input().strip():
    state = next_state(state, key)
    print(f"{key} -> {state.value}")
