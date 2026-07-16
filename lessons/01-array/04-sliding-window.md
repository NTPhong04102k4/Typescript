# Sliding Window Technique

**Objective:** Avoid recomputing overlapping sub-range work by sliding a window's boundaries instead of restarting from scratch for every start index.

## Concept

A sliding window tracks a contiguous range `[left, right]` and updates an
aggregate (sum, count, distinct elements...) incrementally as the window
moves, instead of recomputing it from scratch. There are two shapes:

**Fixed-size window** (width `k` never changes — slide both edges
together):

```
arr:  [ 2 | 1 | 5 | 1 | 3 | 2 ]     k = 3

step0: [ 2   1   5 ] 1   3   2      sum = 8
step1:   2 [ 1   5   1 ] 3   2      sum = 8 - 2 + 1 = 7
step2:   2   1 [ 5   1   3 ] 2      sum = 7 - 1 + 3 = 9   <- best
```

**Variable-size window** (right expands to include more, left shrinks to
drop elements once a condition is violated/satisfied):

```
arr:    [ 2 | 3 | 1 | 2 | 4 | 3 ]    target sum >= 7

right=4: [ 2   3   1   2   4 ]       sum = 12 >= 7 -> shrink left
left=1:    2 [ 3   1   2   4 ]       sum = 10 >= 7 -> shrink left
left=2:    2   3 [ 1   2   4 ]       sum = 7  >= 7 -> shrink left
left=3:    2   3   1 [ 2   4 ]       sum = 6  <  7 -> stop shrinking, window size 2
```

Because `left` and `right` each only move forward, the total work across
the whole scan is O(n), even though it looks like a nested loop.

## Complexity

| Operation                              | Time | Space |
|-------------------------------------------|------|-------|
| `fixedWindowMaxSum` (width k)               | O(n) | O(1)  |
| `minSubArrayLen` (variable, shrinking)      | O(n) | O(1)  |
| `maxConsecutiveOnesIII` (variable, shrinking) | O(n) | O(1)  |
| `findMaxAverage` (fixed width k)             | O(n) | O(1)  |

## Walkthrough

`04-sliding-window.ts` implements both window shapes:

- `fixedWindowMaxSum` seeds the sum with the first `k` elements, then
  slides one step at a time by adding the entering element and
  subtracting the leaving one — no re-summing.
- `minSubArrayLen` solves LeetCode 209: `right` expands the window and
  accumulates `sum`; whenever `sum >= target`, the `while` loop shrinks
  from `left` while recording the shortest length seen, since shrinking
  can never make the sum too small without us checking again.
- `maxConsecutiveOnesIII` (exercise) tracks `zeroCount` in the window and
  shrinks from the left whenever it exceeds `k`, so the window always
  represents a valid (flippable) run of 1s.
- `findMaxAverage` (exercise) is the fixed-window pattern applied to
  LeetCode 643: keep a running sum for a width-`k` window and divide by
  `k` only once, at the end.

## LeetCode practice

- 643. Maximum Average Subarray I (Easy)
- 209. Minimum Size Subarray Sum (Medium)
- 1004. Max Consecutive Ones III (Medium)
- 3. Longest Substring Without Repeating Characters (Medium)

## Key takeaways

- Sliding window turns repeated re-scanning of overlapping ranges into a
  single O(n) pass by updating an aggregate incrementally.
- Fixed windows slide both edges together; variable windows expand `right`
  greedily and shrink `left` only when a constraint is violated.
- The trick is finding what to track (sum, count, frequency) so that
  adding/removing one element is O(1).
- Every element is added to the window and removed from it at most once,
  which is why the amortized cost is linear despite the nested-loop look.

Companion code: [`04-sliding-window.ts`](./04-sliding-window.ts)
