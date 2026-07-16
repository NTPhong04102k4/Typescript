# Tree Fundamentals

**Objective:** Learn the vocabulary of trees (root, edge, parent/child, leaf,
depth, height, subtree) and the `TreeNode<T>` building block every later
lesson in this topic reuses.

## Concept

A **tree** is a hierarchical structure of **nodes** connected by **edges**,
starting from a single **root** with no incoming edge. Every node except
the root has exactly one **parent**; a node with no children is a **leaf**;
a node with at least one child is **internal**. A **binary tree** caps
every node at two children, conventionally called `left` and `right` — the
shape this whole topic focuses on.

Two distances matter, and this topic keeps them distinct on purpose:

- **Depth** of a node = number of *edges* from the root to that node. The
  root has depth 0. Depth is what "level" means in level-order traversal.
- **Height** of a node = number of *nodes* along the longest downward path
  to a leaf (a leaf's height is 1, an empty subtree's height is 0). This
  matches how LeetCode's "Maximum Depth of Binary Tree" is actually
  computed, even though the problem name says "depth."

Sample tree used throughout this entire topic (`buildSampleTree` in the
companion file), annotated with depth:

```
depth 0 (root):                 5
                               /   \
depth 1:                      3     8
                             / \   / \
depth 2 (leaves):           2   4 7   9
```

- root: `5`
- leaves: `2, 4, 7, 9` (4 of them)
- internal nodes: `5, 3, 8`
- size (total nodes): 7
- height of the whole tree (height of the root): 3 (path 5 -> 3 -> 2, three
  nodes)
- subtree rooted at `3`: just the three nodes `{3, 2, 4}`

Note this sample tree also happens to satisfy the binary-search-tree
invariant (left subtree values < node < right subtree values). That's
intentional — lesson 04 (BST operations) reuses `buildSampleTree` directly
instead of building another tree from scratch.

## Complexity

| Operation                      | Time  | Space (call stack) |
|---------------------------------|-------|---------------------|
| `size` (count all nodes)        | O(n)  | O(h)                |
| `height` (longest root-to-leaf) | O(n)  | O(h)                |
| `isLeaf` (check one node)       | O(1)  | O(1)                |
| `depthOf` (find a value's depth)| O(n)  | O(h)                |
| `countLeaves`                   | O(n)  | O(h)                |

`h` is the tree's height; every recursive traversal here pays for the call
stack, which is bounded by height, not size.

## Walkthrough

[`01-tree-fundamentals.ts`](./01-tree-fundamentals.ts) defines `TreeNode<T>`
with `value`, `left`, and `right` — the single node type every later lesson
in this topic imports. `buildSampleTree` constructs the seven-node tree
diagrammed above, fresh on every call (so lessons that mutate it, like
BST deletes, never affect another lesson's test). `size` and `height` are
textbook recursive definitions matching the table above; `isLeaf` is the
O(1) check that both rely on. `depthOf` walks the tree looking for a value
and returns the edge-count depth at which it was found, or `-1` if the
value isn't present. `countLeavesStub` is the exercise: count nodes with no
children; `countLeaves` is the worked solution.

## LeetCode practice

- **104. Maximum Depth of Binary Tree** (Easy) — exactly the `height`
  function defined here, applied to the whole tree.
- **222. Count Complete Tree Nodes** (Medium) — a specialized, faster
  version of the `size` function for the special case of complete trees.

## Key takeaways

- A binary tree is nodes with up to two children (`left`, `right`); no
  incoming edge marks the root, no children marks a leaf.
- Depth (edges from root, used for levels) and height (nodes to the
  deepest leaf, used for "maximum depth") are related but not the same
  number — keep them straight.
- Every recursive tree function costs O(n) time and O(h) auxiliary space
  for the call stack, where `h` is the height, not the size.
- `buildSampleTree` returns a fresh tree every call specifically so later
  lessons can mutate it (insert, delete, rotate) without cross-lesson side
  effects.

Companion code: [`01-tree-fundamentals.ts`](./01-tree-fundamentals.ts)
