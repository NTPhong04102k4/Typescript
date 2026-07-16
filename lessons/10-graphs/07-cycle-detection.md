# Cycle Detection (Directed & Undirected)

**Objective:** Detect cycles in directed graphs via 3-color DFS and in undirected graphs via Union-Find, and use the same coloring idea to classify "safe" nodes in a directed graph.

## Concept

A cycle means a vertex can reach itself again by following edges. The
right detection technique differs by graph type, because an undirected
edge back to the vertex you just came from is *not* a cycle — you need to
tell "the edge back to my parent" apart from "an edge back to an ancestor
further up."

**Directed graphs** use 3-color DFS: `unvisited -> visiting -> done`.
A vertex is `visiting` while it's on the *current* recursion path.
Reaching an already-`visiting` vertex means the path looped back on
itself — a cycle:

```
0 -> 1 -> 2 -> 0   (cycle)

visit(0): state[0]=visiting
  visit(1): state[1]=visiting
    visit(2): state[2]=visiting
      visit(0): state[0] is already 'visiting' -> CYCLE
```

**Undirected graphs** use Union-Find instead: process each edge once
(skip the mirrored duplicate), and union its two endpoints. If the two
endpoints are *already* in the same set, this edge reconnects two
vertices that were already connected some other way — a cycle:

```
0-1, 1-2, 2-3, 3-0   (4-cycle)

union(0,1): merge {0,1}
union(1,2): merge {0,1,2}
union(2,3): merge {0,1,2,3}
union(3,0): 3 and 0 already in the same set -> CYCLE
```

## Complexity

| Operation                             | Time      | Space |
|-------------------------------------------|-----------|-------|
| `hasCycleDirected` (3-color DFS)           | O(V + E)  | O(V)  |
| `hasCycleUndirected` (Union-Find)           | O(V + E · α(V)) | O(V) |
| `eventualSafeNodes`                        | O(V + E)  | O(V)  |

## Walkthrough

[`07-cycle-detection.ts`](./07-cycle-detection.ts) imports `AdjacencyList`
from [`./01-graph-fundamentals.ts`](./01-graph-fundamentals.ts) and
`UnionFind` from [`./05-union-find.ts`](./05-union-find.ts) instead of
redefining either. `hasCycleDirected` mirrors the `state` array from
lesson 04's `topologicalSortDFS`: a vertex re-entered while still
`'visiting'` sets `cycleFound`, and every pending call unwinds without
marking anything `'done'`. `hasCycleUndirected` walks every vertex's
neighbor list but only processes an edge when `neighbor > vertex` — since
`addEdge` mirrors every undirected edge onto both endpoints, this avoids
both re-processing the same edge twice and mistaking "the edge back to
where I came from" for a cycle. The moment `uf.union(vertex, neighbor)`
returns `false`, the two endpoints were already connected through some
other path, so a cycle exists.

`eventualSafeNodes` reuses the exact 3-color idea from `hasCycleDirected`,
but recursively requires **every** neighbor to also be safe before
marking the current node `color = 2` (safe): `isSafe(node)` returns `false`
immediately if `node` is currently `color === 1` (an active cycle) or if
any neighbor's own `isSafe` call returns `false`. A terminal node (no
outgoing edges) is trivially safe since its neighbor loop never executes.

## LeetCode practice

- **802. Find Eventual Safe States** (Medium) — 3-color DFS where a node
  is safe only if every reachable path avoids cycles.

## Key takeaways

- Directed-graph cycle detection needs 3 states (not just visited/unvisited)
  because a vertex can be reachable without being on the *current* path —
  only `'visiting'` (on the current path) signals a real cycle.
- Undirected-graph cycle detection with Union-Find needs each edge
  processed exactly once; without the `neighbor > vertex` guard, the
  mirrored duplicate edge looks like a false cycle.
- `union` returning `false` is the same signal used in
  `findRedundantConnection` (lesson 05) — "these two vertices were
  already connected" is the definition of "this edge closes a cycle."
- "Safe node" (no path to a cycle) is a strictly stronger condition than
  "not directly on a cycle" — it also requires every downstream neighbor
  to be safe, which is why `eventualSafeNodes` needs a recursive `isSafe`,
  not just a single-pass cycle check.

Companion code: [`07-cycle-detection.ts`](./07-cycle-detection.ts)
