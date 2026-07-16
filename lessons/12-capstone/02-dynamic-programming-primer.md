# Dynamic Programming Primer

**Objective:** Recognize overlapping subproblems and optimal substructure, then solve them with top-down memoization (a `Map`) or bottom-up tabulation (an array).

## Concept

Dynamic programming (DP) is recursion plus a cache. It applies when a
problem has:

1. **Overlapping subproblems** — the same smaller input is needed many times.
2. **Optimal substructure** — the answer for `n` can be built from answers
   for smaller inputs.

Naive `fibonacciRecursive(4)` (from lesson 01) recomputes `fib(2)` and
`fib(1)` repeatedly:

```
fib(4)
├── fib(3)
│   ├── fib(2)
│   │   ├── fib(1) -> 1
│   │   └── fib(0) -> 0
│   └── fib(1) -> 1
└── fib(2)          <-- overlapping subproblem, recomputed from scratch!
    ├── fib(1) -> 1
    └── fib(0) -> 0
```

**Top-down memoization** keeps the recursive shape but stores each result
in a `Map` the first time it's computed, so the second `fib(2)` call is an
O(1) lookup instead of a re-expansion.

**Bottom-up tabulation** flips the direction: build a table from the
smallest subproblem up to `n`, so every entry is computed exactly once. The
DP table for `coinChange([1, 2, 5], 5)` — `dp[a]` = fewest coins to make
amount `a` — fills in like this:

```
amount:   0    1    2    3    4    5
dp:       0    1    1    2    2    1
                          (dp[5]: best is 5 -> one coin, so dp[5] = 1)
```

Both techniques compute the same values; memoization trades a bit of call
stack overhead for code that reads like the recursive definition, while
tabulation avoids recursion entirely and is usually faster in practice.

## Complexity

| Function                                  | Time                     | Space                          |
|--------------------------------------------|--------------------------|---------------------------------|
| `fibonacciMemo(n)` (top-down, `Map`)        | O(n)                     | O(n) memo + O(n) call stack     |
| `climbingStairs(n)` (LC 70, bottom-up)      | O(n)                     | O(n) table (O(1) with 2 vars)   |
| `coinChange(coins, amount)` (LC 322)        | O(amount · coins.length) | O(amount)                       |
| `lengthOfLIS(nums)` (LC 300, O(n^2) DP)     | O(n^2)                   | O(n)                             |
| `rob(nums)` (LC 198, rolling variables)     | O(n)                     | O(1)                             |

## Walkthrough

`02-dynamic-programming-primer.ts`:

- `fibonacciMemo(n, memo)` is `fibonacciRecursive` from lesson 01 with one
  line added: check the `Map` before recursing, and store the result
  before returning. Same recurrence, O(n) instead of O(2^n).
- `climbingStairs(n)` solves LeetCode 70 bottom-up: `dp[i]` is the number of
  ways to reach step `i`, built from `dp[i-1] + dp[i-2]` (you can arrive
  from one step back or two steps back).
- `coinChange(coins, amount)` solves LeetCode 322 bottom-up: `dp[a]` is the
  fewest coins to make amount `a`, initialized to `Infinity` and relaxed by
  trying every coin, matching the table traced above.
- `lengthOfLIS(nums)` (exercise) solves LeetCode 300: `dp[i]` is the length
  of the longest increasing subsequence ending at index `i`, built by
  scanning every earlier `j` with `nums[j] < nums[i]`.
- `rob(nums)` (exercise) solves LeetCode 198 with rolling variables instead
  of a full array: `prev`/`curr` track "best up to two houses ago" and
  "best up to the previous house" so no array is needed at all.

## LeetCode practice

- 70. Climbing Stairs (Easy)
- 322. Coin Change (Medium)
- 300. Longest Increasing Subsequence (Medium)

## Key takeaways

- DP = recursion + cache; the recurrence relation is the hard part, the
  cache is mechanical once you have it.
- A `Map` memo preserves the natural recursive definition; an array table
  (tabulation) removes recursion overhead entirely.
- Initializing a tabulation array with a sentinel (`Infinity` for
  "unreachable", `0` for "one way to do nothing") is what makes the
  base case fall out of the loop instead of needing a special branch.
- Many DP problems collapse to O(1) space once you notice the recurrence
  only looks back a constant number of steps (see `rob`).

Companion code: [`02-dynamic-programming-primer.ts`](./02-dynamic-programming-primer.ts)
