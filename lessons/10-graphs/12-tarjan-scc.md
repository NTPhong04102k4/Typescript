# Strongly Connected Components: Tarjan's Algorithm

**Objective:** Find every **strongly connected component** (SCC) of a directed graph — maximal sets of mutually reachable vertices — in a single DFS pass, using discovery indices, `lowlink` values, and an explicit stack.

## Concept

In a directed graph, vertices `u` and `v` are in the same SCC when `u`
can reach `v` **and** `v` can reach `u`. Tarjan's algorithm discovers all
SCCs during one depth-first search by tracking two numbers per vertex:

- `index[v]` — the order `v` was first visited (its discovery time).
- `lowlink[v]` — the smallest `index` reachable from `v`'s DFS subtree,
  following tree edges plus at most one edge back into a vertex still on
  the stack.

Every visited vertex is pushed onto a stack. When a vertex `v` finishes
its DFS with `lowlink[v] === index[v]`, it is the **root** of an SCC:
everything above `v` on the stack (down to and including `v`) forms that
component and is popped off.

```
Directed graph:
   0 -> 1 -> 2 -> 0      (cycle {0,1,2})
             2 -> 3
   3 -> 4 -> 5 -> 3      (cycle {3,4,5})
             5 -> 6      (sink {6})

DFS tree (index in parens, back-edges marked ==>):
   0 (0)
   |
   1 (1)
   |
   2 (2) ==> 0            back-edge pulls lowlink[2]=0
   |
   3 (3)
   |
   4 (4)
   |
   5 (5) ==> 3            back-edge pulls lowlink[5]=3
   |
   6 (6)                  lowlink[6]=6 == index[6] -> pop {6}

Roots (lowlink == index): 3 closes {3,4,5}; 0 closes {0,1,2}.
SCCs emitted (pop order): [6], [3,4,5], [0,1,2]
```

The components come out in **reverse topological order** of the
condensation graph (each SCC collapsed to a single node), which is often
exactly what downstream algorithms want.

## Complexity

| Operation                     | Time       | Space   |
|-------------------------------|------------|---------|
| `tarjanSCC` (V vert, E edges) | O(V + E)   | O(V)    |
| `countSCCs`                   | O(V + E)   | O(V)    |
| `isStronglyConnected`         | O(V + E)   | O(V)    |
| `criticalConnections` (bridges) | O(V + E) | O(V)    |

## Walkthrough

Tarjan operates on an **unweighted** directed graph, so
[`12-tarjan-scc.ts`](./12-tarjan-scc.ts) reuses lesson 01's
`AdjacencyList` and `buildAdjacencyList` directly; `buildDirectedGraph`
is a thin wrapper that reads `[from, to]` tuples.

`tarjanSCC` runs a recursive `strongConnect`. On entry a vertex gets its
`index` and `lowlink` set to the current counter and is pushed on the
stack (`onStack[v] = true`). For each neighbor `w`: an unvisited `w` is a
tree edge — recurse, then `lowlink[v] = min(lowlink[v], lowlink[w])`; a
`w` still `onStack` is a back/cross edge inside the current component —
`lowlink[v] = min(lowlink[v], index[w])`; a `w` already assigned to a
finished SCC is ignored. When `lowlink[v] === index[v]`, the stack is
unwound down to `v` to emit the component.

`countSCCs` and `isStronglyConnected` are one-liners over `tarjanSCC`
(the whole graph is one SCC exactly when there is a single component).

`criticalConnections` (LeetCode 1192) reuses the **same lowlink
machinery** on an undirected graph to find bridges: with `disc`/`low`
arrays, an edge `(u, w)` is a bridge exactly when `low[w] > disc[u]` —
nothing in `w`'s subtree can reach `u` or earlier without that edge.

## LeetCode practice

- **1192. Critical Connections in a Network** (Hard) — the undirected
  cousin of Tarjan's SCC: same discovery-index / lowlink DFS, but
  emitting bridges (`low[w] > disc[u]`) instead of components.

## Key takeaways

- `lowlink[v]` — the earliest vertex reachable from `v`'s subtree — is the
  heart of the algorithm; a vertex with `lowlink == index` roots an SCC.
- The explicit stack lets a single DFS both discover components and know
  exactly which vertices belong to each one.
- Only edges to vertices still `onStack` update `lowlink`; edges into
  already-finished SCCs are ignored, which keeps components maximal.
- SCCs are emitted in reverse topological order of the condensation graph
  — handy for 2-SAT and other DAG-of-components processing.

Companion code: [`12-tarjan-scc.ts`](./12-tarjan-scc.ts)
