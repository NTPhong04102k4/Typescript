# 14 · Optimization Techniques

Once a solution is correct, the next question is how to make it fast — and
where "fast" is decided. This topic covers the two levels that matter:
algorithmic optimization (trading space for time, reusing subproblem
results, pruning dead branches) and engine-level optimization (writing code
V8 can actually run quickly). The lessons build a shared vocabulary —
brute force vs optimized, memoization vs tabulation, pruned vs naive node
counts — and the final lesson connects it all back to the engine internals
from topic 00, so you can reason about both the Big-O and the constant
factor.

Lessons:
- 01 — Time/space trade-offs (hashing, precomputation, prefix sums)
- 02 — Memoization vs tabulation (turning exponential recursion polynomial)
- 03 — Pruning & backtracking (branch-and-bound, N-Queens bitmask pruning)
- 04 — Engine & memory optimization (monomorphic shapes, typed arrays)
