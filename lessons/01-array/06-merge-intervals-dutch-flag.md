# Merge Intervals & Dutch National Flag Partitioning

**Objective:** Learn two array patterns that both hinge on a single sorted or partitioned pass: merging overlapping ranges, and three-way in-place partitioning.

## Concept

**Merge intervals**: sort by start, then walk once — an interval either
extends the current run or starts a new one:

```
unsorted: [ (8,10) (1,3) (2,6) (15,18) ]

sorted by start:  (1,3)  (2,6)  (8,10)  (15,18)
                     |------|
                  2 <= 3, overlap -> merge to (1,6)

merged:   [ (1,6) | (8,10) | (15,18) ]
             no overlap after (1,6), each becomes its own run
```

**Dutch national flag**: partition an array of three values (classically
0/1/2) into three contiguous zones using three pointers in a single pass —
no extra array needed:

```
nums:  [ 2 | 0 | 2 | 1 | 1 | 0 ]
         low=mid=0                high=5

after partitioning (single pass, swap-based):

       [ 0 | 0 | 1 | 1 | 2 | 2 ]
         ^^^^^   ^^^^^   ^^^^^
         low..mid-1   mid..high   high+1..end
         all 0s        all 1s      all 2s
```

`mid` scans forward; a `0` swaps to the `low` zone and both `low`/`mid`
advance, a `1` just advances `mid`, a `2` swaps to the `high` zone and only
`high` retreats (the swapped-in value still needs to be examined).

## Complexity

| Operation                          | Time        | Space |
|--------------------------------------|-------------|-------|
| `mergeIntervals` (sort + one pass)     | O(n log n)  | O(n)  |
| `sortColors` (Dutch flag, in place)    | O(n)        | O(1)  |
| `insertInterval` (one pass, pre-sorted)| O(n)        | O(n)  |
| `eraseOverlapIntervals` (sort + greedy)| O(n log n)  | O(n)  |

## Walkthrough

`06-merge-intervals-dutch-flag.ts` implements both patterns:

- `mergeIntervals` solves LeetCode 56: sort by start time, then compare
  each interval's start against the last merged interval's end — overlap
  extends it, otherwise a new run begins.
- `sortColors` solves LeetCode 75 with the three-pointer Dutch flag scan
  described above: `low`/`mid`/`high` partition the array into 0s, 1s, and
  2s in a single O(n) pass with O(1) space.
- `insertInterval` (exercise) solves LeetCode 57 by walking three phases
  over an already-sorted, non-overlapping interval list: intervals fully
  before the new one, intervals that overlap and get merged into it, and
  intervals fully after.
- `eraseOverlapIntervals` (exercise) solves LeetCode 435 with a greedy
  scan sorted by *end* time: keeping the interval that ends earliest
  always leaves the most room for what follows, so any interval starting
  before the last kept end must be removed.

## LeetCode practice

- 56. Merge Intervals (Medium)
- 75. Sort Colors (Medium)
- 57. Insert Interval (Medium)
- 435. Non-overlapping Intervals (Medium)

## Key takeaways

- Sorting first turns "do these overlap" into a single linear pass instead
  of comparing every pair.
- Dutch flag partitioning sorts three categories in place in one pass by
  keeping three zones (`low`/`mid`/`high`) instead of using extra buckets.
- For interval-erasure/scheduling problems, sorting by *end* time (not
  start) is the greedy trick that minimizes leftover conflicts.
- Both patterns are O(1) extra space once the input is sorted (or already
  three-valued), which is why they show up often in memory-constrained
  interview variants.

Companion code: [`06-merge-intervals-dutch-flag.ts`](./06-merge-intervals-dutch-flag.ts)
