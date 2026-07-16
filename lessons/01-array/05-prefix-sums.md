# Prefix Sums & Difference Arrays

**Objective:** Precompute cumulative sums so any range-sum query answers in O(1), and use the inverse trick to apply O(1) range updates.

## Concept

A prefix sum array stores the running total up to (but not including)
each index, with a leading 0 so range sums stay branch-free:

```
arr:     [ 2 | 4 | 1 | 5 | 3 ]
prefix: [0 | 2 | 6 | 7 | 12 | 15 ]
index:    0   1   2   3    4    5

prefix[i] = sum(arr[0..i-1])

sum(arr[1..3]) = prefix[4] - prefix[1] = 12 - 2 = 10   (4 + 1 + 5 = 10 ✓)
```

A difference array is the mirror trick, used to apply the same update to
every element in a range in O(1), then materialize the final array in one
O(n) pass at the end:

```
Apply +5 to arr[1..3] via a difference array of length n+1:

diff:  [0, 0, 0, 0, 0, 0]
diff[left] += 5        -> diff[1] += 5
diff[right+1] -= 5      -> diff[4] -= 5
diff:  [0, 5, 0, 0, -5, 0]

running prefix sum of diff (first n entries) reconstructs the update:
[0, 5, 5, 5, 0]   <- +5 applied exactly to indices 1..3
```

## Complexity

| Operation                                    | Time | Space |
|-------------------------------------------------|------|-------|
| `buildPrefixSum` (one-time build)                 | O(n) | O(n)  |
| `rangeSum` (query after build)                    | O(1) | O(1)  |
| `pivotIndex` (single pass, running total)         | O(n) | O(1)  |
| `applyRangeUpdate` (one range update)             | O(1) | O(1)  |
| `reconstructFromDifference` (materialize result)  | O(n) | O(n)  |
| `subarraySum` (prefix sum + hash map)              | O(n) | O(n)  |

## Walkthrough

`05-prefix-sums.ts` covers both directions of the trick:

- `buildPrefixSum` builds the `prefix[i] = sum(arr[0..i-1])` array in one
  pass; `rangeSum` then answers any inclusive range sum with a single
  subtraction, `prefix[right + 1] - prefix[left]`.
- `pivotIndex` solves LeetCode 724 without a separate prefix array: it
  keeps a running `leftSum` and derives `rightSum` from the precomputed
  `total`, so each index is checked in O(1).
- `applyRangeUpdate` and `reconstructFromDifference` implement the
  difference-array trick: mark the start/end of a range update in O(1),
  then do one final running-sum pass to get the materialized array.
- `corpFlightBookings` (exercise) applies the difference array to solve
  LeetCode 1109 — every booking becomes one O(1) range update, regardless
  of how many seats/flights are covered.
- `subarraySum` (exercise) solves LeetCode 560 by combining a running
  prefix sum with a hash map of prefix-sum frequencies, turning "does some
  earlier prefix equal `prefix - k`" into an O(1) lookup.

## LeetCode practice

- 724. Find Pivot Index (Easy)
- 303. Range Sum Query - Immutable (Easy)
- 560. Subarray Sum Equals K (Medium)
- 1109. Corporate Flight Bookings (Medium)

## Key takeaways

- Prefix sums turn repeated range-sum queries from O(n) each into O(1)
  each, after a one-time O(n) build.
- Difference arrays turn repeated range *updates* into O(1) each, at the
  cost of one O(n) reconstruction pass at the end.
- Both tricks rely on the same idea: cumulative totals let you express a
  range as the difference of two prefixes.
- Combine prefix sums with a hash map (as in `subarraySum`) whenever you
  need to know if some earlier cumulative value has been seen before.

Companion code: [`05-prefix-sums.ts`](./05-prefix-sums.ts)
