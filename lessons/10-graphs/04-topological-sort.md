# Topological Sort

**Objective:** Order the vertices of a directed acyclic graph (DAG) so every edge points from an earlier vertex to a later one, using both Kahn's (BFS/in-degree) and DFS-postorder algorithms, and detect when no such order exists.

## Concept

A topological order only makes sense for a **directed acyclic graph**
(DAG) — if there's a cycle, no ordering can satisfy every edge, since
some vertex would need to come before itself. Diamond-shaped DAG:

```
     0
    / \
   1   2
    \ /
     3

edges: 0->1, 0->2, 1->3, 2->3
in-degree: 0:0  1:1  2:1  3:2
```

**Kahn's algorithm** repeatedly removes a vertex whose in-degree is 0
(nothing left points to it), then decrements the in-degree of everything
it pointed to:

```
queue=[0]                 process 0 -> order=[0]
  decrement 1 (1->0), 2 (1->0): both hit 0, queue=[1,2]
process 1 -> order=[0,1]
  decrement 3 (2->1): not yet 0
process 2 -> order=[0,1,2]
  decrement 3 (1->0): queue=[3]
process 3 -> order=[0,1,2,3]
```

**DFS-postorder** instead does a full DFS from every vertex, appending a
vertex to a list only *after* all of its descendants have been fully
explored, then reverses that list — a vertex can't be "done" before
everything reachable from it is done, so reversing gives a valid order
(a different valid order than Kahn's, since DFS explores depth-first
instead of by in-degree).

## Complexity

| Operation                       | Time      | Space |
|-------------------------------------|-----------|-------|
| `topologicalSortKahn`                | O(V + E)  | O(V)  |
| `topologicalSortDFS`                 | O(V + E)  | O(V)  |
| `isValidTopologicalOrder`             | O(V + E)  | O(V)  |

## Walkthrough

[`04-topological-sort.ts`](./04-topological-sort.ts) imports
`AdjacencyList`, `createEmptyGraph`, and `addEdge` from
[`./01-graph-fundamentals.ts`](./01-graph-fundamentals.ts) instead of
redefining graph construction. `topologicalSortKahn` first computes every
vertex's in-degree by scanning all adjacency lists, seeds a queue with the
in-degree-0 vertices, then processes the queue FIFO-style: each processed
vertex decrements its neighbors' in-degree, and any neighbor that drops to
0 joins the queue. If the final `order` doesn't include every vertex,
some vertices were stuck in a cycle (their in-degree never hit 0), so the
function returns `null`.

`topologicalSortDFS` tracks each vertex's `state` as `'unvisited'`,
`'visiting'` (currently on the recursion stack), or `'done'`. Encountering
a `'visiting'` vertex again means the current DFS path looped back on
itself — a cycle — so `hasCycle` is set and every pending call unwinds
without touching `postorder`. On the diamond DAG, DFS visits `0 -> 1 -> 3`
(mark done, push 3), backtrack to `1` (done, push 1), backtrack to `0`,
then `0 -> 2 -> 3` (already done, skip), mark `2` done (push 2), mark `0`
done (push 0) — postorder `[3, 1, 2, 0]`, reversed to `[0, 2, 1, 3]`, a
different but equally valid order from Kahn's `[0, 1, 2, 3]`.
`isValidTopologicalOrder` is the general-purpose checker used to confirm
both: it records each vertex's position in the candidate order, then
verifies every edge `u -> v` has `position[u] < position[v]`.

`canFinish` and `findOrder` both convert a `prerequisites` list into a
directed graph (`prereq -> course`) and delegate to
`topologicalSortKahn` — `canFinish` just checks the result isn't `null`,
while `findOrder` returns the order itself (or `[]` if none exists).

## LeetCode practice

- **207. Course Schedule** (Medium) — can all courses finish, i.e. is the
  prerequisite graph acyclic.
- **210. Course Schedule II** (Medium) — return a valid course order, or
  `[]` if impossible.

## Key takeaways

- A topological order only exists for a DAG; a cycle makes it impossible,
  and both algorithms detect that (`null` return).
- Kahn's algorithm processes vertices in in-degree-zero order (BFS-like);
  DFS-postorder processes them in "finished last, appears first" order —
  different algorithms, both produce *a* valid order, not *the* order.
- `prerequisites: [course, prereq]` reads naturally as an edge
  `prereq -> course` — build the graph that way, not backwards.
- Validating a topological order is just checking that every edge's
  source comes before its destination in the candidate list.

Companion code: [`04-topological-sort.ts`](./04-topological-sort.ts)
