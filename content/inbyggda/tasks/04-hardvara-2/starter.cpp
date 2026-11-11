#include <cstdio>
#include <cstdint>

constexpr uint8_t LCD_SET_DDRAM = 0x80;     // kommandot "Set DDRAM address" är 1xxxxxxx
constexpr uint8_t LCD_ROW1_OFFSET = 0x40;   // rad 2 börjar på adress 0x40 i en 16x2-display

uint8_t lcdCursorCommand(int row, int col) {
    return 0;   // TODO
}

int main() {
    int q;
    std::scanf("%d", &q);
    for (int i = 0; i < q; i++) {
        int row, col;
        std::scanf("%d %d", &row, &col);
        std::printf("rad %d, kolumn %d: 0x%02X\n", row, col, lcdCursorCommand(row, col));
    }
    return 0;
}
