# Pruning & Backtracking: Branch and Bound with N-Queens

**Objective:** Turn brute-force backtracking into an efficient search by pruning — rejecting a partial solution the instant it becomes invalid — and measure the payoff as pruned vs naive search-tree node counts.

## Concept

Backtracking builds a solution one choice at a time, exploring a tree of
partial states. The naive version only asks "is this valid?" at the leaves,
walking every dead-end branch all the way down first. **Pruning** (a.k.a.
branch and bound) asks the question at every internal node and cuts a branch
the moment it cannot possibly lead to a valid solution — so entire subtrees
are never visited.

N-Queens is the classic demonstration. A queen attacks along its column and
both diagonals, so once a queen sits in a row, most columns in the next row
are already illegal. The naive solver ignores that during descent and tries
all `n^n` placements; the pruned solver rejects a conflicting column before
it recurses.

```
Naive: try every column each row, validate only complete boards.
                     row0
        /      /      |      \      \        <- all n columns, always
      c0      c1     c2 ...  (n^n leaves; most are invalid)

Pruned: mask out attacked columns, recurse only into legal ones.
                     row0
        c0            c1          (c2, c3 pruned: attacked)
       /  \          / \
   (few legal cols)          <- whole subtrees never created
```

The pruning state is three bitmasks, each bit a column:

```
cols  : columns already taken by a queen
diag  : "\" diagonals under attack   (shift LEFT  by 1 per row down)
anti  : "/" diagonals under attack   (shift RIGHT by 1 per row down)

legal columns for the next row = full & ~(cols | diag | anti)
lowest legal column bit         = available & -available
```

Each conflict check is a single bitwise AND — O(1) — and shifting the two
diagonal masks by one bit as we move down a row keeps a diagonal threat
aligned with the column it will actually attack. **Early termination** is
the same idea taken further: if you only need one solution, return `true`
up the stack the instant a board completes and stop exploring siblings
entirely (`firstNQueensSolution`).

## Complexity

| Solver | Explored nodes (order) | Notes |
|---|---|---|
| `nQueensNaive` | Θ(n^n) placements | validity checked only at complete boards |
| `nQueensPruned` | far below n^n (empirically orders of magnitude) | O(1) conflict test per candidate via bitmasks |
| `firstNQueensSolution` | ≤ pruned total | stops at the first complete board |

Both solvers return the identical solution count — pruning changes only how
much of the tree is walked, never the answer. Measured node counts (from the
`--- run ---` block):

```
N=4: naive 341 nodes,     pruned 17 nodes    (~20x fewer)
N=5: naive 3906 nodes,    pruned 54 nodes    (~72x fewer)
N=6: naive 55987 nodes,   pruned 153 nodes   (~366x fewer)
```

(The gap widens fast with N — that is the whole point of pruning.)

## Walkthrough

[`03-pruning-backtracking.ts`](./03-pruning-backtracking.ts) pairs the two
solvers so the contrast is measurable. Both return a `SearchResult` carrying
`solutions` and `nodes` (recursive-call count = search-tree size).

`nQueensNaive` pushes every column at every row and only runs
`isCompleteBoardValid` at a full board, so it walks the entire `n^n` tree.
`nQueensPruned` threads the three bitmasks (`cols`, `diag`, `anti`),
computes `available = full & ~(cols | diag | anti)`, and loops over just the
set bits — isolating the lowest with `available & -available` and clearing
it with `available ^= bit`. As it descends, `diag` shifts left and `anti`
shifts right (both re-masked with `full`) so the diagonal threats track the
board geometry.

`firstNQueensSolution` reuses the same pruning but returns a boolean up the
stack, short-circuiting the moment one board is complete — early
termination. `solveNQueens` (LeetCode 51) reconstructs each board as
`'.'`/`'Q'` strings by recording the chosen column per row
(`Math.log2(bit)` recovers a single set bit's index).

The `--- run ---` block asserts the known solution counts (OEIS A000170: 2,
10, 4, 40, 92 for N = 4..8), confirms naive and pruned agree, asserts
`pruned.nodes < naive.nodes`, and logs the node-count comparison above.

## LeetCode practice

- **51. N-Queens** (Hard) — return every board; `solveNQueens` here.
- **52. N-Queens II** (Hard) — just the count; `countNQueensSolutions` here.
- **37. Sudoku Solver** (Hard) — backtracking with constraint pruning per row/column/box; early termination on the first complete grid.

## Key takeaways

- Backtracking explores a tree of partial solutions; pruning is the
  optimization that removes branches which cannot succeed, never visiting
  those subtrees at all.
- Test constraints as early as possible (at each internal node), not only at
  the leaves — this is what separates an exponential brute force from a
  practical search.
- Bitmasks make each N-Queens conflict check O(1): one AND per candidate,
  with the diagonal masks shifted by one bit per row to stay aligned.
- Early termination (return on the first solution) prunes every remaining
  sibling branch — free extra savings when one answer is enough.
- Pruning changes the number of nodes explored, never the set of solutions
  found; verifying that the pruned and naive counts match is a good
  correctness check.

Companion code: [`03-pruning-backtracking.ts`](./03-pruning-backtracking.ts)
