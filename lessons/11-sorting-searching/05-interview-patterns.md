# Sorting/Searching Interview Patterns

**Objective:** Recognize the recurring interview patterns that combine sorting or searching with another technique — sort + two pointers, sort + greedy, and binary search over an answer space instead of an array.

## Concept

**Pattern 1 — Sort, then two pointers.** Sorting first turns an O(n^2)
or O(n^3) brute force into something a two-pointer sweep can finish in
one pass. For 3Sum, fix one element and two-pointer the rest of the
sorted array toward a target sum. Trace the inner two-pointer sweep for
`i = 1` (value `-1`) on sorted `[-4, -1, -1, 0, 1, 2]`, target `0`:

```
sorted:  [-4, -1, -1,  0,  1,  2]
index:      0   1   2   3   4   5
fixed i=1 (value -1), left=2, right=5

left=2,right=5: -1 + -1 + 2 =  0  -> match! record [-1,-1,2]; left++, right--
left=3,right=4: -1 +  0 + 1 =  0  -> match! record [-1,0,1];  left++, right--
left=4,right=3: left >= right -> stop
```

**Pattern 2 — Sort, then greedy.** Many "minimum removals" / scheduling
problems become greedy once sorted by the right key (often end time).
For Non-overlapping Intervals, sort by end time and greedily keep an
interval only if it starts at or after the previous kept interval's end:

```
input:              [1,2], [2,3], [3,4], [1,3]
sort by end time:   [1,2], [2,3], [1,3], [3,4]

keep [1,2]                          prevEnd = 2
[2,3]: start 2 >= prevEnd 2  -> keep, prevEnd = 3
[1,3]: start 1 <  prevEnd 3  -> remove (count = 1)
[3,4]: start 3 >= prevEnd 3  -> keep, prevEnd = 4

Minimum removals: 1
```

**Pattern 3 — Binary search on the answer.** When a problem asks to
*minimize* or *maximize* some value subject to a feasibility check that
gets easier as the value grows (or shrinks), binary search the answer
space directly instead of the input array — same idea as lesson 04's
`binarySearchOnAnswer`, applied to a real optimization problem (Koko
Eating Bananas: find the minimum eating speed so all piles finish within
`h` hours).

## Complexity

| Pattern                              | Time                     | Space |
|----------------------------------------|--------------------------|-------|
| Sort + two pointers (3Sum)            | O(n^2) (O(n log n) sort + O(n) per fixed element) | O(log n)-O(n) sort space |
| Sort + greedy (interval scheduling)   | O(n log n)               | O(n) for the sorted copy |
| Binary search on the answer (Koko)    | O(n log(max pile)) (n work per feasibility check) | O(1) |
| Binary search on a virtual 2D array   | O(log(rows * cols))      | O(1) |

## Walkthrough

`05-interview-patterns.ts` implements one problem per pattern:

- `threeSum(nums)` sorts the input, then for each fixed index runs the
  two-pointer sweep from the trace above, skipping duplicate values at
  every level to avoid duplicate triplets.
- `eraseOverlapIntervals(intervals)` sorts by end time and greedily
  tracks `prevEnd`, counting an interval as removed whenever its start
  is before the previous kept interval's end — exactly the trace above.
- `minEatingSpeed(piles, h)` binary searches the answer space
  `[1, max(piles)]`, using a local `hoursNeeded(speed)` feasibility check
  and shrinking toward the smallest feasible speed.
- `searchMatrix(matrix, target)` treats a row-sorted, column-sorted
  matrix as one flat sorted array by mapping a single binary-search
  index `mid` to `matrix[Math.floor(mid / cols)][mid % cols]`.
- `twoSumSortedTwoPointers` is the first exercise solution: the
  two-pointer half of Pattern 1 in isolation, assuming the input is
  already sorted (LeetCode 167's exact setup).
- `findPeakElement` is the second exercise solution: it shows binary
  search doesn't need a fully sorted array, only a local monotonic
  signal (`nums[mid]` vs `nums[mid+1]`) to decide which half to keep —
  a bonus fourth pattern beyond the three above (LeetCode 162).

## LeetCode practice

- 15. 3Sum (Medium)
- 435. Non-overlapping Intervals (Medium)
- 875. Koko Eating Bananas (Medium)
- 74. Search a 2D Matrix (Medium)

## Key takeaways

- Sorting first is often the key unlock that turns an O(n^2)/O(n^3)
  brute force into an O(n log n) or O(n^2) two-pointer/greedy solution.
- Greedy-after-sort problems usually need the *right* sort key (end
  time for interval scheduling, not start time) — picking the wrong key
  breaks the greedy proof.
- "Binary search on the answer" applies whenever a yes/no feasibility
  check is monotonic in the candidate answer, even with no array in
  sight — recognize this shape (minimize the max / maximize the min
  subject to a check) as a specific pattern of the search-space
  reduction from lesson 04.
- A matrix with sorted rows and sorted columns (each row's first
  element greater than the previous row's last) can be binary searched
  as if it were one flat sorted array.
- Binary search only requires a monotonic *signal*, not full sortedness
  — `findPeakElement` finds a local maximum in unsorted data using the
  same halving logic.

Companion code: [`05-interview-patterns.ts`](./05-interview-patterns.ts)
