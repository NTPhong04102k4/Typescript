# Queue Fundamentals & FIFO

**Objective:** Understand the First-In-First-Out contract and see it implemented as a minimal array-backed `Queue<T>`.

## Concept

A queue only allows insertion at the **rear** and removal at the **front**.
Whatever goes in first comes out first — the opposite discipline from a
stack. Think of a checkout line: the person who joined first is served
first, no matter how many people join behind them.

```
enqueue(D) ---->  [ A | B | C ]  ----> dequeue() returns A
                    ^front   ^rear

after enqueue(D):  [ A | B | C | D ]
                     ^front       ^rear

after dequeue():   [ B | C | D ]
                     ^front   ^rear
```

Two pointers matter conceptually: **front** (next to leave) and **rear**
(where new items are appended). A naive array implementation moves the
front pointer by physically shifting every remaining element left, which
is correct but wasteful — that cost is the motivation for lesson 02.

## Complexity

| Operation       | Time (naive array) | Space |
|-----------------|---------------------|-------|
| `enqueue`       | O(1) amortized      | O(1)  |
| `dequeue`       | O(n)                | O(1)  |
| `peek`          | O(1)                | O(1)  |
| `isEmpty`/`size`| O(1)                | O(1)  |

The O(n) `dequeue` comes from `Array#shift`, which re-indexes every
remaining element. This is acceptable for small queues and for building
intuition, but production code should use the circular buffer or
linked-list queue from lesson 02.

## Walkthrough

`01-queue-fundamentals.ts` defines `QueueLike<T>`, the interface every
queue in this topic will implement (`enqueue`, `dequeue`, `peek`, `size`,
`isEmpty`), and `Queue<T>`, a straightforward array-backed implementation
using `push`/`shift`.

`reverseFirstK` is a generic exercise: it drains the first `k` elements
into an auxiliary stack (reversing their order), re-enqueues them, then
rotates the untouched remainder back to the rear so relative order among
the rest is preserved.

`countStudents` solves LeetCode 1700 by modeling the line of students as a
`Queue<number>`. Each iteration dequeues the front student and compares
their preference against the current top sandwich (`sandwiches[sandwichIndex]`).
A match advances the sandwich pointer and resets the rotation counter; a
mismatch re-enqueues the student at the back. If a full rotation
(`rotationsWithoutMatch === queue.size`) happens with no match, nobody left
in the queue wants the current sandwich, so the loop stops and the
remaining `queue.size` is returned.

## LeetCode practice

- 232. Implement Queue using Stacks (Easy)
- 1700. Number of Students Unable to Eat Lunch (Easy)
- 225. Implement Stack using Queues (Easy)

## Key takeaways

- A queue's contract is FIFO: insert at the rear, remove from the front.
- Array-backed queues are simple but pay O(n) per `dequeue` because of
  re-indexing — fine for learning, not for hot paths.
- Many "simulate a line of people/items" problems (like LeetCode 1700) map
  directly onto queue rotation logic.
- `size` and `isEmpty` should always be O(1) so callers can loop safely.

Companion code: [`01-queue-fundamentals.ts`](./01-queue-fundamentals.ts)
