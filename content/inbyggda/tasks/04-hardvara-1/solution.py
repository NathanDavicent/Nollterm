def map_range(x, in_min, in_max, out_min, out_max):
    """Som Arduinos map(): flytta x från [in_min, in_max] till [out_min, out_max] med heltal."""
    # Multiplicera först och dela sist. // trunkerar som i C så länge talen är positiva.
    return (x - in_min) * (out_max - out_min) // (in_max - in_min) + out_min


for _ in range(int(input())):
    print(map_range(*(int(v) for v in input().split())))
