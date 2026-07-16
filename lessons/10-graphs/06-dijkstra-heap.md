# Shortest Path: Dijkstra with a Heap

**Objective:** Compute shortest distances from a single source in a non-negative-weight graph, using a min-heap to always expand the closest unvisited vertex next.

## Concept

Dijkstra's algorithm keeps a tentative distance for every vertex
(starting at `Infinity`, except `0` for the source), and repeatedly
"locks in" the closest not-yet-finalized vertex — once locked in, its
distance can never improve, because every other path to it would have to
go through a vertex that's already farther away.

```
Directed weighted graph (node 2 is the source):

  1 --1--> 2 --1--> 3 --1--> 4

Relaxation trace from node 2:
  dist = [inf, 0, inf, inf]     heap = [(2,0)]
  pop (2,0): relax 1 (dist 1), relax 3 (dist 1)
  dist = [1, 0, 1, inf]          heap = [(1,1), (3,1)]
  pop (1,1): node 1 has no outgoing edges
  pop (3,1): relax 4 (dist 2)
  dist = [1, 0, 1, 2]            heap = [(4,2)]
  pop (4,2): node 4 has no outgoing edges
  final: dist = [1, 0, 1, 2]  (order: node1, node2, node3, node4)
```

A plain array scan for "closest unvisited vertex" costs O(V) per step, so
O(V^2) overall. A min-heap keyed on tentative distance turns that lookup
into O(log V): push a `[vertex, distance]` pair every time a shorter
distance is found, and always pop the smallest. Stale heap entries (a
vertex pushed more than once, at different distances) are simply skipped
via a `visited` array when popped — the first pop of any vertex is
guaranteed to be its true shortest distance.

## Complexity

| Operation                       | Time              | Space |
|-------------------------------------|--------------------|-------|
| `dijkstra` (V vertices, E edges)     | O((V + E) log V)   | O(V + E) |
| `networkDelayTime`                   | O((V + E) log V)   | O(V + E) |
| `hasPathWithinBudget`                | O((V + E) log V)   | O(V + E) |

## Walkthrough

Unlike the rest of this topic, [`06-dijkstra-heap.ts`](./06-dijkstra-heap.ts)
is fully self-contained: it defines its own private `MinHeap<T>` and a
`WeightedAdjacencyList` type instead of importing `AdjacencyList` from
lesson 01 (which has no room for edge weights) or a heap from the
06-heap-priority-queue topic (a different topic's file). `buildWeightedAdjacencyList`
takes `[from, to, weight]` triples and builds a `Map<number, WeightedEdge[]>`,
mirroring the edge for undirected graphs exactly like lesson 01's `addEdge` does.

`dijkstra` seeds the heap with `[source, 0]`, then loops: pop the smallest
`[vertex, distance]` pair, skip it if already `visited` (a stale, larger
duplicate), otherwise mark it visited and try to **relax** every outgoing
edge — if going through `u` gives a shorter distance to a neighbor than
what's currently recorded, update `dist[to]` and push the improved pair
onto the heap. Because the heap always yields the globally smallest
pending distance next, the first time any vertex is popped and not
already visited, that popped distance is final.

`networkDelayTime` re-indexes the 1-indexed `times` triples to 0-indexed,
builds a directed weighted graph, runs `dijkstra` from the source, and
returns the *maximum* distance across all nodes (how long until the
slowest node hears the signal) — or `-1` if any node's distance is still
`Infinity` (unreachable).

## LeetCode practice

- **743. Network Delay Time** (Medium) — Dijkstra from a single source;
  answer is the max finite distance, or -1 if any node is unreachable.

## Key takeaways

- Dijkstra only works correctly with non-negative edge weights — a
  negative edge could invalidate the "closest unvisited vertex is final"
  assumption the whole algorithm relies on.
- A min-heap keyed on tentative distance turns "find the closest
  unvisited vertex" from O(V) into O(log V), which is the entire point of
  pairing Dijkstra with a heap.
- Stale heap entries (a vertex pushed multiple times at different
  distances) are handled by simply skipping a popped vertex that's
  already `visited` — no need to remove or update entries in place.
- "How long until everyone hears the signal" (network delay) is just
  "what's the maximum shortest-path distance from the source."

Companion code: [`06-dijkstra-heap.ts`](./06-dijkstra-heap.ts)
