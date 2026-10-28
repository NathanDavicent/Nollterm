from abc import ABC, abstractmethod


class OldThermo:                     # kan inte ändras
    def __init__(self, tenths):
        self._tenths = tenths

    def read_tenths(self):
        return self._tenths


class ISensor(ABC):
    @abstractmethod
    def read(self):
        ...


# skriv ThermoAdapter


a = ThermoAdapter(OldThermo(int(input())))
print(f"{a.read():g}")
