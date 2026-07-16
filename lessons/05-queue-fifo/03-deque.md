# Deque (Double-Ended Queue)

**Objective:** Implement a double-ended queue that supports O(1) push/pop at both ends, and see why that generality is useful.

## Concept

A deque relaxes the queue's single-entry-point rule: both ends support
push and pop. It generalizes both a stack (use only one end) and a queue
(push one end, pop the other).

```
pushFront(0)                                    pushBack(4)
     |                                                |
     v                                                v
  [ 0 ][ 1 ][ 2 ][ 3 ]  <-- both ends are O(1) -->  [ 1 ][ 2 ][ 3 ][ 4 ]
     ^head          ^tail                              ^head       ^tail

popFront() removes from the head, popBack() removes from the tail —
neither requires shifting the rest of the structure.
```

Our `Deque<T>` uses a doubly linked list so both ends update pointers
directly, with no shifting or resizing.

## Complexity

| Operation                    | Time | Space |
|-------------------------------|------|-------|
| `pushFront` / `pushBack`      | O(1) | O(1)  |
| `popFront` / `popBack`        | O(1) | O(1)  |
| `peekFront` / `peekBack`      | O(1) | O(1)  |
| `toArray`                     | O(n) | O(n)  |

## Walkthrough

`03-deque.ts` implements `Deque<T>` over a doubly linked list of
`DequeNode<T>` objects. `pushFront`/`pushBack` create a node and relink
`head`/`tail`; `popFront`/`popBack` do the reverse, nulling out the
opposite pointer when the deque becomes empty so `head/tail` stay in sync.

`MyCircularDeque` solves LeetCode 641 with a fixed-capacity circular
buffer instead of a linked list: `insertFront` moves `head` backward
(wrapping with `+ capacity` before the modulo to avoid negative indices),
`insertLast` writes at `(head + count) % capacity`, and `deleteFront`/
`deleteLast` just move `head` forward or shrink `count` — the overwritten
slot is naturally excluded from the next read.

`isPalindromeDeque` is an exercise that repeatedly pops from both ends of
a `Deque<T>` and compares the values; a mismatch means the sequence isn't
a palindrome, and running out of elements (size 0 or 1) means it is.

## LeetCode practice

- 641. Design Circular Deque (Medium)
- 1670. Design Front Middle Back Queue (Medium)

## Key takeaways

- A deque is strictly more capable than a queue or stack — both are
  special cases of using only one end.
- A doubly linked list gives true O(1) at both ends with no amortized
  resizing cost, unlike a growing array.
- Circular-buffer deques need care with `insertFront`: wrap the
  decremented index with `+ capacity` before taking the modulo.
- Deques are the backbone of the monotonic queue pattern in lesson 04.

Companion code: [`03-deque.ts`](./03-deque.ts)
