# Graph Fundamentals & Representations

**Objective:** Represent a graph as an adjacency list and an adjacency matrix, understand the tradeoffs between them, and use vertex degree to solve simple structural problems.

## Concept

A graph is a set of **vertices** (nodes) connected by **edges**. An edge can
be **directed** (`from -> to` only) or **undirected** (mirrored both ways).
Take these four directed edges: `0->1`, `0->2`, `1->2`, `2->3`:

```
   0
  / \
 v   v
 1-->2-->3
```

**Adjacency list** — vertex maps to the list of vertices it points to. This
is the representation `AdjacencyList` (`Map<number, number[]>`) uses
throughout the rest of this topic:

```
0: [1, 2]
1: [2]
2: [3]
3: []
```

**Adjacency matrix** — an `n x n` grid of 0/1, where `matrix[u][v] === 1`
means an edge `u -> v` exists. Same graph:

```
      to:  0  1  2  3
from 0:  [ 0, 1, 1, 0 ]
from 1:  [ 0, 0, 1, 0 ]
from 2:  [ 0, 0, 0, 1 ]
from 3:  [ 0, 0, 0, 0 ]
```

For an **undirected** graph, `addEdge` mirrors the edge onto both
endpoints, so `graph.get(0)` and `graph.get(1)` each list the other:
undirected `0-1` becomes `0: [1, ...]` and `1: [0, ...]`. The matrix
becomes symmetric (`matrix[u][v] === matrix[v][u]`) for the same reason.

## Complexity

Let `V` be the vertex count and `E` the edge count.

| Operation                                  | Adjacency list | Adjacency matrix |
|---------------------------------------------|----------------|-------------------|
| Build from an edge list                     | O(V + E)       | O(V^2)            |
| Check whether edge `(u, v)` exists           | O(degree(u))   | O(1)              |
| Iterate all neighbors of `v`                 | O(degree(v))   | O(V)              |
| Space                                       | O(V + E)       | O(V^2)            |
| `degreeOf(v)` (out-degree)                   | O(1)           | O(V)              |

Adjacency lists win whenever a graph is sparse (`E` much smaller than
`V^2`), which is the common case for the rest of this topic — that's why
`AdjacencyList` is the shared representation every later lesson reuses.
Adjacency matrices win when you need O(1) "is there an edge here" checks
and can afford O(V^2) space, or when the graph is dense.

## Walkthrough

[`01-graph-fundamentals.ts`](./01-graph-fundamentals.ts) builds the
toolkit bottom-up. `createEmptyGraph(vertexCount)` seeds a `Map` with an
empty array for every vertex `0..vertexCount-1` so lookups never need a
fallback for a valid vertex. `addEdge` pushes `to` onto `from`'s list, and
also pushes `from` onto `to`'s list when `directed` is `false`.
`buildAdjacencyList` folds an `Edge[]` list through `addEdge` starting from
an empty graph — this is exactly how the diagram above was produced, once
for `directed: true` and once for `directed: false`.

`buildAdjacencyMatrix` builds the same graph as a 2D 0/1 array directly
from the edge list, while `adjacencyListToMatrix` converts an
already-built `AdjacencyList` into the same shape without touching the
original edges — useful when you received a list but a downstream
algorithm wants O(1) edge lookups. `degreeOf` just reads `.length` on the
neighbor array — O(1) precisely because the list already stores exactly
the out-edges of that vertex.

Two small LeetCode problems show that some questions never need a full
graph structure, just a degree count: `findJudge` computes a net
trust score per person (`trustScore[b]++`, `trustScore[a]--` for every
`a` trusts `b`) and the judge is whoever nets exactly `n - 1` (trusted by
everyone, trusts nobody). `findCenter` exploits that in a star graph the
center appears in *every* edge, so the first two edges alone identify it
by whichever vertex they share.

## LeetCode practice

- **997. Find the Town Judge** (Easy) — degree counting without building
  an adjacency list at all.
- **1791. Find Center of Star Graph** (Easy) — the center vertex is the
  one shared by the first two edges.

## Key takeaways

- `AdjacencyList` (`Map<number, number[]>`) is the shared representation
  every later lesson in this topic imports and reuses.
- Directed vs. undirected is purely a matter of whether `addEdge` mirrors
  the edge onto both endpoints — the storage type doesn't change.
- Adjacency lists are the default: O(V + E) space and construction time,
  ideal for the sparse graphs typical of interview problems.
- Adjacency matrices trade O(V^2) space for O(1) edge-existence checks —
  worth it only for dense graphs or frequent existence queries.
- Some "graph" problems (judge, star center) reduce to counting degrees
  and never need a graph structure at all.

Companion code: [`01-graph-fundamentals.ts`](./01-graph-fundamentals.ts)
