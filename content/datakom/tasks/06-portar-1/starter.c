#include <stdio.h>

const int PORTS[] = {22, 53, 80, 443, 1883, 8883, 8884, 5683, 5684};
const char *NAMES[] = {"SSH", "DNS", "HTTP", "HTTPS", "MQTT", "MQTT över TLS",
                       "MQTT över WebSocket och TLS", "CoAP", "CoAP över DTLS"};
const int COUNT = 9;

const char *portType(int port) {
    // TODO: "well-known" (0-1023), "registered" (1024-49151), "dynamic" (49152-65535), annars "ogiltig"
    return "ogiltig";
}

int main(void) {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        int port;
        scanf("%d", &port);
        printf("%d: %s", port, portType(port));
        for (int j = 0; j < COUNT; j++) {
            if (PORTS[j] == port) printf(", %s", NAMES[j]);
        }
        printf("\n");
    }
    return 0;
}
