# Min-Heap & Max-Heap Implementation

**Objective:** Implement a generic, comparator-driven `MinHeap<T>` and derive `MaxHeap<T>` from it without duplicating logic.

## Concept

A `MinHeap` keeps the smallest element (per a comparator) at index 0. Two
operations maintain the heap property:

- **Sift-up** (used by `push`): put the new value at the end of the array,
  then repeatedly swap it with its parent while it's smaller than that
  parent.
- **Sift-down** (used by `pop`): move the last element to the root, then
  repeatedly swap it with its smallest child while it's bigger than that
  child.

```
push(1) into [5, 3, 8, 9]   (insert at end, then sift UP)

  step 0: append          step 1: compare with parent(idx1=3)     step 2: compare with parent(idx0=5)
        5                       5                                       1
       / \                     / \                                     / \
      3   8        ->         3   8              ->                   3   8
     / \                     /                                       /
    9   1                   1 <-swap with 3                         5 <-swap with 3
  (idx3) new leaf         [5, 1, 8, 9, 3]                          [1, 3, 8, 9, 5]

pop() from a min-heap        (move last to root, then sift DOWN)

  before: root=1 removed    after: last(5) placed at root      sift down: swap with
  [1, 3, 8, 9, 5]            [5, 3, 8, 9]                       smaller child (3)
                                                                 [3, 5, 8, 9]
```

`MaxHeap<T>` needs the exact same array mechanics, just with "bigger wins."
Rather than re-implement sift-up/down, it wraps a `MinHeap<T>` and flips the
comparator: `(a, b) => compare(b, a)`. Whatever the min-heap treats as
"smallest" under the flipped comparator is the original "largest" — so the
max element floats to the root for free.

## Complexity

| Operation                | Time      | Space |
|---------------------------|-----------|-------|
| `push` (insert)            | O(log n)  | O(1) amortized |
| `pop` (extract root)       | O(log n)  | O(1) |
| `peek` (read root)         | O(1)      | O(1) |
| Build from `initial` array (this lesson's naive push loop) | O(n log n) | O(n) |
| `size` / `isEmpty`         | O(1)      | O(1) |

## Walkthrough

[`02-min-max-heap.ts`](./02-min-max-heap.ts) defines `Comparator<T>` plus
`ascending`/`descending` helpers for numbers. `MinHeap<T>` stores elements
in a private `data` array and exposes `push`, `pop`, `peek`, `size`,
`isEmpty`, and `toArray`. `push` appends then calls the private `siftUp`;
`pop` swaps the root with the last element, shrinks the array, and calls
the private `siftDown`. The constructor accepts an `initial` array and
builds the heap by pushing each element one at a time — simple, but
O(n log n) overall (lesson 03 replaces this with an O(n) heapify).
`MaxHeap<T>` holds a private `inner: MinHeap<T>` built with an inverted
comparator and just forwards every method to it — no duplicated sift
logic. The `peekReplace` exercise composes `pop` + `push` into one call.

## LeetCode practice

- **215. Kth Largest Element in an Array** (Medium) — a min-heap of size k
  (lesson 05) is the classic use of this exact `MinHeap`.
- **1046. Last Stone Weight** (Easy) — repeatedly pop the two largest
  stones from a `MaxHeap<number>` (lesson 08).
- **703. Kth Largest Element in a Stream** (Easy) — wraps a `MinHeap<number>`
  of size k behind a small class (lesson 08).

## Key takeaways

- Sift-up fixes the heap property upward from a newly inserted leaf;
  sift-down fixes it downward from a newly placed root.
- Both operations only ever touch one root-to-leaf path, so each is
  O(log n).
- `MaxHeap` doesn't need its own sift logic — inverting the comparator and
  delegating to `MinHeap` is enough.
- A comparator-based design means the heap works over any type `T`, not
  just numbers.
- Building a heap by pushing elements one at a time is correct but costs
  O(n log n); lesson 03 shows the O(n) alternative.

Companion code: [`02-min-max-heap.ts`](./02-min-max-heap.ts)
