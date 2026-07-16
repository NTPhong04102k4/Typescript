# Top-K Problems Using a Heap

**Objective:** Solve "find the k largest/smallest/most-frequent items" in O(n log k) by keeping a size-capped heap instead of sorting everything.

## Concept

Sorting the whole input to find the top k costs O(n log n). A heap does
better: keep a **min-heap capped at size k** while scanning. Once the heap
has k elements, anything smaller than its root cannot be in the top k, so
the root is evicted whenever the heap grows past k. What survives at the
end is exactly the k largest elements, and the root is the k-th largest.

```
findKthLargest([3, 2, 1, 5, 6, 4], k=2)   (min-heap capped at size 2)

push 3        -> {3}
push 2        -> {3, 2}                 size == k, no eviction yet
push 1        -> {3, 2, 1} -> evict min(1) -> {3, 2}
push 5        -> {3, 2, 5} -> evict min(2) -> {3, 5}
push 6        -> {3, 5, 6} -> evict min(3) -> {5, 6}
push 4        -> {5, 6, 4} -> evict min(4) -> {5, 6}

final heap = {5, 6}, root (min of the two) = 5  -> the 2nd largest value
```

Why a min-heap for "k largest"? Because the value you want to discard
first is the *smallest* one still standing — that's always the min-heap's
root, so eviction is O(log k) instead of O(k). For "k smallest," flip it:
keep a **max-heap** capped at size k and evict the current max.

## Complexity

| Operation                              | Time         | Space |
|-------------------------------------------|--------------|-------|
| `findKthLargest` (n elements, heap size k) | O(n log k)   | O(k) |
| `topKFrequent` (n elements, heap size k)   | O(n log k)   | O(n) for the frequency map + O(k) heap |
| `findKthSmallest` (max-heap size k)        | O(n log k)   | O(k) |
| Naive full sort + slice                    | O(n log n)   | O(n) |

## Walkthrough

[`05-top-k.ts`](./05-top-k.ts) imports `MinHeap`/`MaxHeap` from
[`./02-min-max-heap.ts`](./02-min-max-heap.ts). `findKthLargest` pushes
every number into a size-capped `MinHeap<number>`, popping whenever the
size exceeds `k`; the final root is the answer. `topKFrequent` first
tallies counts with a `Map<number, number>`, then runs the exact same
size-capped-heap pattern keyed on `[value, count][1]` (the count).
`findKthSmallestStub` is the exercise: mirror `findKthLargest` but with a
`MaxHeap` instead, since discarding the current maximum is what keeps the
k smallest values.

## LeetCode practice

- **215. Kth Largest Element in an Array** (Medium)
- **347. Top K Frequent Elements** (Medium)
- **703. Kth Largest Element in a Stream** (Easy) — the streaming version
  of the same size-capped min-heap (lesson 08).
- **973. K Closest Points to Origin** (Medium) — same pattern keyed on
  squared distance (lesson 08).

## Key takeaways

- "Top k" almost never needs a full sort — a heap capped at size k gets
  you there in O(n log k).
- Min-heap for "k largest," max-heap for "k smallest" — you always evict
  whichever extreme you *don't* want to keep.
- The heap only ever holds k elements at once, so space is O(k) beyond
  whatever bookkeeping (like a frequency map) the problem needs.
- This pattern generalizes to any "rank by some derived key" problem —
  frequency, distance, priority — by changing the comparator.

Companion code: [`05-top-k.ts`](./05-top-k.ts)
