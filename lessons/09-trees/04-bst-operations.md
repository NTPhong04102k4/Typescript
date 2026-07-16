# Binary Search Tree Operations

**Objective:** Implement search, insert, validate, and delete for a Binary
Search Tree, understanding why each costs O(h) instead of O(n).

## Concept

A **Binary Search Tree (BST)** adds one invariant to a binary tree: for
every node, every value in its left subtree is smaller, and every value in
its right subtree is larger. The sample tree from lesson 01 already
satisfies this:

```
                5
              /   \
             3     8
            / \   / \
           2   4 7   9

  left subtree of 5:  {2, 3, 4} — all < 5
  right subtree of 5: {7, 8, 9} — all > 5
  (same invariant holds recursively at 3 and at 8)
```

This invariant is exactly why lesson 02's in-order traversal on this tree
produced sorted output (`2,3,4,5,7,8,9`): "left, node, right" *is* "smaller
values, this value, larger values."

**Search** and **insert** both exploit the invariant to skip half the
remaining tree at every step, the same idea as binary search over a sorted
array — except the "array" is shaped by the tree instead of being
contiguous. Searching for `6`: `6 > 5` go right to `8`; `6 < 8` go left to
`7`; `6 < 7` go left, hit `null` — not found.

**Delete** is the subtle one. Three cases:

```
1. Deleting a leaf: just remove it.
2. Deleting a node with one child: replace the node with that child.
3. Deleting a node with two children: replace the node's VALUE with its
   in-order successor (the minimum value in its right subtree), then
   delete that successor from the right subtree (successor has at most
   one child, so this recurses into case 1 or 2).

Deleting 8 (two children: 7 and 9) from the sample tree:
   successor = min of right subtree of 8 = 9 (9 has no left child)
   8's value becomes 9, then remove the old leaf 9:

                5
              /   \
             3     9      <- was 8, now holds successor's value 9
            / \   /
           2   4 7         <- old leaf 9 removed
```

## Complexity

| Operation                  | Time (avg, balanced) | Time (worst, skewed) | Space |
|------------------------------|-----------------------|-----------------------|-------|
| `searchBST`                  | O(log n)              | O(n)                  | O(h) |
| `insertIntoBST`               | O(log n)              | O(n)                  | O(h) |
| `isValidBST`                  | O(n)                  | O(n)                  | O(h) |
| `deleteBSTNode`                | O(log n)              | O(n)                  | O(h) |
| `rangeSumBST` (exercise)      | O(n) worst, less with pruning | O(n) | O(h) |

`h` is the tree's height; a skewed BST (effectively a linked list)
degrades every O(log n) operation to O(n) — the motivation for lesson 05.

## Walkthrough

[`04-bst-operations.ts`](./04-bst-operations.ts) imports `TreeNode` and
`buildSampleTree` from [`./01-tree-fundamentals`](./01-tree-fundamentals.ts),
and `inorderRecursive` from [`./02-dfs-traversal`](./02-dfs-traversal.ts) to
verify results by checking that in-order output stays sorted after each
mutation. `searchBST` walks left/right by comparing the target to the
current node. `insertIntoBST` walks the same way until it finds a `null`
slot and places a new node there, returning the (possibly new) root.
`isValidBST` cannot just compare a node to its immediate children — a
node deep in a left subtree could still violate an ancestor's bound even
if it satisfies its direct parent — so it threads a `(low, high)` bound
down the recursion instead. `minValueNode` is a small helper used by
`deleteBSTNode`, which implements the three-case algorithm described above.
`rangeSumBSTStub` is the exercise: sum all node values within `[low, high]`,
pruning subtrees that are entirely out of range instead of visiting every
node; `rangeSumBST` is the worked solution.

## LeetCode practice

- **700. Search in a Binary Search Tree** (Easy)
- **701. Insert into a Binary Search Tree** (Medium)
- **98. Validate Binary Search Tree** (Medium)
- **450. Delete Node in a BST** (Medium)

(938. Range Sum of BST, Easy, is the exercise worked out in the companion
file.)

## Key takeaways

- The BST invariant (left < node < right, recursively) is what turns
  search/insert into O(log n) on a balanced tree.
- Validating a BST needs a bound threaded through the recursion, not just
  a parent-vs-child comparison — a single out-of-range descendant can
  violate the invariant several levels up.
- Deleting a node with two children never removes that node directly: it
  copies in its in-order successor's value, then deletes the successor
  (which has at most one child).
- A BST gives no worst-case guarantee by itself — a sorted-order insertion
  sequence degrades it into a linked list, which is exactly what lesson 05
  addresses.

Companion code: [`04-bst-operations.ts`](./04-bst-operations.ts)
