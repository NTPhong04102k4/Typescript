# BFS on Graphs

**Objective:** Traverse a graph breadth-first with a FIFO queue, use it to compute fewest-edges distances, and apply the same level-by-level idea to grid shortest paths and multi-source spreading problems.

## Concept

Breadth-first search explores level by level: everything one edge away
from the start, then everything two edges away, and so on. That ordering
guarantees the first time BFS reaches a vertex, it did so via the fewest
possible edges — which is exactly what makes BFS the tool for unweighted
shortest-path problems.

```
      0                      distance from 0:
     / \                       0 -> 0
    1   2                      1 -> 1, 2 -> 1
    |    \                     3 -> 2, 4 -> 2
    3     4                    5 -> 3
           \
            5

BFS visit order: 0, 1, 2, 3, 4, 5
                  ^  ^--^  ^-----^
               dist0  dist1  dist2  (5 is dist 3)
```

The same level-by-level spread models grids too. **Rotting oranges** is
BFS from *multiple sources at once* — every already-rotten cell starts in
the queue simultaneously, and each BFS level is one minute:

```
minute 0:  2 1 1        minute 1:  2 2 1        minute 4: all fresh
           1 1 0                   2 2 0        oranges rotted
           0 1 1                   0 1 1
```

## Complexity

| Operation                                       | Time      | Space |
|----------------------------------------------------|-----------|-------|
| `bfsTraversalOrder` / `shortestHopsFrom`             | O(V + E)  | O(V)  |
| `shortestPathBinaryMatrix` (n x n grid)              | O(n^2)    | O(n^2)|
| `orangesRotting` (r x c grid)                        | O(r * c)  | O(r * c) |
| `wordLadderLength` (N words of length L)             | O(N * L * 26) | O(N) |

## Walkthrough

[`03-bfs-graphs.ts`](./03-bfs-graphs.ts) imports `AdjacencyList` from
[`./01-graph-fundamentals.ts`](./01-graph-fundamentals.ts). `bfsTraversalOrder`
uses an array as a FIFO queue with a `head` index instead of `Array.shift()`
(shifting is O(n) per call; advancing an index is O(1)). `shortestHopsFrom`
is the same loop, but instead of just recording visit order it records
each vertex's distance as `currentDistance + 1` the first (and only) time
it's discovered — because BFS visits in non-decreasing distance order,
that first discovery is guaranteed to be the shortest.

`shortestPathBinaryMatrix` runs the identical BFS shape on a grid, with
"neighbors" computed as the 8 surrounding cells instead of an adjacency
list, and distance tracked per queue entry instead of a side map.
`orangesRotting` seeds the queue with *every* initially-rotten cell
instead of one start vertex — that's "multi-source BFS": each level of
the search still expands by exactly one edge (one grid step), so
processing one full level is exactly one minute of rot spreading.

`wordLadderLength` treats the word list as an implicit graph where two
words are adjacent if they differ in exactly one letter; rather than
precomputing that adjacency list (expensive for long words), it generates
all 25 single-letter variants of the current word on the fly and checks
membership in the word set. The moment `endWord` is popped off the queue,
its recorded step count is returned as the shortest ladder length.

## LeetCode practice

- **1091. Shortest Path in Binary Matrix** (Medium) — 8-directional grid
  BFS.
- **994. Rotting Oranges** (Medium) — multi-source BFS, one minute per
  level.
- **127. Word Ladder** (Hard) — BFS over an implicit one-letter-swap
  graph.

## Key takeaways

- BFS visits vertices in non-decreasing distance from the start — the
  first time a vertex is reached is always via the fewest edges.
- An array with a `head` pointer is a more efficient FIFO queue in
  JavaScript/TypeScript than repeated `Array.shift()`.
- "Multi-source BFS" just means seeding the queue with more than one
  starting vertex before the loop begins; the level-by-level mechanics
  don't change.
- Grid problems (`shortestPathBinaryMatrix`, `orangesRotting`) are BFS
  where neighbors are computed from coordinate offsets instead of stored
  in a `Map`.
- When neighbors are expensive to precompute (e.g. `wordLadderLength`),
  generate them on the fly inside the BFS loop instead of building the
  whole graph up front.

Companion code: [`03-bfs-graphs.ts`](./03-bfs-graphs.ts)
