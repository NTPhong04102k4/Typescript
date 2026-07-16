# Bitmask Dynamic Programming

**Objective:** Use an integer bitmask as the "visited set" in a dynamic program, illustrated with the Held-Karp travelling-salesman DP and a companion counting problem, and understand the `dp[mask][last]` state that makes an exponential search tractable.

## Concept

Many problems ask you to build up a *subset* of items one at a time, where the
answer depends on **which items you've used** and **where you are now**. Encoding
the visited set as a bitmask lets you index a DP table by it directly.

For the **travelling salesman** (visit every city once, return to the start at
minimum cost), the state is:

```
 dp[mask][last] = cheapest way to have visited exactly the cities in `mask`,
                  currently sitting at city `last`
```

`mask` always includes the start city 0. The transition extends the path to an
unvisited city `next`:

```
 for each state (mask, last):
   for each next not in mask:
     dp[mask | (1<<next)][next] = min( that, dp[mask][last] + dist[last][next] )
```

A 4-city run reaches the full set `1111` and then closes back to city 0:

```
 mask 0001  (only city 0 visited), last = 0, cost 0
   -> extend to 1, 2, 3 ...
 mask 1111  (all visited)
   -> add dist[last][0] to close the tour, take the minimum
```

There are `2^n` masks and `n` "last" positions, so the table is `2^n · n` states,
each filled in O(n) — far better than the `n!` brute-force permutations.

## Complexity

| Operation | Time | Space |
|-----------|------|-------|
| `shortestTour` (n cities) | O(2^n · n^2) | O(2^n · n) |
| `countHamiltonianPaths` (n nodes) | O(2^n · n^2) | O(2^n · n) |
| Brute force (permutations), for contrast | O(n!) | O(n) |

## Walkthrough

[`05-bit-dp.ts`](./05-bit-dp.ts) allocates `dp` as a `2^n × n` grid filled with
`Infinity`, then seeds `dp[1][0] = 0` — the set containing only city 0, sitting at
city 0, at zero cost. It sweeps masks in increasing order (a larger mask always
extends a smaller one, so dependencies are ready), skips any mask that doesn't
include the start bit, and relaxes every `(mask, last) -> next` transition. After
the sweep, `shortestTour` closes the loop by adding `dist[last][0]` from each
possible final city and taking the minimum. On the sample matrix the optimal tour
`0 -> 1 -> 3 -> 2 -> 0` costs `80`.

`countHamiltonianPaths` reuses the identical `dp[mask][last]` shape but stores a
**count of ways** instead of a minimum cost: `dp[1][0] = 1`, and each valid
transition does `dp[next] += dp[last]`. Summing `dp[full - 1][last]` over all
`last` gives the number of Hamiltonian paths from node 0 — `2` for a triangle,
`1` for a straight path graph. Same bitmask skeleton, different aggregation.

## LeetCode practice

- **847. Shortest Path Visiting All Nodes** (Hard) — BFS over `(node, visited-mask)` states.
- **1723. Find Minimum Time to Finish All Jobs** (Hard) — assign jobs to workers with a subset DP.
- **698. Partition to K Equal Sum Subsets** (Medium) — visited-elements bitmask DP.

## Key takeaways

- Encode the "which items are used" set as an integer bitmask and index the DP table by it.
- `dp[mask][last]` — the visited set plus your current position — is the canonical state for path/tour bitmask DP.
- Sweeping masks in increasing numeric order guarantees every smaller sub-state is computed before the states that extend it.
- The same skeleton counts ways (`+=`) or optimizes cost (`min`) just by changing the aggregation.
- Bitmask DP turns `O(n!)` permutation searches into `O(2^n · n^2)`, practical up to roughly 20 items.

Companion code: [`05-bit-dp.ts`](./05-bit-dp.ts)
