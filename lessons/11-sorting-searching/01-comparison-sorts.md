# Comparison Sorts Overview (Bubble / Insertion / Selection)

**Objective:** Understand the three classic O(n^2) comparison sorts, how they move elements differently, and why they matter as a baseline before divide-and-conquer sorts.

## Concept

All three algorithms only ever learn order by comparing two elements
(`compare(a, b)`), which caps their best-case complexity discussion but
keeps the code trivial to reason about.

**Bubble sort** repeatedly walks the array, swapping adjacent
out-of-order pairs, so the largest remaining element "bubbles" to the end
each pass. Trace on `[5, 2, 4, 1, 3]` (early exit when a pass has no
swaps):

```
Start:            [5, 2, 4, 1, 3]

Pass 1 (compare i, i+1; swap if left > right):
  (5,2) swap -> [2, 5, 4, 1, 3]
  (5,4) swap -> [2, 4, 5, 1, 3]
  (5,1) swap -> [2, 4, 1, 5, 3]
  (5,3) swap -> [2, 4, 1, 3, 5]   <- 5 is now in final position

Pass 2:
  (2,4) ok
  (4,1) swap -> [2, 1, 4, 3, 5]
  (4,3) swap -> [2, 1, 3, 4, 5]   <- 4 is now in final position

Pass 3:
  (2,1) swap -> [1, 2, 3, 4, 5]   <- 2 is now in final position

Pass 4: no swaps -> done early
Result:           [1, 2, 3, 4, 5]
```

**Insertion sort** grows a sorted prefix one element at a time, shifting
larger elements right to make room:

```
Start:            [5 | 2, 4, 1, 3]      (sorted prefix: [5])

Insert 2: 2 < 5, shift 5 right   -> [2, 5 | 4, 1, 3]
Insert 4: 4 < 5, shift; 4 > 2 stop -> [2, 4, 5 | 1, 3]
Insert 1: 1 < 5,4,2, shift all    -> [1, 2, 4, 5 | 3]
Insert 3: 3 < 5,4, shift; 3 > 2 stop -> [1, 2, 3, 4, 5]
Result:           [1, 2, 3, 4, 5]
```

**Selection sort** repeatedly finds the minimum of the unsorted suffix
and swaps it into place:

```
Start:            [5, 2, 4, 1, 3]

Pass 1: min of [5,2,4,1,3] is 1 (idx 3) -> swap with idx 0 -> [1, 2, 4, 5, 3]
Pass 2: min of [2,4,5,3]   is 2 (idx 1) -> already in place -> [1, 2, 4, 5, 3]
Pass 3: min of [4,5,3]     is 3 (idx 4) -> swap with idx 2 -> [1, 2, 3, 5, 4]
Pass 4: min of [5,4]       is 4 (idx 4) -> swap with idx 3 -> [1, 2, 3, 4, 5]
Result:           [1, 2, 3, 4, 5]
```

## Complexity

| Algorithm      | Best   | Average | Worst  | Space | Stable |
|----------------|--------|---------|--------|-------|--------|
| Bubble sort    | O(n)   | O(n^2)  | O(n^2) | O(1)  | Yes    |
| Insertion sort | O(n)   | O(n^2)  | O(n^2) | O(1)  | Yes    |
| Selection sort | O(n^2) | O(n^2)  | O(n^2) | O(1)  | No*    |

*Selection sort's naive swap-based version is not stable (swapping the
minimum into place can jump it past an equal element); a variant that
shifts instead of swaps can be made stable at the cost of more writes.
Bubble and insertion sort are stable because they never swap two equal
elements past each other.

## Walkthrough

`01-comparison-sorts.ts` implements all three against a shared
`Comparator<T>` type so the same code works for any orderable type:

- `bubbleSort(input, compare)` copies the input, then runs the
  shrinking-boundary passes from the trace above, exiting early via the
  `swapped` flag once a pass performs no swaps.
- `insertionSort(input, compare)` grows the sorted prefix by shifting
  larger elements right with a `while` loop, exactly as traced.
- `selectionSort(input, compare)` scans the unsorted suffix for its
  minimum each pass and swaps it into place.
- `ascending` is the default `Comparator<number>`, and
  `bubbleSortNumbers` / `insertionSortNumbers` / `selectionSortNumbers`
  are convenience wrappers for plain number arrays.
- `isSorted` and `countInversions` are the exercise solutions:
  `countInversions` counts every out-of-order pair `(i, j)` with `i < j`
  and `arr[i] > arr[j]` — exactly the quantity bubble sort resolves one
  swap at a time.
- `sortedSquares` solves LeetCode 977 with a two-pointer merge from both
  ends (the most negative and most positive numbers produce the largest
  squares).
- `arrayPairSum` solves LeetCode 561 by sorting with `insertionSortNumbers`
  and summing every element at an even index.
- `sortArrayInsertion` solves LeetCode 912 using `insertionSortNumbers` as
  a correctness baseline; lesson 02 revisits the same problem with an
  O(n log n) algorithm, which is what an actual submission needs for
  large inputs.

## LeetCode practice

- 977. Squares of a Sorted Array (Easy)
- 561. Array Partition (Easy)
- 912. Sort an Array (Medium)

## Key takeaways

- Bubble, insertion, and selection sort are all O(n^2) average/worst case
  but differ in *how* they move data: swapping adjacent pairs, shifting
  into a sorted prefix, or picking the minimum each round.
- Insertion sort's best case is O(n) on nearly-sorted input — the inner
  `while` loop barely runs, which is why it's often used as the base case
  for hybrid sorts (e.g. Timsort switches to insertion sort on small runs).
- Selection sort always does exactly n-1 passes and O(n^2) comparisons
  regardless of input order, but only O(n) swaps — useful when writes are
  expensive.
- Stability matters when sorting objects by one key but needing to
  preserve relative order of equal keys (e.g. multi-column sorts).
- `countInversions` gives a precise number for "how unsorted" an array
  is, and equals the number of adjacent swaps bubble sort performs.

Companion code: [`01-comparison-sorts.ts`](./01-comparison-sorts.ts)
