sensors, per_second, size, copies = (int(x) for x in input().split())

bytes_per_second = 0       # TODO: sensorer x meddelanden per sekund x byte
gb_per_day = 0.0           # TODO: 1 GB = 10^9 byte, ett dygn = 86 400 s
tb_per_year = 0.0          # TODO: 1 TB = 10^12 byte, ett år = 365 dygn

print(f"Byte per sekund: {bytes_per_second}")
print(f"GB per dygn: {gb_per_day:.2f}")
print(f"TB per år: {tb_per_year:.2f}")
print(f"Med {copies} kopior: {tb_per_year * copies:.2f} TB per år")
