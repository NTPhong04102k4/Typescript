# Binary Search on Arrays

**Objective:** Cut a sorted (or monotonic) search space in half every step to find a target in O(log n) instead of O(n).

## Concept

Binary search only works when you can decide, from a single midpoint
check, which half of the remaining range can be safely discarded. On a
sorted array that decision is a simple comparison:

```
nums:  [ -1 | 0 | 3 | 5 | 9 | 12 ]     target = 9
index:    0   1   2   3   4    5

low=0, high=5, mid=2: nums[2]=3 < 9  -> discard left half, low=3
low=3, high=5, mid=4: nums[4]=9 == 9 -> found at index 4

           low          mid=4(hit)  high
[ -1 | 0 | 3 ][ 5 |  9  | 12 ]
```

The same idea generalizes beyond plain sorted arrays: rotated sorted
arrays, and "first/last position" queries, still let you throw away half
the range each step — you just need a different rule for which half is
safe to discard.

```
rotated: [ 4 | 5 | 6 | 7 | 0 | 1 | 2 ]     target = 0
                          ^
one half (low..mid or mid..high) is always still sorted --
check target against THAT half's bounds to decide which side to keep.
```

## Complexity

| Operation                              | Time     | Space |
|-------------------------------------------|----------|-------|
| `binarySearch` (plain sorted array)         | O(log n) | O(1)  |
| `searchRotated` (rotated sorted array)      | O(log n) | O(1)  |
| `searchRange` (first/last position)         | O(log n) | O(1)  |
| `findMinRotated` (minimum in rotated array)  | O(log n) | O(1)  |

## Walkthrough

`07-binary-search.ts` builds up from plain binary search to its variants:

- `binarySearch` solves LeetCode 704 with the textbook `low`/`high`/`mid`
  loop, halving the range on each comparison.
- `searchRotated` solves LeetCode 33: at every `mid`, one of the two
  halves (`[low, mid]` or `[mid, high]`) is guaranteed to be sorted; the
  function checks which one and only trusts the "is target in range"
  shortcut on that sorted half.
- `findBound` is a shared helper that biases the search left or right
  after finding a match, used by `searchRange` (exercise) to solve
  LeetCode 34 — call it once biased left for the first position and once
  biased right for the last.
- `findMinRotated` (exercise) solves LeetCode 153 by comparing `nums[mid]`
  to `nums[high]`: if `mid` is greater, the minimum must be to the right;
  otherwise it's at `mid` or to the left.

## LeetCode practice

- 704. Binary Search (Easy)
- 33. Search in Rotated Sorted Array (Medium)
- 34. Find First and Last Position of Element in Sorted Array (Medium)
- 153. Find Minimum in Rotated Sorted Array (Medium)

## Key takeaways

- Binary search needs a rule for discarding half the space, not
  necessarily a fully sorted array — "monotonic decision" is the real
  requirement.
- Compute `mid` as `low + Math.floor((high - low) / 2)` to avoid overflow
  habits from other languages (not a real issue in JS numbers, but good
  practice).
- Rotated-array search works by identifying which half is still sorted at
  each step and reasoning about that half only.
- Finding first/last occurrence is "binary search that doesn't stop at the
  first match" — keep searching the biased half after a hit.

Companion code: [`07-binary-search.ts`](./07-binary-search.ts)
