def map_range(x, in_min, in_max, out_min, out_max):
    """Som Arduinos map(): flytta x från [in_min, in_max] till [out_min, out_max] med heltal."""
    return 0   # TODO


for _ in range(int(input())):
    print(map_range(*(int(v) for v in input().split())))
