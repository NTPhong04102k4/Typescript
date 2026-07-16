# LeetCode Practice Set: Graphs

**Objective:** Apply the traversal, Union-Find, and coloring techniques from this topic to a spread of real graph interview problems, Easy through Hard.

## Concept

This lesson doesn't introduce a new algorithm — it's a practice set that
mixes techniques from every earlier lesson to solve seven problems, none
of which were used in lessons 01-08:

```
1971 Find if Path Exists       -- Union-Find (lesson 05)
 547 Number of Provinces       -- Union-Find over an adjacency matrix
1319 Make Network Connected    -- Union-Find, extra-cable counting
 785 Is Graph Bipartite?       -- BFS 2-coloring (lesson 03's BFS shape)
 399 Evaluate Division         -- weighted graph + BFS product-of-weights
 990 Equality Equations        -- Union-Find, two-pass (equalities, then conflicts)
1192 Critical Connections      -- Tarjan's bridge-finding (DFS low-link, an
                                    extension of lesson 07's cycle-detection DFS)
```

`990`'s two-pass structure is worth calling out on its own, since it's a
common Union-Find pattern: process every "must be equal" constraint
*first* (order doesn't matter, since union is commutative), and only
*then* check every "must be different" constraint against the resulting
sets. Checking them interleaved would give wrong answers depending on
statement order — for example `a==b`, `c==a`, `b!=c` requires knowing
that `a`, `b`, and `c` are *all* unioned together before evaluating
`b!=c`, even though the union that connects `b` to `c` (via `a`) happens
in a later statement.

`1192`'s bridge-finding extends the DFS-with-state idea from lesson 07:
instead of just tracking `visited`, it tracks each vertex's `discovery`
time and a `low` value — the earliest discovery time reachable from that
vertex's subtree via any back-edge. An edge `(u, v)` is a **bridge**
(critical connection) exactly when `low[v] > discovery[u]`: nothing in
`v`'s subtree can reach back to `u` or anything before it, so removing
`(u, v)` would strand that subtree.

```
0 --- 1 --- 3        Triangle 0-1-2 has two paths between any pair,
|     |               so none of its edges are bridges. Edge 1-3 is
2-----+               the only way to reach node 3 -- removing it
                       disconnects the graph, so it's the one bridge.
```

## Complexity

| Problem                                      | Time              | Space |
|---------------------------------------------------|--------------------|-------|
| 1971. Find if Path Exists in Graph                  | O(E · α(V))        | O(V)  |
| 547. Number of Provinces (n x n matrix)             | O(n^2 · α(n))       | O(n)  |
| 1319. Number of Operations to Make Network Connected | O(E · α(V))        | O(V)  |
| 785. Is Graph Bipartite?                            | O(V + E)           | O(V)  |
| 399. Evaluate Division                              | O(Q · (V + E))      | O(V + E) |
| 990. Satisfiability of Equality Equations            | O(E · α(26))        | O(26) |
| 1192. Critical Connections in a Network              | O(V + E)           | O(V + E) |

## Walkthrough

[`09-leetcode-practice.ts`](./09-leetcode-practice.ts) imports `UnionFind`
from [`./05-union-find.ts`](./05-union-find.ts) for every problem that
reduces to "are these two things connected" (`validPath`, `findCircleNum`,
`makeConnected`, `equationsPossible`). `makeConnected` first rejects
inputs with fewer than `n - 1` cables (provably too few to ever connect
`n` computers), then reports `uf.count - 1` — the number of extra cables
needed is always one less than the number of disjoint components, since
each cable moved from a redundant spot can merge exactly two components.

`isBipartite` reuses the BFS traversal shape from lesson 03, but instead
of recording visit order or distance, it assigns alternating colors
(`1` / `-1`) level by level; finding a neighbor already colored the *same*
as the current vertex means an odd-length cycle exists, which is
incompatible with any 2-coloring. `calcEquation` builds a weighted graph
where `a / b = value` becomes edges `a -> b` (weight `value`) and
`b -> a` (weight `1/value`), then answers each query with a BFS that
multiplies edge weights along the path from the query's start to its end
— an unknown variable or an unreachable pair both report `-1.0`.

## LeetCode practice

- **1971. Find if Path Exists in Graph** (Easy)
- **547. Number of Provinces** (Medium)
- **1319. Number of Operations to Make Network Connected** (Medium)
- **785. Is Graph Bipartite?** (Medium)
- **399. Evaluate Division** (Medium)
- **990. Satisfiability of Equality Equations** (Medium)
- **1192. Critical Connections in a Network** (Hard)

## Key takeaways

- A large fraction of "graph" interview problems reduce to Union-Find
  connectivity queries — recognizing that pattern often beats writing a
  fresh traversal.
- Two-pass Union-Find (all equalities first, then check conflicts) is the
  standard way to handle "must be equal" vs. "must be different"
  constraints correctly regardless of input order.
- BFS/DFS coloring generalizes beyond "visited or not" — 2-coloring
  (bipartiteness) and discovery/low-link values (bridges) are both built
  by attaching more state to the same traversal shape used since lesson 02.
- Weighted "graph" problems aren't always about distance — `calcEquation`
  uses edge weights as multiplicative ratios, and the "shortest path"
  algorithm becomes "the path's product," found the same BFS way.

Companion code: [`09-leetcode-practice.ts`](./09-leetcode-practice.ts)
