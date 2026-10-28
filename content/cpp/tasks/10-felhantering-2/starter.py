class SensorError(Exception):
    pass


def read_sensor(raw):
    # kasta SensorError om raw ligger utanför 0–1023, annars returnera procent
    pass


raw = int(input())
try:
    read_sensor(raw)
    print("OK")
except SensorError:
    print("SENSOR_ERROR")
