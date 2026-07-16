# Minimum Spanning Tree (Kruskal / Prim Overview)

**Objective:** Connect every vertex of a weighted undirected graph with the least total edge weight, using Kruskal's greedy edge-sorting approach built on Union-Find.

## Concept

A **spanning tree** connects every vertex using exactly `V - 1` edges and
no cycles. A **minimum spanning tree (MST)** is the spanning tree whose
edges sum to the smallest possible total weight. There are two classic
greedy algorithms:

- **Kruskal's**: sort *all* edges by weight ascending, and greedily add
  each one unless it would create a cycle (i.e. unless its two endpoints
  are already connected). Natural fit for Union-Find, since "would this
  edge create a cycle" is exactly what `union` returning `false` means.
- **Prim's**: start from one vertex and grow a single connected tree,
  repeatedly adding the cheapest edge that connects the tree to a new
  vertex — the same "always take the cheapest available frontier edge"
  shape as Dijkstra, but tracking the *edge weight* to reach a vertex
  instead of the *cumulative path distance*.

Both produce a valid MST (there can be multiple MSTs when weights tie,
but the minimum total weight is unique). This lesson implements Kruskal's,
since it composes directly with the `UnionFind` already built in lesson 05.

```
Points: (0,0) (2,2) (3,10) (5,2) (7,0)
Candidate edges sorted by Manhattan distance (partial):
  (1,3)=3   (0,1)=4   (3,4)=4   (0,3)=7 ...   (1,2)=9 ...

Kruskal greedily accepts:
  (1,3) w3  -> components: {1,3}
  (0,1) w4  -> components: {0,1,3}
  (3,4) w4  -> components: {0,1,3,4}
  (0,3) w7  -> SKIP: 0 and 3 already connected
  (0,4) w7  -> SKIP: already connected
  (1,4) w7  -> SKIP: already connected
  (1,2) w9  -> components: {0,1,2,3,4}  (all connected, MST complete)

total weight = 3 + 4 + 4 + 9 = 20
```

## Complexity

| Operation                                        | Time              | Space |
|-------------------------------------------------------|--------------------|-------|
| `kruskalMST` (V vertices, E candidate edges)            | O(E log E + E · α(V)) | O(V + E) |
| `minCostConnectPoints` (n points, complete graph)        | O(n^2 log n)       | O(n^2) |

Sorting the edges dominates Kruskal's runtime; the Union-Find operations
are near-constant per edge. Prim's with a binary heap runs in
O(E log V), which is asymptotically similar but doesn't require sorting
every edge up front — a better fit when the graph is dense or edges
arrive incrementally, whereas Kruskal shines when edges are already
sorted or sparse.

## Walkthrough

[`08-minimum-spanning-tree.ts`](./08-minimum-spanning-tree.ts) imports
`UnionFind` from [`./05-union-find.ts`](./05-union-find.ts) rather than
reimplementing disjoint-set logic. `kruskalMST` sorts a copy of the input
edges ascending by weight, then walks them in order: `uf.union(edge.from, edge.to)`
both checks *and* performs the merge in one call — if it returns `true`,
the edge didn't create a cycle, so it's added to `mstEdges` and its
weight is accumulated; if it returns `false`, the edge is skipped. On a
disconnected graph, some vertices simply never get unioned together, so
the result is a **minimum spanning forest** with fewer than `V - 1` edges
rather than a single tree — `kruskalMST` doesn't need special-casing for
this, since a missing edge just means `uf.union` never succeeds for that
pair.

`minCostConnectPoints` builds the *complete* graph implied by a list of
2D points — every pair is a candidate edge, weighted by Manhattan
distance — and hands all `n * (n-1) / 2` edges to `kruskalMST`, returning
just the total weight.

## LeetCode practice

- **1584. Min Cost to Connect All Points** (Medium) — MST over the
  complete graph of Manhattan distances between points.

## Key takeaways

- Kruskal's algorithm is "sort edges, greedily keep the ones that don't
  create a cycle" — Union-Find's `union` returning `false` *is* the cycle
  check.
- Prim's algorithm grows one tree from a single start vertex, always
  picking the cheapest edge on the tree's frontier — conceptually close
  to Dijkstra, but keyed on edge weight rather than path distance.
- A disconnected graph doesn't break Kruskal's — it naturally produces a
  minimum spanning *forest* instead of a single spanning tree.
- "Connect all points at minimum cost" (1584) reduces to MST over the
  complete graph formed by every pairwise distance — no separate
  algorithm needed beyond building that edge list.

Companion code: [`08-minimum-spanning-tree.ts`](./08-minimum-spanning-tree.ts)
