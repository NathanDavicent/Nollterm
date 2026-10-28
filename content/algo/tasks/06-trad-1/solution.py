class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def insert(root, x):
    """Returnerar (ev. ny) rot, så att anroparen kan koppla in den nya noden."""
    if root is None:
        return Node(x)
    if x < root.value:
        root.left = insert(root.left, x)
    elif x > root.value:
        root.right = insert(root.right, x)
    return root          # lika: inga dubbletter

def inorder(root):       # vänster, nod, höger: sorterat i ett BST
    return [] if root is None else inorder(root.left) + [root.value] + inorder(root.right)

def preorder(root):      # nod, vänster, höger: roten först
    return [] if root is None else [root.value] + preorder(root.left) + preorder(root.right)

def postorder(root):     # vänster, höger, nod: roten sist
    return [] if root is None else postorder(root.left) + postorder(root.right) + [root.value]

def height(root):        # i kanter, tomt träd = -1
    if root is None:
        return -1
    return 1 + max(height(root.left), height(root.right))

def leaves(root):
    if root is None:
        return 0
    if root.left is None and root.right is None:
        return 1
    return leaves(root.left) + leaves(root.right)


input()
root = None
for x in input().split():
    root = insert(root, int(x))
print("Inorder:", *inorder(root))
print("Preorder:", *preorder(root))
print("Postorder:", *postorder(root))
print("Höjd:", height(root))
print("Löv:", leaves(root))
