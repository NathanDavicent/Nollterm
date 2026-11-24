PI = 3.141592653589793

for _ in range(int(input())):
    air, process, rpm, torque = (float(x) for x in input().split())
    power_w = 0.0      # TODO: vridmoment x vinkelhastighet, där vinkelhastighet = rpm x 2 pi / 60
    diff_k = 0.0       # TODO: processtemperatur minus lufttemperatur
    print(f"effekt {power_w:.1f} W, temperaturskillnad {diff_k:.1f} K")
