# Memoization vs Tabulation: Making Recursion Polynomial

**Objective:** Turn exponential recursion into polynomial-time dynamic programming two ways — top-down memoization and bottom-up tabulation — then shrink the DP table to its live window for O(width) space.

## Concept

Naive `fib(n)` is exponential because it solves the same subproblems again
and again: `fib(5)` recomputes `fib(3)` twice, `fib(2)` three times, and so
on. The subproblems **overlap**. Dynamic programming is exactly the fix from
the previous lesson — store each result instead of recomputing it — applied
to a recurrence.

```
fib(5) naive recursion tree (exponential, ~2^n nodes):

                fib(5)
              /        \
          fib(4)        fib(3)         <- fib(3) recomputed
          /    \        /    \
      fib(3)  fib(2) fib(2) fib(1)     <- fib(2) recomputed again & again
      ...

Memoized (top-down): compute each once, then O(1) cache hits (dashed):
                fib(5)
              /        \
          fib(4)      [fib(3)]         <- cached, not re-expanded
          /    \
      fib(3)  [fib(2)]

Tabulated (bottom-up): fill left to right, no recursion:
  dp = [0, 1, 1, 2, 3, 5]
        ^base    ^ dp[i] = dp[i-1] + dp[i-2]
```

**Memoization (top-down)** keeps the natural recursion and adds a cache: on
each call, return the stored value if present, otherwise compute and store
it. **Tabulation (bottom-up)** drops recursion entirely and fills a table
from the base cases upward. Both are O(n); pick top-down when the recursion
reads more naturally and only some subproblems are needed, bottom-up when
you want no call-stack and an easy path to space optimization.

That space optimization is the second half of the lesson: if `dp[i]` only
depends on the last one or two entries (Fibonacci) or on the previous row (a
grid), you do not need the whole table — just a rolling window. The
Fibonacci table collapses to two variables (O(1) space); the unique-paths
table collapses to a single row of width `cols` (O(cols) space).

```
Unique paths, keeping only one rolling row (grid 3 x 7):

  start row:  [1, 1, 1, 1, 1, 1, 1]
  after r=1:  [1, 2, 3, 4, 5, 6, 7]   row[c] += row[c-1]
  after r=2:  [1, 3, 6,10,15,21,28]   answer = row[cols-1] = 28
```

## Complexity

| Version | Time | Space |
|---|---|---|
| `fibNaive` | O(2^n) | O(n) stack |
| `fibMemo` (top-down) | O(n) | O(n) cache + stack |
| `fibTab` (bottom-up) | O(n) | O(n) table |
| `fibRolling` | O(n) | O(1) |
| `uniquePathsTable` | O(rows·cols) | O(rows·cols) |
| `uniquePathsRolling` | O(rows·cols) | O(cols) |

## Walkthrough

[`02-memoization-tabulation.ts`](./02-memoization-tabulation.ts) shows the
same recurrence four ways. `fibNaive` is the exponential baseline.
`fibMemo` keeps the recursion but threads a `Map` cache, so each `fib(k)` is
computed once and every repeat is an O(1) hit. `fibTab` fills `dp[0..n]`
iteratively — no recursion, no stack. `fibRolling` observes that `dp[i]`
only needs `dp[i-1]` and `dp[i-2]`, so it keeps just `prev` and `curr`,
dropping space to O(1).

The grid pair makes the space optimization visible in two dimensions.
`uniquePathsTable` builds the full `rows x cols` table with
`dp[r][c] = dp[r-1][c] + dp[r][c-1]`. `uniquePathsRolling` notices that a
cell only reads the row above (`row[c]` before it is overwritten) and the
cell to its left (`row[c-1]`, already updated this pass), so one array of
width `cols` suffices.

The exercises reuse the recurrence: `climbStairs` is Fibonacci in disguise
(O(1) rolling), and `rob` (House Robber) carries two rolling values —
best-if-we-skip and best-if-we-consider — again in O(1) space.

## LeetCode practice

- **70. Climbing Stairs** (Easy) — Fibonacci recurrence; do it with O(1) rolling variables.
- **198. House Robber** (Medium) — bottom-up choose skip-vs-take, O(1) space.
- **62. Unique Paths** (Medium) — 2-D grid DP; full table, then a single rolling row.

## Key takeaways

- DP applies when subproblems **overlap**; memoization and tabulation both
  compute each subproblem once, turning O(2^n) into O(n).
- Top-down memoization keeps the recursion and caches results; bottom-up
  tabulation fills a table from the base cases with no call stack.
- If a DP cell only depends on a bounded window of earlier cells, keep only
  that window — Fibonacci collapses to O(1), a 2-D grid to O(width).
- Choosing bottom-up first often makes the space optimization obvious,
  because the dependency direction is written right into the loop order.

Companion code: [`02-memoization-tabulation.ts`](./02-memoization-tabulation.ts)
