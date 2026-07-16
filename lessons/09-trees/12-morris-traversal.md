# Morris In-Order Traversal (O(1) Space)

**Objective:** Traverse a binary tree in in-order without recursion and without an explicit stack — using only O(1) extra space by temporarily threading pointers.

## Concept

Recursive and stack-based in-order traversals both use O(h) extra memory
for the call/explicit stack. Morris traversal drops that to O(1) by
borrowing the tree's own null right-pointers: for each node it creates a
temporary **thread** from the in-order predecessor back to the node, uses it
to climb back up, then removes it — leaving the tree exactly as it was.

For a node `cur` with a left child, its in-order predecessor is the
*rightmost* node of the left subtree. The algorithm visits `cur` twice:

- **First arrival** — predecessor's right is `null`: set `pred.right = cur`
  (the thread) and descend left.
- **Second arrival** (we climbed the thread back up) — predecessor's right
  already points to `cur`: remove the thread, *record* `cur`, descend right.

```
Start:                  Thread created for 5 (pred = 4):

      5                        5
    /   \                    /   \
   3     8                  3     8
  / \                      / \
 2   4                    2   4----> (4.right threads back to 5)

Descend left to 3, thread 3 (pred = 2):
   3
  / \
 2   4       2.right ----> 3

Now 2 has no left child -> visit 2, follow 2's thread up to 3,
thread found -> remove it, visit 3, go right to 4, follow 4's
thread up to 5, remove it, visit 5, go right to 8 ...

Emitted order: 2, 3, 4, 5, 7, 8, 9   (tree fully restored)
```

The key invariant: every thread that gets created is later found and
removed, so when traversal finishes the tree structure is byte-for-byte the
original. Each edge is walked at most a constant number of times, so total
work stays O(n) despite the predecessor searches.

## Complexity

| Operation                 | Time | Space |
|---------------------------|------|-------|
| `morrisInorder`           | O(n) | O(1)  |
| `kthSmallestMorris`       | O(n) | O(1)  |
| recursive/stack in-order (for contrast) | O(n) | O(h) |

## Walkthrough

[`12-morris-traversal.ts`](./12-morris-traversal.ts) imports `TreeNode` and
`buildSampleTree` from [lesson 01](./01-tree-fundamentals.ts) rather than
redefining the node type. `morrisInorder` follows the two-arrival rule
above: no left child means visit-and-go-right; otherwise it walks to the
predecessor and either threads (first arrival) or unthreads-and-visits
(second arrival).

Because the sample tree is a BST, its in-order output is sorted
(`[2,3,4,5,7,8,9]`). The run block asserts a *second* traversal produces the
same result and that `tree.right` is still node 8 — proof the threads were
cleaned up. The `kthSmallestMorris` exercise reuses the same walk but stops
as soon as `k` values have been emitted.

## LeetCode practice

- **94. Binary Tree Inorder Traversal** (Easy) — the problem's follow-up
  explicitly asks for an O(1)-space solution, which is exactly Morris
  traversal. See `inorderTraversal` in the companion code.

## Key takeaways

- Morris traversal reaches O(1) space by threading each node's in-order
  predecessor's right pointer to the node, then removing the thread when the
  left subtree is exhausted.
- Every node with a left child is arrived at twice: create the thread on the
  first arrival, tear it down and emit the value on the second.
- The predecessor is the rightmost node of the left subtree — but stop the
  rightward walk if you hit an existing thread pointing back to `cur`.
- The tree is fully restored when traversal ends, so it is safe to traverse
  a shared tree repeatedly — but not safe to run concurrently, since the
  tree is transiently mutated mid-traversal.

Companion code: [`12-morris-traversal.ts`](./12-morris-traversal.ts)
