from enum import Enum


class SafeState(Enum):
    IDLE = "IDLE"
    ONE = "1"
    ONE_TWO = "12"
    ONE_TWO_THREE = "123"
    UNLOCKED = "OLÅST"


def next_state(state, key):
    """Koden är 1234. Fel siffra skickar tillbaka till IDLE. 0 låser när skåpet är olåst."""
    return state   # TODO


state = SafeState.IDLE
for key in input().strip():
    state = next_state(state, key)
    print(f"{key} -> {state.value}")
