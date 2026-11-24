SERVICES = {22: "SSH", 53: "DNS", 80: "HTTP", 443: "HTTPS", 1883: "MQTT", 8883: "MQTT över TLS",
            8884: "MQTT över WebSocket och TLS", 5683: "CoAP", 5684: "CoAP över DTLS"}

def port_type(port):
    # TODO: "well-known" (0-1023), "registered" (1024-49151), "dynamic" (49152-65535), annars "ogiltig"
    return "ogiltig"


for _ in range(int(input())):
    port = int(input())
    kind = port_type(port)
    if port in SERVICES:
        print(f"{port}: {kind}, {SERVICES[port]}")
    else:
        print(f"{port}: {kind}")
