# Mixed Practice Set 2 (Medium, Cross-Topic)

**Objective:** Combine two structures per problem (array+sort, map+list, graph+queue) to solve five unrelated Medium problems.

## Concept

Medium problems typically need **two ideas working together**, not one:
sort-then-sweep, hash-map-plus-recency-order, or graph-plus-BFS-ordering.
This set deliberately spans five different combinations:

```
Merge Intervals ............ array + sort (sweep after sorting by start)
LRU Cache ................... map (insertion order doubles as recency order)
Course Schedule .............. graph + queue (topological sort / Kahn's algorithm)
Kth Largest Element in Array . array + sort (or heap/quickselect)
Longest Substring w/o Repeats  string + map (sliding window + last-seen index)
```

The topological sort for Course Schedule is worth tracing once by hand: a
node with in-degree 0 has no unmet prerequisites, so it's safe to "take"
first. Removing it can drop a neighbor's in-degree to 0, unlocking it next.
If every node is eventually removed, there's no cycle and all courses are
finishable.

```
prerequisites = [[1,0]]   (take course 1 only after course 0)

adjacency: 0 -> [1]        in-degree: 0:0   1:1

queue = [0]  (in-degree 0)
  take 0 -> decrement 1's in-degree to 0 -> queue = [1]
  take 1 -> queue = []
visited count = 2 = numCourses -> canFinish = true
```

## Complexity

| Problem                                              | Time                | Space         |
|--------------------------------------------------------|---------------------|---------------|
| `mergeIntervals` (56. Merge Intervals)                  | O(n log n)          | O(n)          |
| `LRUCache.get`/`put` (146. LRU Cache)                    | O(1) average        | O(capacity)   |
| `canFinish` (207. Course Schedule)                       | O(V + E)            | O(V + E)      |
| `findKthLargest` (215. Kth Largest Element in an Array)  | O(n log n)          | O(n)          |
| `lengthOfLongestSubstring` (3. Longest Substring Without Repeating Characters) | O(n) | O(min(n, charset)) |

## Walkthrough

`04-mixed-practice-medium.ts`:

- `mergeIntervals(intervals)` sorts by start time, then sweeps once: if the
  current interval's start is within the last merged interval's end, extend
  the end; otherwise start a new merged interval.
- `LRUCache` uses a single `Map<number, number>`. JS `Map` preserves
  insertion order, so `get` deletes-then-reinserts the accessed key to mark
  it most-recently-used, and `put` evicts `cache.keys().next().value` (the
  oldest key) when over capacity.
- `canFinish(numCourses, prerequisites)` builds an adjacency list and an
  in-degree array, then runs Kahn's algorithm: repeatedly dequeue a
  zero-in-degree course, decrement its neighbors' in-degrees, and enqueue
  any that reach zero. If every course gets visited, there's no cycle.
- `findKthLargest(nums, k)` sorts descending and reads index `k - 1` — the
  straightforward O(n log n) solution; a heap of size `k` or quickselect
  would improve this to O(n log k) / average O(n), the same trade-off as
  `KthLargest` in lesson 03.
- `lengthOfLongestSubstring(s)` slides a window `[start, end]` across the
  string, using a `Map<char, lastIndex>` to jump `start` forward past any
  repeated character instead of shrinking the window one step at a time.
- `numIslands(grid)` (exercise) solves LeetCode 200 with DFS flood-fill:
  each unvisited `'1'` starts a new island and floods every connected `'1'`.
- `productExceptSelf(nums)` (exercise) solves LeetCode 238 with two passes
  (prefix products, then suffix products) and no division.

## LeetCode practice

- 56. Merge Intervals (Medium)
- 146. LRU Cache (Medium)
- 207. Course Schedule (Medium)
- 215. Kth Largest Element in an Array (Medium)
- 3. Longest Substring Without Repeating Characters (Medium)

## Key takeaways

- Sorting first turns many interval/array problems into a single linear
  sweep — look for "overlapping" or "kth" language as a sorting signal.
- A `Map`'s insertion-order guarantee is a free recency tracker; you don't
  need a separate doubly linked list to implement LRU in JS/TS.
- Topological sort (Kahn's algorithm) both detects cycles and produces a
  valid ordering in one BFS pass — "can all nodes be visited" is the same
  question as "is this DAG cycle-free."
- Sliding window + last-seen-index map turns an O(n^2) substring scan into
  O(n) by jumping the window boundary instead of stepping it one at a time.

Companion code: [`04-mixed-practice-medium.ts`](./04-mixed-practice-medium.ts)
