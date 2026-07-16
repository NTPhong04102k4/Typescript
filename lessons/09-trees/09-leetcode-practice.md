# LeetCode Practice Set: Trees

**Objective:** Apply every pattern from this topic — DFS, BFS, BST
properties, and postorder combination — across a mixed Easy-to-Hard
problem set.

## Concept

Each problem below reuses a pattern already built in this topic instead of
inventing a new one:

```
226 Invert Binary Tree      -> postorder pattern (recurse, then swap children)
101 Symmetric Tree           -> paired recursion (compare two subtrees at once)
112 Path Sum                 -> preorder pattern with a running total
199 Right Side View          -> BFS level-order, keep the last node per level
230 Kth Smallest in a BST     -> in-order traversal (sorted for a BST)
114 Flatten Binary Tree       -> postorder pattern, rewire pointers in place
129 Sum Root to Leaf Numbers  -> preorder pattern with a running total (base 10)
124 Binary Tree Max Path Sum  -> postorder pattern (lesson 07's diameter, generalized)
```

Two worth a closer look:

**Right Side View** (199) is level-order traversal (lesson 03) where only
the *last* value collected in each level's loop is kept:

```
levelOrder groups:  [[5], [3,8], [2,4,7,9]]
rightSideView keeps the last of each row: [5, 8, 9]
```

**Binary Tree Maximum Path Sum** (124) generalizes lesson 07's diameter:
instead of tracking "longest path" it tracks "highest-sum path," and a
path's contribution *upward* to its parent is clamped at 0 so a
negative-sum branch is simply excluded rather than dragging the total
down:

```
gain(node) = node.value + max(0, gain(left), gain(right))   <- what a parent may take
best-path-through-node = node.value + max(0, gain(left)) + max(0, gain(right))
running max over every node visited = the answer
```

## Complexity

| Problem                              | Time | Space (call stack) |
|------------------------------------------|------|----------------------|
| 226 `invertTree`                          | O(n) | O(h) |
| 101 `isSymmetric`                          | O(n) | O(h) |
| 112 `hasPathSum`                           | O(n) | O(h) |
| 199 `rightSideView`                        | O(n) | O(n) queue worst case |
| 230 `kthSmallestBST`                       | O(h + k) with early exit | O(h) |
| 114 `flatten`                              | O(n) | O(h) |
| 129 `sumNumbers`                            | O(n) | O(h) |
| 124 `maxPathSum`                            | O(n) | O(h) |

## Walkthrough

[`09-leetcode-practice.ts`](./09-leetcode-practice.ts) imports `TreeNode`
and `buildSampleTree` from
[`./01-tree-fundamentals`](./01-tree-fundamentals.ts) and `levelOrder` from
[`./03-bfs-level-order`](./03-bfs-level-order.ts) (reused directly inside
`rightSideView`). Every problem is implemented as its own exported
function, each commented with the exact LeetCode number and difficulty it
solves; see the doc comment above each function for its specific approach.

## LeetCode practice

- **226. Invert Binary Tree** (Easy)
- **101. Symmetric Tree** (Easy)
- **112. Path Sum** (Easy)
- **199. Binary Tree Right Side View** (Medium)
- **230. Kth Smallest Element in a BST** (Medium)
- **114. Flatten Binary Tree to Linked List** (Medium)
- **129. Sum Root to Leaf Numbers** (Medium)
- **124. Binary Tree Maximum Path Sum** (Hard)

## Key takeaways

- Nearly every tree problem is one of: postorder-combine, preorder-with-
  running-state, paired recursion, or BFS-with-per-level-bookkeeping — the
  four shapes this whole topic has been building.
- BST problems (like 230) can shortcut a full traversal by exploiting the
  sorted in-order property and stopping early once the k-th value is
  reached.
- "Maximum path sum" problems generalize diameter: swap "longest" for
  "highest-sum," and clamp any negative contribution to 0 so it's excluded
  rather than subtracted.
- Working through Easy to Hard in one set is a good gut-check: if a Hard
  problem's recursion still looks like "recurse both children, combine at
  this node," the topic's core idea has landed.

Companion code: [`09-leetcode-practice.ts`](./09-leetcode-practice.ts)
