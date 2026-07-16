# All-Pairs Shortest Path: Floyd-Warshall

**Objective:** Compute the shortest distance between **every pair** of vertices with a single dynamic-programming sweep over candidate intermediate vertices — and detect negative cycles along the way.

## Concept

Where Dijkstra and Bellman-Ford answer "shortest paths from **one**
source," Floyd-Warshall answers "shortest paths between **all** pairs."
It builds a `V x V` distance matrix and refines it with one idea:

> For each vertex `k`, ask of every pair `(i, j)`: is the path
> `i -> k -> j` shorter than the best `i -> j` I already know?

Processing `k = 0, 1, ..., V-1` means that after step `k`, `dist[i][j]`
is the shortest path using only intermediate vertices drawn from
`{0..k}`. After the last `k`, every intermediate vertex is allowed, so
the matrix holds true all-pairs shortest paths.

```
Directed graph:
   0 --3--> 1 --1--> 2 --2--> 3
   0 --------8-------> 2

Initial matrix (Infinity = 'inf', dist[i][i] = 0):
        0   1   2   3
   0 [  0   3   8 inf ]
   1 [inf   0   1 inf ]
   2 [inf inf   0   2 ]
   3 [inf inf inf   0 ]

After k = 1 (allow vertex 1 as a hop):
   dist[0][2] = min(8, dist[0][1]+dist[1][2]) = min(8, 3+1) = 4
        0   1   2   3
   0 [  0   3   4 inf ]   <-- 0->1->2 beat the direct 0->2

After k = 2 (allow vertex 2 as a hop):
   dist[0][3] = dist[0][2]+dist[2][3] = 4+2 = 6
   dist[1][3] = dist[1][2]+dist[2][3] = 1+2 = 3
        0   1   2   3
   0 [  0   3   4   6 ]
   1 [inf   0   1   3 ]
   2 [inf inf   0   2 ]
   3 [inf inf inf   0 ]
```

A vertex reachable from nowhere keeps its row/column at `inf`. A negative
cycle betrays itself by driving some `dist[i][i]` below `0`.

## Complexity

| Operation                        | Time    | Space   |
|----------------------------------|---------|---------|
| `floydWarshall` (V vertices)     | O(V^3)  | O(V^2)  |
| `hasNegativeCycle`               | O(V^3)  | O(V^2)  |
| `buildDistanceMatrix` (E edges)  | O(V^2 + E) | O(V^2) |
| `findTheCity`                    | O(V^3)  | O(V^2)  |

## Walkthrough

[`11-floyd-warshall.ts`](./11-floyd-warshall.ts) is self-contained and
dense-matrix based. `buildDistanceMatrix` turns `[from, to, weight]`
triples into a `V x V` matrix: diagonal `0`, missing edges `Infinity`,
and — when parallel edges share endpoints — the smaller weight wins.

`floydWarshall` copies the input (leaving it untouched) and runs the
triple loop `k`, `i`, `j`. Two guards skip any relaxation that would read
through an unreachable vertex, so `Infinity + Infinity` arithmetic never
occurs. `formatMatrix` renders the matrix with aligned columns and prints
`inf` for `Infinity`, which is what the run block uses to show the matrix
before and after.

`hasNegativeCycle` runs the algorithm and checks the diagonal: a strictly
negative `dist[i][i]` means vertex `i` sits on a negative-weight cycle.

`findTheCity` (LeetCode 1334) computes all-pairs distances once, counts
how many other cities each city can reach within the threshold, and
returns the city with the fewest such neighbors — breaking ties toward
the **larger** index (achieved with a `<=` comparison as the scan moves
upward).

## LeetCode practice

- **1334. Find the City With the Smallest Number of Neighbors at a
  Threshold Distance** (Medium) — one Floyd-Warshall pass, then per-city
  threshold counting with a largest-index tie-break.

## Key takeaways

- Floyd-Warshall is the go-to when you need **all-pairs** distances and
  `V` is small enough for `O(V^3)` — far simpler than running Dijkstra
  from every source.
- The outer loop is the intermediate vertex `k`; getting the loop nesting
  order (`k` outermost) right is what makes the DP correct.
- Guard against relaxing through `Infinity` vertices so unreachable pairs
  stay `Infinity` instead of overflowing.
- A negative-weight cycle shows up as a negative value on the matrix
  diagonal (`dist[i][i] < 0`).

Companion code: [`11-floyd-warshall.ts`](./11-floyd-warshall.ts)
