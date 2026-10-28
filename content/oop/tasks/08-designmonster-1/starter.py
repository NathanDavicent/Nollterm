import sys
from abc import ABC, abstractmethod


class AttackStrategy(ABC):
    @abstractmethod
    def damage(self):
        ...


# skriv SwordAttack (10) och FireballAttack (15)


class Player:
    def __init__(self):
        self._attack = None

    def set_attack(self, strategy):
        self._attack = strategy

    def attack(self):
        return self._attack.damage() if self._attack else 0


p = Player()
total = 0
for w in sys.stdin.read().split():
    if w == "sword":
        p.set_attack(SwordAttack())
    elif w == "fireball":
        p.set_attack(FireballAttack())
    total += p.attack()
print(total)
