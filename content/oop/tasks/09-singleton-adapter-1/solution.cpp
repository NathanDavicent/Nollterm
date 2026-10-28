#include <iostream>
using namespace std;

class Config {
public:
    static Config& instance() {
        static Config inst;
        return inst;
    }
    int startHealth() const { return startHealth_; }
    void setStartHealth(int v) { startHealth_ = v; }

    Config(const Config&) = delete;
    Config& operator=(const Config&) = delete;
private:
    Config() : startHealth_(100) {}
    int startHealth_;
};

int main() {
    int v;
    if (cin >> v) Config::instance().setStartHealth(v);
    Config& a = Config::instance();
    Config& b = Config::instance();
    cout << a.startHealth() << " " << (&a == &b ? "samma" : "olika") << endl;
    return 0;
}
