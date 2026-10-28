class SensorError(Exception):
    pass


def read_sensor(raw):
    if raw < 0 or raw > 1023:
        raise SensorError(f"ogiltigt råvärde: {raw}")
    return raw * 100.0 / 1023


raw = int(input())
try:
    read_sensor(raw)
    print("OK")
except SensorError:
    print("SENSOR_ERROR")
