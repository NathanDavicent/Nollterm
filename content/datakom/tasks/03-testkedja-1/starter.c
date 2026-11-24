#include <stdio.h>
#include <string.h>

const char *STEPS[] = {"ping 127.0.0.1", "ping gateway", "ping 8.8.8.8", "ping dns.google", "ping sti.se"};
const char *CAUSES[] = {"nätverkskortet", "lokala nätverket eller gatewayen", "internet bortom routern",
                        "DNS", "tjänsten eller dess DNS-server"};

int main(void) {
    char results[5][8];
    for (int i = 0; i < 5; i++) scanf("%7s", results[i]);

    // TODO: sluta vid första "fail" och skriv "Felet ligger i: <orsak>".
    //       Om alla är ok: "Allt fungerar"
    for (int i = 0; i < 5; i++) {
        printf("%d %s: %s\n", i + 1, STEPS[i], results[i]);
    }
    return 0;
}
