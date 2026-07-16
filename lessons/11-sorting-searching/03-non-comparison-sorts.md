# Non-Comparison Sorts (Counting / Radix) & Engine Array Notes

**Objective:** Learn how counting sort and radix sort beat the O(n log n) comparison-sort lower bound by using the *values themselves* instead of pairwise comparisons, and why that requires knowing something about the value range.

## Concept

Every comparison sort is bounded below by O(n log n) because it can only
ask "which is bigger?" — a decision tree over n! orderings needs
log2(n!) = O(n log n) comparisons in the worst case. Non-comparison
sorts sidestep this entirely by using values as array indices, trading
"works for anything orderable" for "must know the range of values."

**Counting sort** on `[4, 1, 3, 4, 3, 2, 1]` (values 1..4):

```
1. Count occurrences of each value:
   value:  1  2  3  4
   count:  2  1  2  2

2. Prefix-sum the counts (count[v] = number of elements <= v):
   value:  1  2  3  4
   count:  2  3  5  7   <- count[4]=7 means 7 elements are <= 4 (all of them)

3. Walk the input right-to-left, placing each value at count[v]-1,
   then decrementing count[v] (this order keeps equal elements stable):

   i=6 val=1 -> output[1]=1, count[1]: 2->1
   i=5 val=2 -> output[2]=2, count[2]: 3->2
   i=4 val=3 -> output[4]=3, count[3]: 5->4
   i=3 val=4 -> output[6]=4, count[4]: 7->6
   i=2 val=3 -> output[3]=3, count[3]: 4->3
   i=1 val=1 -> output[0]=1, count[1]: 1->0
   i=0 val=4 -> output[5]=4, count[4]: 6->5

Result: [1, 1, 2, 3, 3, 4, 4]
```

**Radix sort** applies counting sort digit-by-digit (least significant
first), so it only needs 10 buckets no matter how large the numbers are.
On `[170, 45, 75, 90, 802, 24, 2, 66]`:

```
Pass 1 (1s digit, stable):    [170, 90, 802, 2, 24, 45, 75, 66]
Pass 2 (10s digit, stable):   [802, 2, 24, 45, 66, 170, 75, 90]
Pass 3 (100s digit, stable):  [2, 24, 45, 66, 75, 90, 170, 802]

Result: [2, 24, 45, 66, 75, 90, 170, 802]
```

Each pass is a stable counting sort on one digit; stability across
passes is what makes the final result fully sorted.

**Engine array notes.** V8 tracks an "elements kind" per array — PACKED_SMI,
PACKED_DOUBLE, PACKED_ELEMENTS, or their HOLEY_* counterparts. Counting
sort's `count` array and radix sort's per-digit `output` array are built
with `new Array(n).fill(0)` and then written to every index in order, so
they stay PACKED_SMI (dense, small integers, no holes) — the fastest
elements kind for indexed reads/writes. Comparison sorts that `push`
conditionally or leave gaps risk HOLEY arrays, which fall back to slower
property-lookup paths for missing indices. This is also why counting/
radix sort need a bounded, known integer range: the `count` array's size
depends directly on the max value, so an unbounded or sparse range would
blow up memory and defeat the whole point.

## Complexity

| Algorithm     | Time                  | Space     | Stable | Requires                  |
|---------------|------------------------|-----------|--------|----------------------------|
| Counting sort | O(n + k)              | O(n + k)  | Yes    | integers in range [0, k]  |
| Radix sort    | O(d * (n + b))        | O(n + b)  | Yes    | fixed-width keys (d digits, base b) |

n = number of elements, k = max value, d = number of digits, b = base
(10 for decimal digits). When k or d is small relative to n, both beat
O(n log n) comparison sorts.

## Walkthrough

`03-non-comparison-sorts.ts` implements both algorithms:

- `countingSort(input)` builds the `count` array, prefix-sums it, then
  places elements right-to-left exactly as traced above — this
  right-to-left placement is what keeps equal elements in their original
  relative order (stability).
- `radixSort(input)` finds the max value to know how many digit passes
  are needed, then calls `countingSortByDigit(arr, exp)` once per digit
  (`exp` = 1, 10, 100, ...), each pass being a full stable counting sort
  keyed on `Math.floor(value / exp) % 10`.
- `countingSortWithNegatives` is the first exercise solution: it shifts
  every value up by `-min` before calling `countingSort`, then shifts
  the result back down, extending counting sort to work on negative
  integers.
- `radixSortDescending` is the second exercise solution: since
  non-comparison sorts have no comparator to flip, descending order is
  simplest as `radixSort(input).reverse()`.
- `sortColors` solves LeetCode 75 with a 3-bucket counting sort (values
  are only 0, 1, 2).
- `relativeSortArray` solves LeetCode 1122 by counting `arr1`, then
  draining counts in `arr2`'s order followed by any leftovers ascending.
- `maximumGap` solves LeetCode 164 by radix-sorting the input in linear
  time and then scanning for the largest adjacent gap — the intended
  solution, since a comparison sort would only give O(n log n).

## LeetCode practice

- 1122. Relative Sort Array (Easy)
- 75. Sort Colors (Medium)
- 164. Maximum Gap (Hard)

## Key takeaways

- Counting and radix sort break the O(n log n) comparison lower bound by
  using values as indices instead of comparing pairs — but only work on
  (or can be adapted to) integers with a known, bounded range.
- Counting sort's stability comes specifically from placing elements
  right-to-left after the prefix sum; placing left-to-right would still
  sort correctly but would reverse the order of equal elements.
- Radix sort is repeated stable counting sort, one digit at a time,
  least-significant-first; stability of each pass is required for the
  final result to be correct.
- Dense, sequentially-filled arrays (like `count` and `output` here) stay
  in a packed/SMI elements kind in V8, which is why these algorithms are
  fast in practice, not just in asymptotic terms.
- When the value range k is O(n) or smaller, these algorithms are a
  strictly better choice than comparison sorts.

Companion code: [`03-non-comparison-sorts.ts`](./03-non-comparison-sorts.ts)
