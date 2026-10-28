import sys
from enum import Enum, auto


class MachineState(Enum):
    IDLE = auto()
    RUNNING = auto()
    ERROR = auto()


class Machine:
    def __init__(self):
        self._state = MachineState.IDLE

    def start(self):
        self._state = MachineState.RUNNING

    def fail(self):
        self._state = MachineState.ERROR

    def print_status(self):
        # skriv Idle, Running eller Error
        pass


m = Machine()
for cmd in sys.stdin.read().split():
    if cmd == "start":
        m.start()
    elif cmd == "fail":
        m.fail()
m.print_status()
