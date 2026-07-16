# BFS / Level-order Traversal

**Objective:** Traverse a tree breadth-first with a queue, grouping nodes
by depth instead of diving down one branch at a time like DFS does.

## Concept

Breadth-first search visits every node at depth 0, then every node at
depth 1, then depth 2, and so on — a **queue** (FIFO) instead of DFS's
stack/call-stack (LIFO). On the sample tree:

```
depth 0:                        5              <- level 0: [5]
                               /   \
depth 1:                      3     8           <- level 1: [3, 8]
                             / \   / \
depth 2:                    2   4 7   9         <- level 2: [2, 4, 7, 9]
```

Processing one full level before moving to the next requires knowing how
many nodes are in the *current* level before dequeuing any of them:

```
queue = [5]
level 0: queue had 1 node -> pop 5, push its children (3, 8) -> level = [5]
queue = [3, 8]
level 1: queue had 2 nodes -> pop 3 (push 2, 4), pop 8 (push 7, 9) -> level = [3, 8]
queue = [2, 4, 7, 9]
level 2: queue had 4 nodes -> pop all four, none have children -> level = [2, 4, 7, 9]
queue = [] -> done
```

Recording the queue's length *before* each round is what separates one
level's output from the next.

## Complexity

| Operation                     | Time | Space |
|---------------------------------|------|-------|
| `levelOrder`                     | O(n) | O(n) — queue holds up to one full level, output holds all n |
| `levelOrderBottom`               | O(n) | O(n) |
| `zigzagLevelOrder`               | O(n) | O(n) |

Unlike DFS's O(h) auxiliary space, BFS's queue can hold up to the widest
level of the tree, which is O(n) in the worst case (a complete tree's last
level holds roughly half of all nodes).

## Walkthrough

[`03-bfs-level-order.ts`](./03-bfs-level-order.ts) imports `TreeNode` and
`buildSampleTree` from [`./01-tree-fundamentals`](./01-tree-fundamentals.ts).
`levelOrder` uses a plain array as the queue with a `head` index cursor
instead of `Array.shift()`, so dequeuing stays O(1) instead of O(n).
It snapshots the queue's length at the top of each round to know exactly
how many nodes belong to the current level before any of their children
get enqueued. `levelOrderBottomStub` is the first exercise — reverse the
list of levels that `levelOrder` already produces; `levelOrderBottom` is
the worked solution. `zigzagLevelOrderStub` is the second exercise: run
the same level-order scan, but reverse every other level's array before
appending it; `zigzagLevelOrder` is the worked solution.

## LeetCode practice

- **102. Binary Tree Level Order Traversal** (Medium)
- **107. Binary Tree Level Order Traversal II** (Medium)
- **103. Binary Tree Zigzag Level Order Traversal** (Medium)

(199. Binary Tree Right Side View, another level-order derivative, is
implemented in lesson 09's practice set.)

## Key takeaways

- BFS explores level by level using a queue; DFS explores branch by branch
  using a stack (or recursion).
- Snapshotting the queue's length before draining it is the standard way
  to split a flat BFS scan into per-level groups.
- An array-plus-cursor queue avoids the O(n) cost of repeatedly calling
  `Array.shift()`.
- BFS space is bounded by the tree's widest level (O(n) worst case), not
  its height like DFS.

Companion code: [`03-bfs-level-order.ts`](./03-bfs-level-order.ts)
