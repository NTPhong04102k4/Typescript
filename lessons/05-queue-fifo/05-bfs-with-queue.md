# BFS Using a Queue

**Objective:** Use a FIFO queue to explore a graph or tree one "ring" at a time, guaranteeing shortest paths in unweighted structures and level-by-level processing.

## Concept

Breadth-first search visits nodes in order of increasing distance from a
start point. A queue is exactly what makes this work: every node
discovered at distance `d` is enqueued before any node at distance `d+1`
is even looked at, so the queue naturally drains in distance order.

```
Frontier expansion from start node A (unweighted graph):

ring 0:        (A)                     queue: [A]
                |
ring 1:    (B) (C) (D)                 queue: [B, C, D]      <- all at distance 1
                |
ring 2:  (E) (F)   (G)                 queue: [E, F, G]      <- all at distance 2

Each ring is fully enqueued before its neighbors (the next ring) are
explored, because the queue processes strictly in the order nodes were
discovered (FIFO). The first time a target node is dequeued/reached, the
path that reached it used the minimum number of edges.
```

For trees, the same idea becomes **level-order traversal**: snapshot
`queue.size` at the start of each iteration of the outer loop — that
snapshot is exactly the number of nodes in the current level, so peeling
off that many dequeues (and enqueuing their children as you go) processes
one whole level without mixing it with the next.

Multi-source BFS starts with more than one node already in the queue
(e.g. every rotten orange at minute 0) — the same level-by-level draining
still measures "minutes elapsed" as ring number, it's just seeded with
multiple starting points instead of one.

## Complexity

| Operation                                    | Time     | Space |
|-----------------------------------------------|----------|-------|
| `bfsShortestPath` (graph BFS)                  | O(V + E) | O(V)  |
| `levelOrder` / `rightSideView` / `minDepth`     | O(n)     | O(n)  |
| `orangesRotting` (grid BFS)                     | O(rows · cols) | O(rows · cols) |

Every node/cell is enqueued and dequeued at most once, so BFS is linear in
the size of the graph, tree, or grid — the queue guarantees each node is
processed exactly once, in distance order.

## Walkthrough

`05-bfs-with-queue.ts` imports `LinkedListQueue` from lesson 02 and uses it
as the frontier for every function.

`bfsShortestPath` runs BFS over a `Map<string, string[]>` adjacency graph,
enqueuing whole paths (arrays of node names) rather than single nodes. The
first path that reaches `target` is returned immediately, which is
guaranteed to be shortest because BFS explores strictly in order of path
length.

`levelOrder` (LeetCode 102) and `rightSideView` (LeetCode 199) both snapshot
`queue.size` as `levelSize` at the top of the outer loop, then dequeue
exactly `levelSize` nodes in the inner `for` loop, pushing each node's
children as they're dequeued. `levelOrder` collects every value in the
level; `rightSideView` keeps only the value at `i === levelSize - 1` (the
last node processed in that level), which is always the rightmost node.

`orangesRotting` (LeetCode 994) seeds the queue with every initially rotten
orange (`grid[r][c] === 2`) as a level-0 source — a **multi-source** BFS.
Each pass of the outer `while` loop processes one full ring of rotten
oranges and infects their fresh (`=== 1`) neighbors, decrementing
`freshCount` and incrementing `minutes` once per ring. If `freshCount`
never reaches 0, some oranges were unreachable and the function returns
`-1`.

`minDepth` is an exercise solving LeetCode 111: it enqueues `[node, depth]`
pairs and returns the depth of the **first** leaf dequeued — because BFS
visits shallower nodes first, that first leaf is guaranteed to be at the
minimum depth.

## LeetCode practice

- 102. Binary Tree Level Order Traversal (Medium)
- 199. Binary Tree Right Side View (Medium)
- 111. Minimum Depth of Binary Tree (Easy)
- 994. Rotting Oranges (Medium)

## Key takeaways

- FIFO order is what makes a queue-based BFS process nodes in strictly
  non-decreasing distance from the source(s).
- Snapshotting `queue.size` before an inner loop is the standard trick for
  separating "this level" from "the next level" without a second queue.
- Multi-source BFS is just regular BFS seeded with more than one starting
  node — every seed is treated as ring 0.
- The first time BFS reaches a target (whether a graph node or a tree
  leaf), it did so via a shortest/minimum-depth path — later arrivals at
  the same node can only be equal or longer.

Companion code: [`05-bfs-with-queue.ts`](./05-bfs-with-queue.ts)
