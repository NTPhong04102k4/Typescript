# Recursion & Backtracking Primer

**Objective:** Understand recursion as a call stack that unwinds and backtracking as recursion plus an explicit undo step, then apply both to classic enumeration problems.

## Concept

Recursion is a function that calls itself on a smaller subproblem until it
hits a **base case**. Every call pushes a new frame onto the call stack;
when the base case returns, frames pop and results combine on the way back
up. `factorial(3)` traces like this:

```
factorial(3)
  -> 3 * factorial(2)
       -> 2 * factorial(1)
            -> 1 * factorial(0)
                 -> return 1            (base case)
            <- returns 1 * 1 = 1
       <- returns 2 * 1 = 2
  <- returns 3 * 2 = 6
```

**Backtracking** is recursion with a pattern: choose an option, recurse
deeper, then **undo the choice** before trying the next option. This lets
one mutable `current` array explore every branch of a decision tree without
allocating a new array per branch. The decision tree for `subsets([1, 2])`
(include/exclude each element) looks like:

```
                         []
             include 1  /  \  skip 1
                       /      \
                    [1]        []
        include 2  /  \ skip 2   include 2 /  \ skip 2
                  /      \               /      \
             [1, 2]      [1]          [2]        []

Visited in this order: [], [1], [1,2], [2]   (pre-order over the tree)
```

Every leaf and internal node is a valid subset — that's why `subsets`
records `current` at the *start* of each recursive call, not just at the
leaves.

## Complexity

| Function                                  | Time         | Space (output + call stack) |
|--------------------------------------------|--------------|-------------------------------|
| `factorial(n)`                             | O(n)         | O(n) stack                    |
| `fibonacciRecursive(n)` (naive, no memo)    | O(2^n)       | O(n) stack                    |
| `permutations(nums)` (LC 46)                | O(n! · n)    | O(n! · n) output + O(n) stack |
| `subsets(nums)` (LC 78)                     | O(2^n · n)   | O(2^n · n) output + O(n) stack|
| `letterCombinations(digits)` (LC 17)        | O(4^n · n)   | O(4^n · n) output              |
| `combinationSum(candidates, target)` (LC 39)| O(2^target) worst | O(target) stack           |

## Walkthrough

`01-recursion-backtracking.ts` builds up from plain recursion to
backtracking:

- `factorial(n)` is the textbook base-case-plus-recursive-case example.
- `fibonacciRecursive(n)` recomputes the same subproblems repeatedly (see
  the recursion tree in the next lesson) — it's intentionally naive so
  lesson 02 can fix it with memoization.
- `permutations(nums)` backtracks over a shared `used` boolean array and a
  shared `current` array: pick an unused element, recurse, then mark it
  unused again before trying the next one. Solves LeetCode 46.
- `subsets(nums)` backtracks over a `start` index so each recursive call
  only considers elements after the last one chosen, guaranteeing every
  subset is generated exactly once. Solves LeetCode 78.
- `letterCombinations(digits)` (exercise) maps each digit to its phone
  letters and backtracks one digit at a time, building a string instead of
  an array. Solves LeetCode 17.
- `combinationSum(candidates, target)` (exercise) backtracks with an
  unbounded reuse rule (the recursive call passes `i`, not `i + 1`, so the
  same candidate can be picked again) and prunes branches where the running
  remainder goes negative. Solves LeetCode 39.

## LeetCode practice

- 46. Permutations (Medium)
- 78. Subsets (Medium)
- 17. Letter Combinations of a Phone Number (Medium)

## Key takeaways

- Every recursive function needs a base case that stops the calls, or it
  never terminates.
- Backtracking is recursion + mutation + undo: push a choice, recurse,
  pop the choice — this reuses one array instead of copying per branch.
- The shape of the recursion (include/exclude vs. start-index vs.
  index-in-string) determines whether you get subsets, permutations, or
  combinations — the "for each remaining option" loop is the only real
  structural difference.
- Naive recursion can recompute the same subproblem exponentially often;
  that's the exact problem dynamic programming (next lesson) solves.

Companion code: [`01-recursion-backtracking.ts`](./01-recursion-backtracking.ts)
