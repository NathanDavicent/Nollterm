class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


# TODO: implementera funktionerna
def insert(root, x):
    return root          # returnerar (ev. ny) rot

def inorder(root):
    return []            # lista med värdena i inorder

def preorder(root):
    return []

def postorder(root):
    return []

def height(root):
    return 0             # i kanter, tomt träd = -1

def leaves(root):
    return 0


input()
root = None
for x in input().split():
    root = insert(root, int(x))
print("Inorder:", *inorder(root))
print("Preorder:", *preorder(root))
print("Postorder:", *postorder(root))
print("Höjd:", height(root))
print("Löv:", leaves(root))
