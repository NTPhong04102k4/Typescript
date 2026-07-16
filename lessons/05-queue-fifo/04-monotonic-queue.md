# Monotonic Queue / Sliding Window Maximum

**Objective:** Use a deque that keeps its contents monotonically ordered to answer sliding-window max/min queries in amortized O(1) per step.

## Concept

A monotonic queue stores **indices**, kept in an order where the
corresponding values are strictly decreasing (for a max-queue) from front
to back. Any index whose value is smaller than a newer value can never be
the answer for a window covering both, so it's evicted from the back
before the new index is pushed:

```
nums:    [1, 3, -1, -3, 5]
window k=3, processing index 4 (value 5):

before:  deque (indices) = [3, 4?]  values = [-3]        (1 and 3's indices already evicted)
push 4:  5 >= nums[back], so pop back entries with value <= 5 first
         deque becomes [] then [4]                        values = [5]

front of deque (index 4) is always the max of the current window,
because anything smaller sitting behind it in value was already discarded.
```

The front is also checked against the window's left edge (`i - k`) and
popped if it has fallen out of range — that's the only way elements leave
from the front.

## Complexity

| Operation                          | Time (total over n) | Space |
|-------------------------------------|----------------------|-------|
| `maxSlidingWindow` / `longestSubarray` | O(n) — each index pushed/popped once | O(k) |
| Naive max-per-window (recompute)    | O(n·k)               | O(1)  |

Each index enters and leaves the deque at most once, so the total work
across the whole array is O(n), not O(n·k).

## Walkthrough

`04-monotonic-queue.ts` imports `Deque` from lesson 03 and reuses it as
the backing structure for every function.

`maxSlidingWindow` (LeetCode 239) keeps indices in decreasing order of
`nums` value. Before pushing index `i`, it pops from the back while the
back's value is `<=` `nums[i]` — those values can never win once `i` is in
the window. It also pops from the front once the front index falls behind
`i - k`. Once `i >= k - 1`, `nums[indices.peekFront()]` is the window max.

`longestSubarray` (LeetCode 1438) runs the same idea twice: `maxDeque`
(decreasing) and `minDeque` (increasing) track the window's current max
and min by index. Whenever `max - min > limit`, the window shrinks from
the left (`left++`), evicting front indices from either deque that fell
behind `left`.

`firstNegativeInWindow` is an exercise variant: it only tracks indices of
negative numbers (already naturally increasing since indices are pushed in
order), evicting from the front once they fall out of the window, and
reports `0` when the deque is empty.

## LeetCode practice

- 239. Sliding Window Maximum (Hard)
- 1438. Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit (Medium)
- 862. Shortest Subarray with Sum at Least K (Hard)

## Key takeaways

- A monotonic queue trades a small amount of bookkeeping for amortized
  O(1) per element instead of recomputing a window's max/min from scratch.
- Evict from the back based on **value** (to maintain monotonicity) and
  from the front based on **position** (to respect the window bound).
- The same pattern generalizes to two deques for simultaneous max and min
  tracking, as in `longestSubarray`.
- Because the deque holds indices, not values, it can always recover both
  the value (`nums[index]`) and whether the index is still in range.

Companion code: [`04-monotonic-queue.ts`](./04-monotonic-queue.ts)
