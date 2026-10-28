a, b, cin = (int(x) for x in input().split())
summa = a ^ b ^ cin                   # två XOR-grindar
cout = (a & b) | (cin & (a ^ b))      # två AND och en OR
print(f"Sum={summa} Cout={cout}")
