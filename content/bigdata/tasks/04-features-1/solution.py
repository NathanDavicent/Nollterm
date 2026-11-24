PI = 3.141592653589793

for _ in range(int(input())):
    air, process, rpm, torque = (float(x) for x in input().split())
    power_w = torque * rpm * 2 * PI / 60   # P = M * omega, omega i rad/s
    diff_k = process - air
    print(f"effekt {power_w:.1f} W, temperaturskillnad {diff_k:.1f} K")
