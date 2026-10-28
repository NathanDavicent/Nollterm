#include <iostream>
#include <memory>
#include <string>
using namespace std;

struct AttackStrategy {
    virtual ~AttackStrategy() = default;
    virtual int damage() const = 0;
};

struct SwordAttack : AttackStrategy {
    int damage() const override { return 10; }
};

struct FireballAttack : AttackStrategy {
    int damage() const override { return 15; }
};

class Player {
    unique_ptr<AttackStrategy> attack_;
public:
    void setAttack(unique_ptr<AttackStrategy> a) { attack_ = move(a); }
    int attack() const { return attack_ ? attack_->damage() : 0; }
};

int main() {
    Player p;
    int total = 0;
    string w;
    while (cin >> w) {
        if (w == "sword") p.setAttack(make_unique<SwordAttack>());
        else if (w == "fireball") p.setAttack(make_unique<FireballAttack>());
        total += p.attack();
    }
    cout << total << endl;
    return 0;
}
