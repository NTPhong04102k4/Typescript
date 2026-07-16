# Median-Finding with Two Heaps

**Objective:** Maintain the running median of a number stream in O(log n) per insertion and O(1) per query, by splitting the data into two balanced heaps around the midpoint.

## Concept

Sorting after every insertion to read the middle element costs O(n log n)
per query. Instead, keep the stream split into two halves around the
median at all times:

- **`lower`** — a **max-heap** holding the smaller half. Its root is the
  *largest* value below (or at) the median.
- **`upper`** — a **min-heap** holding the larger half. Its root is the
  *smallest* value above the median.

As long as the two heaps never differ in size by more than one element,
the median is always readable directly from their roots — no scanning
required.

```
Stream so far: 1, 5, 2, 8, 3, 9        (sorted view: 1 2 3 | 5 8 9)

        lower (max-heap)        |        upper (min-heap)
        smaller half            |        larger half
             3                  |             5
            / \                 |            / \
           1   2                |           8   9
     root = max = 3             |      root = min = 5

sizes: lower=3, upper=3 (balanced) -> median = (3 + 5) / 2 = 4

insert 4: is 4 <= lower.peek() (3)? no -> tentatively push to upper
  upper = {4, 5, 8, 9} (size 4), lower = {1, 2, 3} (size 3)
  rebalance: upper.size(4) > lower.size(3) -> move upper's root (4) to lower
  lower = {1, 2, 3, 4} (root = 4), upper = {5, 8, 9} (root = 5)

sizes: lower=4, upper=3 -> lower is one larger -> median = lower.peek() = 4
```

The insertion rule is: push into `lower` if the new value is <= `lower`'s
current max (or `lower` is empty); otherwise push into `upper`. Then
rebalance so neither heap is ever more than one element ahead of the
other, preferring to keep the *extra* element (when the stream has an odd
count) in `lower`. Reading the median becomes:

- If `lower` is strictly larger, the median is `lower`'s root alone.
- If the two heaps are equal in size, the median is the average of both
  roots.

## Complexity

| Operation                                | Time       | Space |
|-------------------------------------------|------------|-------|
| `addNum` (push + at most one rebalance move) | O(log n)   | O(1) amortized |
| `findMedian`                                | O(1)       | O(1) |
| `streamMedian` over n numbers               | O(n log n) | O(n) heaps |
| Naive "sort on every query"                 | O(n log n) per query | O(n) |

## Walkthrough

[`07-median-two-heaps.ts`](./07-median-two-heaps.ts) defines
`MedianFinder`, composed of a `MaxHeap<number>` (`lower`) and a
`MinHeap<number>` (`upper`), both imported from
[`./02-min-max-heap.ts`](./02-min-max-heap.ts) using the shared
`ascending` comparator. `addNum` first routes the new value into `lower`
or `upper` per the rule above, then rebalances: if `lower` grew more than
one ahead of `upper`, its root moves over; if `upper` ever gets ahead of
`lower` at all, its root moves back. `findMedian` reads the roots
directly — no heap operations needed at query time. `streamMedianStub` is
the exercise: wrap `MedianFinder` to report the running median after
every insertion in an array, which is the shape most interview follow-ups
actually ask for once the class itself works.

## LeetCode practice

- **295. Find Median from Data Stream** (Hard) — implemented directly
  above as `MedianFinder`.
- **480. Sliding Window Median** (Hard) — extends this same two-heap split
  with *removal* of values that slide out of the window, which needs
  lazy deletion (mark a value as stale and discard it when it surfaces at
  a root) since neither `MinHeap` nor `MaxHeap` here supports removing an
  arbitrary element directly.
- **1825. Finding MK Average** (Hard) — a three-way split (ignore the
  smallest/largest `k` elements, average the middle) that generalizes the
  same "keep balanced heaps around a moving boundary" idea to more than
  two partitions.

## Key takeaways

- Splitting a stream into a max-heap (lower half) and a min-heap (upper
  half) keeps the median reachable in O(1) by only ever looking at the
  two roots.
- The insertion rule ("does it belong in the lower or upper half?") plus
  a one-element rebalance step is all that's needed to keep both heaps
  honest after every `addNum`.
- Preferring to keep the extra element in `lower` when sizes are unequal
  gives a simple, consistent rule for reading the median back out: check
  which heap (if either) is larger before deciding to average or not.
- This two-heap pattern generalizes beyond medians to any "maintain the
  k-th percentile of a growing stream" problem.

Companion code: [`07-median-two-heaps.ts`](./07-median-two-heaps.ts)
