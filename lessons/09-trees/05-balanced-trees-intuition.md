# Balanced Trees Intuition (AVL / Red-Black Overview)

**Objective:** Understand why an unbalanced BST degrades to O(n), how a
single rotation restores balance, and what invariants AVL and Red-Black
trees each enforce to keep height at O(log n).

## Concept

Lesson 04 warned that a BST gives no shape guarantee: inserting values in
sorted order builds a chain, not a tree:

```
insert 2, then 3, then 5 (each one bigger, so it always goes right... or
always left, as below):

      5              every node has only one child --
     /                this is a linked list wearing a
    3                 tree's clothes. height = 3 for
   /                  just 3 nodes, and search/insert
  2                   degrade from O(log n) to O(n).
```

The **balance factor** of a node is `height(left) - height(right)`. A
node is unbalanced when `|balance factor| > 1`. The chain above has
balance factor `height(3-subtree) - height(null) = 2 - 0 = 2` at the root
— unbalanced.

A single **right rotation** fixes a left-heavy imbalance like this one by
promoting the left child to the top and demoting the old root to be its
right child:

```
before (unbalanced, root 5):        after rotateRight(5):

      5                                    3
     /                                    / \
    3                                    2   5
   /
  2

  balance factor of 5 before: 2 (unbalanced)
  balance factor of 3 after:  0 (balanced)
```

`rotateRight(y)` reassigns three pointers: `y.left`'s old right child
becomes `y`'s new left child, and `y` becomes the new root's right child.
`rotateLeft` is the mirror image for right-heavy imbalances. A **Left-Right**
or **Right-Left** imbalance (the zig-zag cases) is fixed with two rotations
in sequence — one that isn't implemented here, but follows directly from
composing `rotateLeft` and `rotateRight`.

**AVL trees** re-check the balance factor after every insert/delete and
rotate immediately if it exceeds 1, guaranteeing height O(log n) at the
cost of rotation overhead on every mutation. **Red-Black trees** take a
looser but cheaper approach: every node is colored red or black, subject
to four rules (root is black; red nodes only have black children; every
root-to-null path passes through the same number of black nodes; no two
reds in a row). Those rules bound the longest path to at most twice the
shortest, which is a weaker guarantee than AVL's but needs fewer rotations
per mutation — the reason most language standard libraries (Java's
`TreeMap`, C++'s `std::map`) use Red-Black trees rather than AVL trees.

## Complexity

| Operation                              | Time     | Space |
|-------------------------------------------|----------|-------|
| `balanceFactor` (one node)                | O(h) (calls `height`) | O(h) |
| `rotateLeft` / `rotateRight`               | O(1)     | O(1)  |
| `isBalanced` (whole tree, efficient)       | O(n)     | O(h) |
| `sortedArrayToBST`                         | O(n)     | O(log n) recursion, O(n) output |
| `balanceBST` (rebuild a balanced BST)      | O(n)     | O(n) |
| BST op on a balanced tree (search/insert)  | O(log n) | O(log n) |
| Same BST op on a degenerate (chain) tree   | O(n)     | O(n) |

## Walkthrough

[`05-balanced-trees-intuition.ts`](./05-balanced-trees-intuition.ts) imports
`TreeNode` from [`./01-tree-fundamentals`](./01-tree-fundamentals.ts) and
`inorderRecursive` from [`./02-dfs-traversal`](./02-dfs-traversal.ts).
`balanceFactor` computes `height(left) - height(right)` directly.
`rotateRight` and `rotateLeft` implement the pointer surgery diagrammed
above, returning the new subtree root. `sortedArrayToBST` implements
LeetCode 108 directly: given sorted values, recursively pick the middle
element as the root so both halves are as equal as possible, guaranteeing
a balanced result. `isBalancedStub` is the first exercise — check every
node's balance factor without the O(n^2) cost of recomputing height
from scratch at each node (compute height and detect imbalance in the same
postorder pass, short-circuiting with a sentinel); `isBalanced` is the
worked solution (LeetCode 110). `balanceBSTStub` is the second exercise:
compose `inorderRecursive` (which yields a BST's values in sorted order)
with `sortedArrayToBST` to rebuild any BST — however skewed — into a
balanced one; `balanceBST` is the worked solution (LeetCode 1382).

## LeetCode practice

- **110. Balanced Binary Tree** (Easy)
- **108. Convert Sorted Array to Binary Search Tree** (Easy)
- **1382. Balance a Binary Search Tree** (Medium)

## Key takeaways

- Balance factor = `height(left) - height(right)`; `|balance factor| > 1`
  means the node is unbalanced.
- A single rotation (`rotateLeft`/`rotateRight`) fixes a one-sided
  imbalance in O(1) by promoting a child and demoting its old parent.
- AVL trees rebalance after every mutation for a strict O(log n) height
  guarantee; Red-Black trees allow more slack (paths up to 2x each other)
  for fewer rotations per mutation.
- Any BST, however skewed, can be rebalanced in O(n) by taking its sorted
  in-order values and rebuilding via `sortedArrayToBST` — this is exactly
  `balanceBST` / LeetCode 1382.

Companion code: [`05-balanced-trees-intuition.ts`](./05-balanced-trees-intuition.ts)
