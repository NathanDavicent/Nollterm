class Sensor:
    def __init__(self, sensor_id):
        self._id = sensor_id


class TemperatureSensor(Sensor):
    def __init__(self, sensor_id):
        super().__init__(sensor_id)      # motsvarar : Sensor(id) i C++

    def describe(self):
        print(f"TemperatureSensor {self._id}")


t = TemperatureSensor(input())
t.describe()
