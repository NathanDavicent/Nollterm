prev_state = 0


def on_pin_change(curr_state):
    """Körs "varje gång PCINT0 triggar", med nya värdet på PINB."""
    global prev_state
    # TODO: vilka bitar har ändrats? Skriv "PBn HIGH" eller "PBn LOW" för varje,
    #       i ordning från bit 0, eller "ingen ändring".
    prev_state = curr_state


for _ in range(int(input())):
    on_pin_change(int(input().strip(), 2))
