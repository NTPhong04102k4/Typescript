# LeetCode Practice Set: Array

**Objective:** Apply every technique from this topic — hashing, two pointers, prefix products, sorting, and interval merging — to eight classic array problems spanning Easy to Hard.

## Concept

This lesson is a practice set, not a new technique: each problem below
reuses a pattern from an earlier lesson in this topic (hash-map lookup,
sliding/converging pointers, prefix/suffix products, sorted two pointers,
interval merging, in-place rotation). The diagram below recaps the two
two-pointer shapes that solve half of this set:

```
Converging (3Sum, Container With Most Water, Trapping Rain Water):

[ 1 | 8 | 6 | 2 | 5 | 4 | 8 | 3 | 7 ]
  L                             R      move the pointer at the SHORTER side inward

Prefix/suffix sweep (Product of Array Except Self):

nums:    [ 1 | 2 | 3 | 4 ]
prefix:  [ 1 | 1 | 2 | 6 ]     (product of everything to the left)
suffix:  [24 | 12| 4 | 1 ]     (product of everything to the right)
answer:  [ 1*24 | 1*12 | 2*4 | 6*1 ] = [24, 12, 8, 6]
```

## Complexity

| Problem                              | Time       | Space (excl. output) |
|------------------------------------------|------------|-----------------------|
| 1. Two Sum                                | O(n)       | O(n)                  |
| 121. Best Time to Buy and Sell Stock       | O(n)       | O(1)                  |
| 238. Product of Array Except Self          | O(n)       | O(1)                  |
| 15. 3Sum                                  | O(n^2)     | O(log n) - O(n) (sort) |
| 11. Container With Most Water              | O(n)       | O(1)                  |
| 56. Merge Intervals                       | O(n log n) | O(n)                  |
| 189. Rotate Array                         | O(n)       | O(1)                  |
| 42. Trapping Rain Water                   | O(n)       | O(1)                  |

## Walkthrough

`11-leetcode-practice.ts` implements all eight as standalone, exported
functions:

- `twoSum` — hash map of value seen so far to index (lesson 1's pattern).
- `maxProfit` — running minimum price and best profit in one pass
  (lesson 9's Kadane-style tracking).
- `productExceptSelf` — one pass accumulating a running prefix product
  into the result, then a second pass multiplying in a running suffix
  product.
- `threeSum` — sort, then for each fixed index run a converging two-pointer
  scan over the rest, skipping duplicates to avoid repeated triplets.
- `maxArea` — converging pointers from both ends; the shorter wall is
  always the bottleneck, so only it can ever produce a bigger area, which
  is why that's the pointer that moves.
- `mergeIntervals` — sort by start time, then extend or start a new run
  (lesson 6's pattern, reused standalone here).
- `rotateArray` — three in-place reversals (lesson 10's pattern, reused
  standalone here).
- `trap` — converging pointers tracking `leftMax`/`rightMax`; water above
  any index is bounded by the smaller of the two walls, so processing
  from the side with the smaller current wall is always safe.

## LeetCode practice

- 1. Two Sum (Easy)
- 121. Best Time to Buy and Sell Stock (Easy)
- 238. Product of Array Except Self (Medium)
- 15. 3Sum (Medium)
- 11. Container With Most Water (Medium)
- 56. Merge Intervals (Medium)
- 189. Rotate Array (Medium)
- 42. Trapping Rain Water (Hard)

## Key takeaways

- Most "hard" array problems are combinations of two or three techniques
  from earlier lessons (sorting + two pointers, prefix + suffix sweeps).
- Converging two pointers solve container/trapping/3-sum style problems in
  O(n) or O(n^2) instead of the naive O(n^2) or O(n^3).
- Prefix/suffix running products (or sums) let you answer "everything
  except index i" queries without division and without recomputation.
- Reach for sorting first when a problem allows it — it often turns an
  O(n^3) brute force into O(n^2) or O(n log n).

Companion code: [`11-leetcode-practice.ts`](./11-leetcode-practice.ts)
