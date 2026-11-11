#include <stdio.h>
#include <stdint.h>

#define LCD_SET_DDRAM   0x80   // kommandot "Set DDRAM address" är 1xxxxxxx
#define LCD_ROW1_OFFSET 0x40   // rad 2 börjar på adress 0x40 i en 16x2-display

uint8_t lcdCursorCommand(int row, int col) {
    return 0;   // TODO
}

int main(void) {
    int q;
    scanf("%d", &q);
    for (int i = 0; i < q; i++) {
        int row, col;
        scanf("%d %d", &row, &col);
        printf("rad %d, kolumn %d: 0x%02X\n", row, col, lcdCursorCommand(row, col));
    }
    return 0;
}
