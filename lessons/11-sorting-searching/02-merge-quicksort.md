# Merge Sort & Quicksort (Divide and Conquer)

**Objective:** Learn how divide-and-conquer breaks sorting into subproblems, giving O(n log n) performance via merge sort's merge step and quicksort's partition step.

## Concept

Both algorithms recursively shrink the problem, but they split work at
different points: merge sort divides first and does all its work while
*combining* (the merge); quicksort does its work while *dividing* (the
partition) and needs no combining step at all.

**Merge sort** on `[5, 2, 4, 1, 3]` — split down to single elements, then
merge pairs back together in sorted order:

```
                [5, 2, 4, 1, 3]
               /               \
          [5, 2]              [4, 1, 3]
          /    \               /      \
        [5]    [2]          [4]     [1, 3]
                                     /    \
                                   [1]    [3]

merge [5],[2]        -> [2, 5]
merge [1],[3]        -> [1, 3]
merge [4],[1,3]      -> [1, 3, 4]
merge [2,5],[1,3,4]  -> [1, 2, 3, 4, 5]
```

**Quicksort** (Lomuto partition, pivot = last element) on the same array
— partition around a pivot so everything smaller ends up left of it and
everything larger ends up right, then recurse on each side:

```
[5, 2, 4, 1, 3]  pivot = 3 (last element)
 i=-1
 j=0: 5<=3? no
 j=1: 2<=3? yes -> i=0, swap(0,1) -> [2, 5, 4, 1, 3]
 j=2: 4<=3? no
 j=3: 1<=3? yes -> i=1, swap(1,3) -> [2, 1, 4, 5, 3]
 swap(i+1=2, high=4)             -> [2, 1, 3, 5, 4]
 pivot 3 is now at index 2 (final position)

recurse left  [2, 1]  (indices 0..1)  -> pivot 1, sorts to [1, 2]
recurse right [5, 4]  (indices 3..4)  -> pivot 4, sorts to [4, 5]

Result:        [1, 2, 3, 4, 5]
```

## Complexity

| Algorithm  | Best       | Average    | Worst      | Space              | Stable |
|------------|------------|------------|------------|--------------------|--------|
| Merge sort | O(n log n) | O(n log n) | O(n log n) | O(n) auxiliary     | Yes    |
| Quicksort  | O(n log n) | O(n log n) | O(n^2)*    | O(log n) avg stack | No     |

*Quicksort's worst case happens when the pivot is always the smallest or
largest element (e.g. a fixed last-element pivot on an already-sorted
array), degrading every partition to n-1 vs 0. Randomizing the pivot
(see the exercise) makes the worst case astronomically unlikely.

## Walkthrough

`02-merge-quicksort.ts` implements both algorithms from scratch:

- `merge(left, right, compare)` is the two-pointer merge step from the
  trace above, and `mergeSort(input, compare)` recursively splits the
  input at the midpoint and merges the sorted halves.
- `partition(arr, low, high, compare)` runs the Lomuto scheme (pivot =
  last element) and returns the pivot's final index; `quickSortInPlace`
  recurses on both sides, and `quickSort(input, compare)` copies the
  input before sorting it in place.
- `mergeSortNumbers` / `quickSortNumbers` are number-array convenience
  wrappers, reusing `ascending` from lesson 01's pattern.
- `quickSortRandomized` is the exercise solution: it swaps a random
  element into the pivot slot before partitioning, which avoids
  quicksort's O(n^2) worst case on already-sorted or adversarial input.
- `countInversionsMergeSort` is the second exercise solution: it reuses
  the merge step to count split inversions in O(n log n), the efficient
  counterpart to lesson 01's O(n^2) `countInversions` — same answer,
  much faster.
- `sortArray` solves LeetCode 912 with `mergeSortNumbers` (correct at
  any input size, unlike lesson 01's insertion-sort baseline).
- `findKthLargest` solves LeetCode 215 with **quickselect**: it reuses
  `partition` but only recurses into the side that contains the target
  index, giving O(n) average time instead of a full O(n log n) sort.
- `mergeSortedArray` solves LeetCode 88 by merging back-to-front so the
  merge can happen in place without extra space.

## LeetCode practice

- 88. Merge Sorted Array (Easy)
- 912. Sort an Array (Medium)
- 215. Kth Largest Element in an Array (Medium)

## Key takeaways

- Merge sort always does O(n log n) work because every split is exactly
  in half, regardless of input order — its cost is predictable.
- Quicksort's cost depends entirely on pivot choice; a bad pivot (e.g.
  always the last element on sorted input) gives O(n^2). Randomizing the
  pivot fixes this in practice.
- Merge sort needs O(n) auxiliary space for the merge buffers; quicksort
  sorts in place and only needs O(log n) stack space on average.
- Quickselect is a quicksort spinoff: by discarding the side that can't
  contain the answer, finding the kth smallest/largest element drops
  from O(n log n) to O(n) average time.
- Neither vanilla quicksort nor selection sort is stable; merge sort is,
  because the merge step always takes from the left run on ties.

Companion code: [`02-merge-quicksort.ts`](./02-merge-quicksort.ts)
