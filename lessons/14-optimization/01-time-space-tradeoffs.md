# Time/Space Trade-offs: Hashing, Precomputation, Prefix Sums

**Objective:** Learn to recognize a brute-force solution and convert it to an optimized one by spending memory — a hash map, a set, or a precomputed prefix array — to eliminate repeated work.

## Concept

Most "make it faster" problems come down to one move: **stop recomputing
what you already know**. A brute-force solution nests a loop to re-derive an
answer that a lookup table could have answered in O(1). The optimization
mindset is to ask, at every repeated computation, "could I have written this
down the first time?"

Three concrete forms of that move appear again and again:

- **Hashing** — keep a `Map`/`Set` of what you have seen so a membership or
  complement question becomes O(1) instead of an inner scan.
- **Precomputation** — do expensive setup once so each of many later queries
  is cheap. Worth it whenever queries ≫ 1.
- **Prefix sums** — a specific precomputation for range queries.

```
Two-sum, target = 9, nums = [2, 7, 11, 15]

BRUTE O(n^2):  compare every pair          HASHED O(n): remember + look up
  (2,7)? 9  -> found                          i=0  seen={}         need 7
  (2,11)?                                      i=1  seen={2:0}      need 2 -> HIT (0,1)
  (2,15)? ...

Prefix sums turn range-sum queries into one subtraction:

  nums   =      [ 1 , 2 , 3 , 4 , 5 ]
  prefix = [ 0 , 1 , 3 , 6 , 10, 15 ]      prefix[i] = sum of nums[0..i-1]
               ^           ^
  rangeSum(1,3) = prefix[4] - prefix[1] = 10 - 1 = 9   (= 2+3+4)
```

The cost is always memory. `twoSumHashed` holds up to n entries; a prefix
array is n+1 numbers. You are choosing to store O(n) data so that time drops
from O(n^2) to O(n). That is the whole trade, and it is almost always worth
it when n is large.

## Complexity

| Problem | Brute force | Optimized | Extra space |
|---|---|---|---|
| Two-sum | O(n^2) time | O(n) time (hash map) | O(n) |
| Has duplicate | O(n^2) time | O(n) time (set) | O(n) |
| q range-sum queries | O(n·q) | O(n + q) (prefix sums) | O(n) |
| Subarray sums = k | O(n^2) | O(n) (prefix + hash map) | O(n) |

## Walkthrough

[`01-time-space-tradeoffs.ts`](./01-time-space-tradeoffs.ts) pairs each
brute-force function with its optimized twin so the trade is explicit.
`twoSumBrute` scans every pair in O(n^2); `twoSumHashed` makes one pass,
storing each value's index in a `Map` and asking whether the *complement*
`target - nums[i]` was already seen — an O(1) lookup that replaces the inner
loop.

`buildPrefixSum` computes `prefix[i] = sum of nums[0..i-1]` once (note the
length-`n+1` array with a leading `0`, which removes the special case at the
left edge), after which `rangeSum(left, right)` is a single subtraction
`prefix[right+1] - prefix[left]`.

The exercises push the pattern further: `hasDuplicate` uses a `Set` for O(n)
membership, and `subarraySumCount` combines both ideas — a running prefix
sum plus a hash map of *how many times each prefix value has occurred* — so
counting subarrays that sum to `k` drops from O(n^2) to O(n).

## LeetCode practice

- **1. Two Sum** (Easy) — the canonical hash-map-for-O(1)-lookup trade.
- **560. Subarray Sum Equals K** (Medium) — prefix sum + hash map of prefix frequencies.
- **303. Range Sum Query - Immutable** (Easy) — precompute a prefix array, answer each query in O(1).

## Key takeaways

- The core optimization move is trading space for time: store results you
  would otherwise recompute.
- A hash map/set turns a repeated "have I seen X?" scan into an O(1) lookup,
  collapsing an O(n^2) nested loop into a single O(n) pass.
- Precomputation pays off whenever you answer many queries against the same
  data — do the O(n) work once, make each query O(1).
- Prefix sums are the standard precomputation for range-sum queries; the
  leading `0` sentinel avoids an edge case at the left boundary.

Companion code: [`01-time-space-tradeoffs.ts`](./01-time-space-tradeoffs.ts)
