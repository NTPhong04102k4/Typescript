# DFS Traversal: Pre/In/Post-order

**Objective:** Implement the three depth-first traversal orders both
recursively and iteratively, and understand what each order is for.

## Concept

Depth-first search on a binary tree visits a node relative to its two
children in one of three orders. On the sample tree from lesson 01:

```
              5
            /   \
           3     8
          / \   / \
         2   4 7   9
```

- **Pre-order** (node, left, right) — visit the node *before* its
  subtrees: `5, 3, 2, 4, 8, 7, 9`. Useful for copying/serializing a tree,
  since a parent is always emitted before its children.
- **In-order** (left, node, right) — visit the node *between* its
  subtrees: `2, 3, 4, 5, 7, 8, 9`. For a binary search tree this always
  produces values in sorted order — the invariant lesson 04 depends on.
- **Post-order** (left, right, node) — visit the node *after* its
  subtrees: `2, 4, 3, 7, 9, 8, 5`. Useful whenever a node depends on
  results from its children first, like computing height or deleting a
  tree bottom-up.

Annotated call tree for in-order on the left subtree (rooted at `3`), read
top to bottom as the recursion unwinds:

```
                 inorder(3)
                /          \
          inorder(2)     inorder(4)
          visit "2"      visit "4"
                \          /
                 visit "3" (between the two recursive calls)

  order emitted: 2, 3, 4
```

Each recursive traversal can also be done iteratively with an explicit
stack, which is what interviewers usually ask for once you've shown the
recursive version.

## Complexity

| Operation                          | Time | Space (recursive) | Space (iterative) |
|-------------------------------------|------|--------------------|--------------------|
| `preorderRecursive` / `Iterative`    | O(n) | O(h) call stack    | O(h) explicit stack |
| `inorderRecursive` / `Iterative`     | O(n) | O(h) call stack    | O(h) explicit stack |
| `postorderRecursive` / `Iterative`   | O(n) | O(h) call stack    | O(h) explicit stack |

`h` is tree height; all three orders visit every node exactly once.

## Walkthrough

[`02-dfs-traversal.ts`](./02-dfs-traversal.ts) imports `TreeNode` and
`buildSampleTree` from [`./01-tree-fundamentals`](./01-tree-fundamentals.ts).
`preorderRecursive`, `inorderRecursive`, and `postorderRecursive` are the
direct textbook recursive definitions. `preorderIterative` shows the
general iterative pattern: push a node, pop it, visit it, then push right
before left (so left is popped first). `inorderIterativeStub` is the first
exercise — push the entire left spine onto a stack, pop, visit, then move
to the popped node's right child and repeat; `inorderIterative` is the
worked solution. `postorderIterativeStub` is the second exercise: since
post-order is the reverse of "node, right, left," it can be produced by
running a preorder-like traversal that visits right before left, collecting
into a stack, then reversing; `postorderIterative` is the worked solution.

## LeetCode practice

- **144. Binary Tree Preorder Traversal** (Easy)
- **94. Binary Tree Inorder Traversal** (Easy)
- **145. Binary Tree Postorder Traversal** (Easy)

## Key takeaways

- Pre/in/post-order differ only in *when* the current node is visited
  relative to its two recursive calls.
- In-order traversal of a valid BST always yields sorted values — this is
  the core fact lesson 04 builds on.
- Post-order is the natural order for anything bottom-up: height,
  diameter, deletion, serialization cleanup.
- Every recursive traversal has a mechanical iterative equivalent using an
  explicit stack; post-order's iterative version is the trickiest because
  a node must be visited only after *both* children are done.

Companion code: [`02-dfs-traversal.ts`](./02-dfs-traversal.ts)
