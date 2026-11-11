LCD_SET_DDRAM = 0x80     # kommandot "Set DDRAM address" är 1xxxxxxx
LCD_ROW1_OFFSET = 0x40   # rad 2 börjar på adress 0x40 i en 16x2-display


def lcd_cursor_command(row, col):
    address = row * LCD_ROW1_OFFSET + col
    return LCD_SET_DDRAM | address   # översta biten säger att det är ett adresskommando


for _ in range(int(input())):
    row, col = (int(v) for v in input().split())
    print(f"rad {row}, kolumn {col}: 0x{lcd_cursor_command(row, col):02X}")
