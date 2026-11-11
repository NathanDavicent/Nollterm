prev_state = 0


def on_pin_change(curr_state):
    """Körs "varje gång PCINT0 triggar", med nya värdet på PINB."""
    global prev_state
    changed = curr_state ^ prev_state      # XOR: 1 där pinnarna skiljer sig
    if changed == 0:
        print("ingen ändring")
    for bit in range(8):
        mask = 1 << bit
        if changed & mask:
            print(f"PB{bit} {'HIGH' if curr_state & mask else 'LOW'}")
    prev_state = curr_state


for _ in range(int(input())):
    on_pin_change(int(input().strip(), 2))
