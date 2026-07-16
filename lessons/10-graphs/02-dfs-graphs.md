# DFS on Graphs

**Objective:** Traverse a graph depth-first (recursively and iteratively), use it to count connected components, and apply the same idea to grid flood-fill and cyclic-graph cloning problems.

## Concept

Depth-first search picks a neighbor, dives all the way down that branch
before backtracking, and marks vertices visited so cycles don't cause
infinite loops. On this undirected graph:

```
      0
     / \
    1   2
    |    \
    3     4
           \
            5
```

DFS from `0` (visiting neighbors in the order they appear in the adjacency
list) goes: `0 -> 1 -> 3` (dead end, backtrack to `0`) `-> 2 -> 4 -> 5`,
giving visit order `[0, 1, 3, 2, 4, 5]`.

The same idea works on a grid by treating each cell as a vertex connected
to its up/down/left/right neighbors — "flood fill" is DFS starting from
one cell:

```
Grid (1 = land, 0 = water):      Flood-fill from (0,0) marks
1 1 0 0                          an entire island visited in
1 1 0 0        --DFS-->          one DFS call; the next
0 0 1 0                          unvisited '1' starts a new
0 0 0 1                          island.
```

## Complexity

| Operation                                | Time      | Space (incl. call stack) |
|---------------------------------------------|-----------|---------------------------|
| `dfsRecursive` / `dfsIterative`              | O(V + E)  | O(V)                      |
| `connectedComponentsCount`                   | O(V + E)  | O(V)                      |
| `numIslands` / `maxAreaOfIsland` (r x c grid) | O(r * c)  | O(r * c)                  |
| `cloneGraph` (V vertices, E edges)           | O(V + E)  | O(V)                      |

## Walkthrough

[`02-dfs-graphs.ts`](./02-dfs-graphs.ts) imports `AdjacencyList` from
[`./01-graph-fundamentals.ts`](./01-graph-fundamentals.ts) rather than
redefining it. `dfsRecursive` uses an inner `visit` closure and a
`visited` set so revisiting an already-seen vertex is a no-op — this is
what keeps DFS correct on graphs with cycles, unlike tree traversals.
`dfsIterative` reimplements the same traversal with an explicit stack;
neighbors are pushed in *reverse* order so that popping (which takes the
*last* pushed element) still processes the first neighbor first — on the
sample graph above both functions produce the identical order
`[0, 1, 3, 2, 4, 5]`. `connectedComponentsCount` restarts a DFS flood-fill
from every still-unvisited vertex, counting how many restarts it takes;
an isolated vertex with no edges counts as its own component.

`numIslands` and `maxAreaOfIsland` apply the exact same flood-fill
pattern to a 2D grid instead of an `AdjacencyList`: `numIslands` just
counts how many times a fresh `'1'` cell triggers a flood-fill, while
`maxAreaOfIsland` has the flood-fill return the number of cells it
touched, taking the max across all islands. `cloneGraph` runs DFS on a
graph made of `GraphNode` objects (val + neighbor references, not
`AdjacencyList`) and uses a `Map<GraphNode, GraphNode>` from original to
clone — the same "mark visited" idea as `visited: Set<number>`, except
the map also *doubles as the answer*, since looking up an already-cloned
node returns its clone instead of creating a duplicate.

## LeetCode practice

- **200. Number of Islands** (Medium) — flood-fill count on a character
  grid.
- **695. Max Area of Island** (Medium) — flood-fill returning cell count,
  keep the max.
- **133. Clone Graph** (Medium) — DFS with a node-to-clone map to survive
  cycles.

## Key takeaways

- DFS needs a `visited` marker to terminate correctly on any graph with a
  cycle — trees don't need this because there's only one path to any node.
- Recursive and iterative DFS visit the same vertices; matching their
  *order* exactly just requires pushing neighbors onto an explicit stack
  in reverse.
- "Count connected components" is "how many times do I have to restart
  DFS from an unvisited vertex."
- Grid flood-fill (`numIslands`, `maxAreaOfIsland`) is DFS where the graph
  is implicit: neighbors are computed from row/col offsets instead of an
  adjacency list.
- For graphs built from object references (`cloneGraph`), a
  `Map<Node, Node>` both prevents infinite recursion on cycles and stores
  the answer at the same time.

Companion code: [`02-dfs-graphs.ts`](./02-dfs-graphs.ts)
