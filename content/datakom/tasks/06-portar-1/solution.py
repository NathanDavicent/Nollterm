SERVICES = {22: "SSH", 53: "DNS", 80: "HTTP", 443: "HTTPS", 1883: "MQTT", 8883: "MQTT över TLS",
            8884: "MQTT över WebSocket och TLS", 5683: "CoAP", 5684: "CoAP över DTLS"}

def port_type(port):
    if 0 <= port <= 1023:
        return "well-known"
    if port <= 49151:
        return "registered"
    if port <= 65535:        # porten är ett 16-bitarstal
        return "dynamic"
    return "ogiltig"


for _ in range(int(input())):
    port = int(input())
    kind = port_type(port)
    if port in SERVICES:
        print(f"{port}: {kind}, {SERVICES[port]}")
    else:
        print(f"{port}: {kind}")
