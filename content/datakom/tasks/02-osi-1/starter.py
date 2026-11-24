LAYERS = {
    "Bitar": 1, "Kabel": 1, "Radio": 1,
    "Ramar": 2, "MAC": 2, "Switch": 2,
    "Paket": 3, "IP": 3, "Router": 3, "ICMP": 3,
    "Segment": 4, "TCP": 4, "UDP": 4,
    "Inloggning": 5,
    "JSON": 6, "XML": 6, "JPG": 6, "TLS": 6,
    "HTTP": 7, "HTTPS": 7, "MQTT": 7, "FTP": 7, "DNS": 7, "CoAP": 7,
}
NAMES = ["", "Fysiska", "Datalänk", "Nätverk", "Transport", "Session", "Presentation", "Applikation"]


def layer_of(term):
    return 0   # TODO: slå upp termen i LAYERS, 0 om den saknas


for _ in range(int(input())):
    term = input().strip()
    n = layer_of(term)
    if n == 0:
        print(f"{term}: okänt")
    else:
        print(f"{term}: lager {n} ({NAMES[n]})")
