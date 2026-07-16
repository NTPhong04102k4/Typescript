# LeetCode Practice Set: Heap

**Objective:** Consolidate every heap pattern from this topic (size-capped heap, streaming top-k, greedy scheduling with a max-heap) against six problems spanning Easy to Medium difficulty.

## Concept

This lesson has no new heap machinery -- it is a deliberate practice set
that recombines patterns already built in lessons 01-07:

- **Size-capped heap** (lesson 05): keep only the best `k` candidates,
  evicting the worst whenever the heap grows past `k`.
- **Streaming version of the same idea** (lesson 05's `705.` mention):
  the heap persists across calls instead of being rebuilt from an array
  each time.
- **Greedy max-heap scheduling** (lesson 04): repeatedly take the
  "currently most urgent" item, mutate it, and push it back if it still
  has work left.

```
Greedy "pop, mutate, maybe push back" shape shared by several problems below:

  while heap has work to do:
    take the current max (or two maxes)
    combine / decrement / place it
    if what's left over still matters -> push it back in
```

Recognizing which of these three shapes a new problem fits is the real
skill this lesson practices -- the heap code itself is only a few lines
different each time.

## Complexity

| Problem                                             | Time            | Space |
|------------------------------------------------------|-----------------|-------|
| `KthLargest` (703) -- `add` per call                  | O(log k)        | O(k) |
| `lastStoneWeight` (1046) -- n stones                  | O(n log n)      | O(n) |
| `kClosest` (973) -- n points, size-capped heap k       | O(n log k)      | O(k) |
| `topKFrequentWords` (692) -- n words, size-capped heap k | O(n log k)   | O(n) map + O(k) heap |
| `reorganizeString` (767) -- string of length n        | O(n log a) where a = distinct chars | O(a) |
| `leastInterval` (621) -- n tasks, cooldown window      | O(n log a)      | O(a) |

## Walkthrough

[`08-leetcode-practice.ts`](./08-leetcode-practice.ts) imports
`MinHeap`/`MaxHeap`/`ascending` from
[`./02-min-max-heap.ts`](./02-min-max-heap.ts). `KthLargest` wraps a
size-capped `MinHeap<number>` exactly like lesson 05's `findKthLargest`,
except the heap persists across `add` calls instead of being rebuilt.
`lastStoneWeight` repeatedly pops the two heaviest stones from a
`MaxHeap<number>` and pushes their (possibly zero) difference back --
the "pop two, combine, maybe push back" shape. `kClosest` is the
size-capped-heap pattern from lesson 05 keyed on squared distance instead
of raw value. `topKFrequentWords` tallies frequency with a `Map`, then
runs a size-capped `MinHeap` whose comparator breaks count ties by
*reverse* alphabetical order (so the alphabetically later word is evicted
first), and finally reverses the popped order to get descending-count,
ascending-alphabetical output. `reorganizeString` and `leastInterval` both
use the greedy `MaxHeap` "take the most frequent remaining character,
place it, cool it down for one round" shape from lesson 04's
`furthestBuilding`, tracking a one-slot (`reorganizeString`) or
fixed-size (`leastInterval`) cooldown buffer for whatever was just used.
`kSmallestStreamStub` is the exercise: mirror `KthLargest`, but track the
`k` *smallest* values seen in a stream with a size-capped `MaxHeap`
instead.

## LeetCode practice

- **703. Kth Largest Element in a Stream** (Easy)
- **1046. Last Stone Weight** (Easy)
- **973. K Closest Points to Origin** (Medium)
- **692. Top K Frequent Words** (Medium)
- **767. Reorganize String** (Medium)
- **621. Task Scheduler** (Medium)

## Key takeaways

- Almost every heap problem is one of three shapes: size-capped top-k,
  a streaming version of the same, or greedy "take the max, mutate,
  maybe push back."
- Ties matter more than they first appear -- `topKFrequentWords` needs a
  secondary alphabetical comparator, not just a count comparator.
- "Cool an item down for `n` rounds before reusing it" (`reorganizeString`,
  `leastInterval`) is the same idea at two different scales: a single
  held-back slot versus a whole cooldown queue.
- Recognizing the shape of a new problem is more valuable than
  memorizing six separate solutions -- the heap plumbing barely changes.

Companion code: [`08-leetcode-practice.ts`](./08-leetcode-practice.ts)
