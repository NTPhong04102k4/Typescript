# LeetCode Practice Set: Sorting/Searching

**Objective:** Consolidate the topic by solving a spread of real sorting and searching problems, Easy through Hard, each keyed to a technique from the earlier lessons.

## Concept

This lesson is a practice set rather than a new technique. Each problem
below maps back to something already covered:

- **Peak Index in a Mountain Array** — binary search over a local
  monotonic signal (lesson 04/05's `findPeakElement` idea), specialized
  to the guarantee that the array strictly rises then strictly falls.
- **Merge Two Sorted Lists** — the exact two-pointer `merge` step from
  lesson 02's merge sort, applied to a linked list instead of an array.
- **Merge Intervals** — sort by start time, then greedily extend or
  start a new interval (the sibling of lesson 05's sort-by-end-time
  greedy pattern).
- **Search a 2D Matrix II** — a staircase search that starts at the
  top-right corner, eliminating a full row or column each step (a
  different flavor of 2D binary search than lesson 05's flattened-index
  version).
- **K Closest Points to Origin** — sort/partition by a computed key
  (squared distance) instead of the raw value, echoing lesson 01's
  comparator pattern and lesson 02's quickselect.
- **Median of Two Sorted Arrays** — binary search a *partition point*
  across two arrays at once, the hardest form of search-space reduction
  in this topic.

Trace for **Merge Intervals** on `[[1,3], [2,6], [8,10], [15,18]]`
(sorted by start time already):

```
sorted by start: [1,3], [2,6], [8,10], [15,18]

merged = [[1,3]]
[2,6]:  2 <= 3 (last end)  -> extend last to [1, max(3,6)] = [1,6]
[8,10]: 8 <= 6? no         -> push new interval [8,10]
[15,18]:15 <= 10? no       -> push new interval [15,18]

Result: [[1,6], [8,10], [15,18]]
```

## Complexity

| Problem                              | Time                  | Space |
|----------------------------------------|------------------------|-------|
| Peak Index in a Mountain Array        | O(log n)              | O(1)  |
| Merge Two Sorted Lists                | O(m + n)               | O(1) (reuses input nodes) |
| Merge Intervals                       | O(n log n) (sort)      | O(n)  |
| Search a 2D Matrix II                 | O(rows + cols)         | O(1)  |
| K Closest Points to Origin (sort)     | O(n log n)             | O(n)  |
| K Closest Points to Origin (quickselect) | O(n) average, O(n^2) worst | O(n) |
| Median of Two Sorted Arrays           | O(log(min(m, n)))      | O(1)  |

## Walkthrough

`06-leetcode-practice.ts` implements every problem above:

- `peakIndexInMountainArray(arr)` binary searches by comparing
  `arr[mid]` to `arr[mid+1]`.
- `ListNode`, `listFromArray`, and `arrayFromList` are small linked-list
  helpers so `mergeTwoLists(l1, l2)` (the two-pointer merge from lesson
  02, adapted to `next` pointers instead of array indices) can be tested
  without a full linked-list module.
- `mergeIntervals(intervals)` sorts by start time and merges overlapping
  runs, as traced above.
- `searchMatrixII(matrix, target)` starts at the top-right corner and
  moves left when the current value is too big, down when it's too
  small — each step eliminates a whole row or column.
- `kClosest(points, k)` sorts by squared distance and takes the first
  `k`; `kClosestQuickSelect(points, k)` is the exercise solution that
  reuses a Lomuto-style partition (from lesson 02) keyed on squared
  distance to get O(n) average time instead of a full sort.
- `findMedianSortedArrays(nums1, nums2)` binary searches a partition
  index `i` in the shorter array (with `j` determined by `i`) so that
  every element left of the partition is <= every element right of it
  across both arrays combined.
- `canAttendMeetings(intervals)` is the second exercise solution: the
  yes/no version of `mergeIntervals` — sort by start time and check that
  no interval starts before the previous one ends.

## LeetCode practice

- 852. Peak Index in a Mountain Array (Easy)
- 21. Merge Two Sorted Lists (Easy)
- 56. Merge Intervals (Medium)
- 240. Search a 2D Matrix II (Medium)
- 973. K Closest Points to Origin (Medium)
- 4. Median of Two Sorted Arrays (Hard)

## Key takeaways

- Most "hard" search problems are still binary search — the hard part is
  finding the right monotonic signal or partition point to search over
  (`findMedianSortedArrays` searches a partition index, not a value).
- The same merge-step logic (lesson 02) works identically on arrays and
  linked lists; only the "advance a pointer" operation changes (`i++` vs
  `node = node.next`).
- Staircase search (top-right corner) is a distinct pattern from
  flattened-index binary search — both work on sorted matrices, but
  staircase search doesn't require *fully* sorted rows/columns relative
  to each other, just sorted within each row and column.
- Sorting by a computed key (distance, end time, custom comparator) is
  the same technique as sorting by value; only the comparator changes.
- Quickselect (lesson 02) generalizes beyond "kth largest number" to
  "kth closest by any distance function" — the partition step doesn't
  care what the key means.

Companion code: [`06-leetcode-practice.ts`](./06-leetcode-practice.ts)
