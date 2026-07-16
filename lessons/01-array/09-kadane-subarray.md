# Kadane's Algorithm & Subarray Problems

**Objective:** Find the best contiguous subarray in one linear pass by deciding, at each index, whether to extend the running subarray or start fresh.

## Concept

Kadane's algorithm tracks the best sum of a subarray *ending exactly at
index i*. At each step there are only two choices: extend the previous
run by adding the current element, or abandon it and start a new run at
the current element — whichever gives a bigger value.

```
nums:        [ -2 |  1 | -3 |  4 | -1 |  2 |  1 | -5 |  4 ]

currentMax:    -2    1   -2    4    3    5    6    1    5
                                ^
                    reset here: -3 + (-2) = -5 < 4, so start fresh at 4

best so far:   -2    1    1    4    4    5    6    6    6

answer = 6  (the subarray [4, -1, 2, 1])
```

`currentMax = max(nums[i], currentMax + nums[i])` is the whole algorithm —
every other array "best subarray" problem (max product, best time to
buy/sell) is a variation of tracking one or two running values instead of
recomputing every subarray from scratch.

## Complexity

| Operation                              | Time | Space |
|-------------------------------------------|------|-------|
| `maxSubArray` (Kadane's, max sum)           | O(n) | O(1)  |
| `maxProductSubarray` (max/min running pair) | O(n) | O(1)  |
| `maxProfit` (running min + best profit)     | O(n) | O(1)  |

## Walkthrough

`09-kadane-subarray.ts` starts with the canonical algorithm and then
varies it:

- `maxSubArray` solves LeetCode 53 exactly as described above: `currentMax`
  either extends or restarts, and `best` tracks the maximum seen.
- `maxProductSubarray` (exercise) solves LeetCode 152: because a negative
  number can turn the smallest running product into the largest (and vice
  versa), it tracks *both* a running max and a running min, swapping them
  whenever the current number is negative.
- `maxProfit` (exercise) solves LeetCode 121 by tracking the minimum price
  seen so far and the best profit achievable by selling today — the same
  "one running value, one pass" shape as Kadane's, applied to differences
  between consecutive prices instead of raw sums.

## LeetCode practice

- 53. Maximum Subarray (Medium)
- 152. Maximum Product Subarray (Medium)
- 121. Best Time to Buy and Sell Stock (Easy)

## Key takeaways

- Kadane's core decision is local: extend or restart, based on which
  yields a larger value at the current index.
- Many "best subarray/best window" problems are Kadane's algorithm with a
  different running quantity (sum, product, min-so-far) tracked instead of
  recomputing from scratch.
- Negative numbers can require tracking more than one running value (both
  max and min), since multiplying by a negative flips which extreme
  matters.
- All variants here are O(n) time and O(1) space — no auxiliary array is
  needed once you know what to track.

Companion code: [`09-kadane-subarray.ts`](./09-kadane-subarray.ts)
