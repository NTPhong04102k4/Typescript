# Union-Find (Disjoint Set)

**Objective:** Track a dynamic partition of elements into disjoint sets — union two sets, find which set an element belongs to, and detect when an edge would reconnect two already-connected elements — in near-constant time per operation.

## Concept

Union-Find (a.k.a. Disjoint Set Union) maintains a forest where each tree
is one set, and every node points toward its parent until reaching a
**root**, which represents the whole set. `find(x)` walks up to the root;
`union(a, b)` links one root under the other.

```
Before any unions:      union(0,1)          union(1,2)         union(3,4)
0  1  2  3  4            0<-1  2  3  4        0<-1<-2  3  4       0<-1<-2  3<-4
(each its own root)      roots: 0, 2, 3, 4     roots: 0, 3, 4      roots: 0, 3

find(2) after union(1,2): walk 2 -> 1 -> 0, root is 0. Path compression then
rewrites 2's parent directly to 0, so the *next* find(2) is a single hop.
```

`union(a, b)` first calls `find` on both; if the roots already match, the
edge is **redundant** — `a` and `b` were already connected, so no merge
happens and `union` returns `false`. This is the key trick behind
`findRedundantConnection` below: process edges in order, and the first
one where `union` returns `false` is exactly the edge that closes a cycle.

Two optimizations keep trees shallow:
- **Path compression** (in `find`): every node visited on the way to the
  root gets repointed straight at the root.
- **Union by rank** (in `union`): the shorter tree is always attached
  under the taller one's root, never the reverse.

Together they make `find` and `union` run in amortized time so close to
O(1) that it's conventionally written O(α(n)) (inverse Ackermann,
effectively constant for any input size that fits in memory).

## Complexity

| Operation                          | Time (amortized) | Space |
|---------------------------------------|-------------------|-------|
| `find`                                 | O(α(n))           | O(1)  |
| `union`                                | O(α(n))           | O(1)  |
| `connected`                            | O(α(n))           | O(1)  |
| `countComponents` (E edges)             | O(E · α(n))       | O(n)  |
| `findRedundantConnection` (E edges)     | O(E · α(n))       | O(n)  |

## Walkthrough

[`05-union-find.ts`](./05-union-find.ts) exports `UnionFind`, the class
lessons 07 (cycle detection) and 08 (minimum spanning tree) both import
directly rather than reimplementing. `find(x)` recurses toward the root
and, on the way back out of the recursion, rewrites `this.parent[x]` to
point straight at the root — that's path compression in one line.
`union(a, b)` compares `this.rank[rootA]` and `this.rank[rootB]` (rank is
an upper bound on tree height) to decide which root to attach under the
other; only when they're tied does the winning root's rank increase.
`componentCount` starts at `size` and decrements once per successful
merge, so `.count` is always the current number of disjoint sets —
`areAllConnected` just checks whether that count has reached 1.

`countComponents` unions every edge's two endpoints and returns
`uf.count` — whatever sets remain unmerged are the connected components.
`findRedundantConnection` processes edges (which describe a tree plus one
extra edge) in order and returns the first pair whose `union` call
returns `false`, since by construction it's `union` failing — not a
separate cycle check — that identifies the redundant edge.

## LeetCode practice

- **323. Number of Connected Components in an Undirected Graph** (Medium)
  — union every edge, count remaining sets.
- **684. Redundant Connection** (Medium) — the first edge whose `union`
  call fails is the one closing the cycle.

## Key takeaways

- A disjoint set is a forest of trees, one tree per set, where `find`
  walks up to a root that identifies the whole set.
- `union` returning `false` means "these two elements were already
  connected" — that single fact powers both cycle detection and
  redundant-edge detection.
- Path compression + union by rank together are what make Union-Find
  practically constant-time; either alone is only logarithmic.
- `UnionFind` is exported here specifically so later lessons (cycle
  detection, minimum spanning tree) can import and reuse it instead of
  rebuilding disjoint-set logic from scratch.

Companion code: [`05-union-find.ts`](./05-union-find.ts)
