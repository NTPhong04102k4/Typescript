# Implementing Queue: Array vs Circular Buffer vs Linked List

**Objective:** Compare three ways to back a queue and see why circular buffers and linked lists fix the naive array's O(n) dequeue.

## Concept

The naive array queue from lesson 01 shifts every element left on
`dequeue`. A **circular buffer** avoids that by never physically moving
elements — instead, a `head` index walks forward (wrapping with modulo)
and a `count` tracks occupancy:

```
capacity = 4, head = 1, count = 3

index:   0     1     2     3
buffer: [ D ][ B ][ C ][ _ ]
              ^head        ^ next enqueue writes here (index 0, wrapped)

logical order (front -> rear): B, C, D
tail index = (head + count) % capacity = (1 + 3) % 4 = 0
```

When the buffer is full, it doubles in size and the elements are copied
out starting at `head`, so the logical front-to-rear order is preserved.

A **linked-list queue** sidesteps resizing entirely: `head` and `tail`
pointers let both `enqueue` (append after tail) and `dequeue` (advance
head) run in true O(1), at the cost of one allocation per node instead of
amortized array growth.

## Complexity

| Implementation        | `enqueue` | `dequeue` | Space overhead                  |
|------------------------|-----------|-----------|----------------------------------|
| `ArrayQueue` (naive)   | O(1) amortized | O(n) | none beyond the array            |
| `CircularBufferQueue`  | O(1) amortized | O(1) | occasional 2x buffer during growth |
| `LinkedListQueue`      | O(1)      | O(1)      | one node object per element      |

## Walkthrough

`02-implementing-queue.ts` implements three interchangeable queues:

- `ArrayQueue<T>` — the lesson 01 baseline, included again for direct
  side-by-side comparison.
- `CircularBufferQueue<T>` — tracks `head` and `count` over a fixed-size
  `buffer`. `enqueue` writes to `(head + count) % buffer.length` and
  doubles the buffer via the private `resize` method when full.
  `dequeue` reads `buffer[head]`, clears the slot, and advances
  `head` modulo the buffer length.
- `LinkedListQueue<T>` — a singly linked list of `QueueNode<T>` with
  `head`/`tail` pointers; `enqueue` appends after `tail`, `dequeue`
  advances `head`.

`MyCircularQueue` implements LeetCode 622 directly against the problem's
required method names (`enQueue`, `deQueue`, `Front`, `Rear`, `isEmpty`,
`isFull`), using the same modulo-index trick as `CircularBufferQueue` but
with a fixed, non-growing capacity as the problem specifies.

`queueFromArray` is a small exercise that builds a `LinkedListQueue<T>`
from a plain array, useful for quickly seeding a queue in tests.

## LeetCode practice

- 622. Design Circular Queue (Medium)
- 1670. Design Front Middle Back Queue (Medium)

## Key takeaways

- Shifting an array on every `dequeue` is the bottleneck to eliminate —
  circular buffers and linked lists both fix it, with different tradeoffs.
- A circular buffer needs only `head` and `count` (or `head`/`tail`) to
  know both ends without moving data; modulo arithmetic handles wraparound.
- Linked-list queues avoid resizing entirely but pay per-node allocation
  cost and worse cache locality than a packed array.
- LeetCode's "Design Circular Queue" is essentially `CircularBufferQueue`
  with a fixed capacity and boolean return values instead of `undefined`.

Companion code: [`02-implementing-queue.ts`](./02-implementing-queue.ts)
