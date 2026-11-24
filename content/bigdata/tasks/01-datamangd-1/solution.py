sensors, per_second, size, copies = (int(x) for x in input().split())

bytes_per_second = sensors * per_second * size
gb_per_day = bytes_per_second * 86_400 / 1e9            # sekunder per dygn
tb_per_year = bytes_per_second * 86_400 * 365 / 1e12

print(f"Byte per sekund: {bytes_per_second}")
print(f"GB per dygn: {gb_per_day:.2f}")
print(f"TB per år: {tb_per_year:.2f}")
print(f"Med {copies} kopior: {tb_per_year * copies:.2f} TB per år")
