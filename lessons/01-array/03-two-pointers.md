# Two Pointers Technique

**Objective:** Replace nested loops (O(n^2)) with a single linear pass by walking two indices through an array according to a rule.

## Concept

Two pointers is a family of patterns where you track two indices instead
of one, moving them based on a comparison. The two most common shapes:

**Converging pointers** (start at both ends, move inward — great for
sorted arrays and palindromes):

```
[ 1 | 3 | 5 | 6 | 8 | 11 ]      target sum = 14
  L                     R        L=0, R=5: 1+11=12 < 14  -> L++
      L                 R        L=1, R=5: 3+11=14 == 14 -> found!
```

**Same-direction pointers** (both start near the front, the "slow" one
lags behind the "fast" one — great for merging or filtering while
preserving order):

```
[ 2 | 2 | 3 | 5 | 5 | 8 ]
  S   F                    fast scans ahead, slow marks the write/compare position
```

Both shapes turn an O(n^2) brute-force comparison of every pair into a
single O(n) sweep, because each pointer only ever moves forward (or
inward), so the total number of steps is bounded by the array length.

## Complexity

| Operation                             | Time | Space |
|-----------------------------------------|------|-------|
| `reverseInPlace` (converging swap)       | O(n) | O(1)  |
| `isArrayPalindrome` (converging compare) | O(n) | O(1)  |
| `twoSumSorted` (converging search)       | O(n) | O(1)  |
| `mergeSortedArrays` (same-direction)      | O(n + m) | O(n + m) |
| `hasPairWithDifference` (same-direction)  | O(n) | O(1)  |

## Walkthrough

`03-two-pointers.ts` implements both pointer shapes:

- `reverseInPlace` swaps `arr[left]` and `arr[right]` while moving inward,
  the classic converging-pointer mutation.
- `isArrayPalindrome` compares `arr[left]` to `arr[right]` while moving
  inward, stopping early on the first mismatch.
- `twoSumSorted` solves LeetCode 167 by moving `left` right when the sum
  is too small and `right` left when the sum is too big — this only works
  because the input is sorted, which is what lets us discard a whole side
  of the search space each step.
- `mergeSortedArrays` (exercise) walks two independent same-direction
  pointers, one per input array, always advancing whichever points at the
  smaller head element.
- `hasPairWithDifference` (exercise) uses a same-direction `left`/`right`
  pair on one sorted array, advancing `right` when the gap is too small
  and `left` when it's too big.

## LeetCode practice

- 167. Two Sum II - Input Array Is Sorted (Medium)
- 125. Valid Palindrome (Easy)
- 11. Container With Most Water (Medium)
- 15. 3Sum (Medium)

## Key takeaways

- Two pointers trade an O(n^2) nested loop for an O(n) single pass by
  exploiting order (sorted input) or a fixed traversal direction.
- Converging pointers meet in the middle; same-direction pointers keep one
  index ahead of the other.
- The technique needs a rule to decide which pointer moves — usually a
  comparison against a target sum, value, or condition.
- Almost always O(1) extra space, which is why two pointers beats a
  hash-map approach when memory matters.

Companion code: [`03-two-pointers.ts`](./03-two-pointers.ts)
