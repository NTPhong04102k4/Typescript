# Shortest Path: Bellman-Ford (Negative Edges)

**Objective:** Compute single-source shortest distances in a graph that may contain **negative** edge weights, and detect when a reachable **negative-weight cycle** makes shortest paths undefined.

## Concept

Dijkstra (lesson 06) locks in the closest unvisited vertex and never
revisits it — an assumption a negative edge can break, because a later,
cheaper detour might reach an "already finalized" vertex. Bellman-Ford
makes no such assumption. Instead it **relaxes every edge, V-1 times**.

After the i-th full pass, every shortest path that uses at most `i` edges
is correct. A simple path in a graph of `V` vertices has at most `V-1`
edges, so `V-1` passes settle all of them. If a V-th pass can *still*
improve some distance, a negative-weight cycle is reachable from the
source (you can loop it forever to drive the distance to -Infinity).

```
Directed graph with a NEGATIVE edge (source = 0):

        4        -2
   0 ------> 1 ------> 2
   |                   ^
   +---------5---------+          2 --3--> 3

Relaxation trace (edges scanned each pass):
  init:   dist = [0, inf, inf, inf]
  pass 1: 0->1 sets dist[1]=4
          0->2 sets dist[2]=5
          1->2 improves dist[2]=4+(-2)=2   <-- negative edge wins
          2->3 sets dist[3]=2+3=5
          dist = [0, 4, 2, 5]
  pass 2: no edge relaxes -> early exit
  final:  dist = [0, 4, 2, 5]
```

Detecting a negative cycle is one extra pass: if any edge `(u, v, w)`
still satisfies `dist[u] + w < dist[v]`, flag it. When that flag is set,
the returned distances are meaningless and callers must check it first.

## Complexity

| Operation                          | Time      | Space |
|------------------------------------|-----------|-------|
| `bellmanFord` (V vertices, E edges) | O(V · E)  | O(V)  |
| `shortestPath` (path reconstruction) | O(V · E)  | O(V)  |
| `hasReachableNegativeCycle`         | O(V · E)  | O(V)  |
| `findCheapestPrice` (K+1 passes)    | O(K · E)  | O(V)  |

## Walkthrough

Like lesson 06, [`10-bellman-ford.ts`](./10-bellman-ford.ts) is
self-contained, but its edge model is even simpler: Bellman-Ford iterates
a **flat edge list**, so `buildWeightedEdgeList` returns a
`WeightedEdge[]` of `{ from, to, weight }` records rather than an
adjacency map. Undirected edges are mirrored with the same weight, exactly
like lesson 01's `addEdge`.

`bellmanFord` fills `dist` with `Infinity` (0 for the source), then runs
up to `V-1` relaxation passes. Each pass skips edges whose `from` is still
`Infinity` (you can't relax through an unreached vertex), and a pass that
changes nothing triggers an early exit. A final pass looks for any edge
that would *still* relax — proof of a reachable negative cycle — and sets
`hasNegativeCycle`.

`shortestPath` runs the same relaxation while recording a `prev[]`
predecessor for each improved vertex, then walks `prev` back from the
target to rebuild the route (empty array if unreachable).

`findCheapestPrice` (LeetCode 787) shows the "at most K stops" twist: it
runs exactly `K+1` passes, and each pass relaxes from a **snapshot copy**
of the previous distances so a single pass cannot chain two edges and
blow the stop budget.

## LeetCode practice

- **787. Cheapest Flights Within K Stops** (Medium) — bounded-hop
  Bellman-Ford: K+1 passes over a copied distance array so no pass exceeds
  the stop limit.

## Key takeaways

- Bellman-Ford handles negative edges that break Dijkstra's "closest
  vertex is final" invariant, at the cost of O(V·E) instead of
  O((V+E) log V).
- `V-1` passes suffice because a shortest simple path has at most `V-1`
  edges; a V-th pass that still relaxes proves a reachable negative cycle.
- A negative-weight *cycle* makes "shortest path" undefined — always check
  the negative-cycle flag before trusting the distances.
- Capping the number of passes turns Bellman-Ford into a bounded-hop
  shortest path (the key to "within K stops" problems).

Companion code: [`10-bellman-ford.ts`](./10-bellman-ford.ts)
