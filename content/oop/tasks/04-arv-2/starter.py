class Sensor:
    def __init__(self, sensor_id):
        self._id = sensor_id


class TemperatureSensor(Sensor):
    # konstruktor som skickar id vidare med super(), och describe()
    pass


t = TemperatureSensor(input())
t.describe()
