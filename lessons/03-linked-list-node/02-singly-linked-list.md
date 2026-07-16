# Singly Linked List Implementation

**Objective:** Build a generic singly linked list class on top of `ListNode<T>` and use it to solve classic single-direction list problems.

## Concept

A singly linked list keeps a `head` pointer to the first node and (for
O(1) appends) a `tail` pointer to the last node. Every node only knows
about the node *after* it — there is no way to walk backwards, which is
the defining constraint of "singly" linked:

```
head                                   tail
 |                                       |
 v                                       v
+---+---+   +---+---+   +---+---+   +---+------+
| 1 | *-+-->| 2 | *-+-->| 3 | *-+-->| 4 | null  |
+---+---+   +---+---+   +---+---+   +---+------+

Only forward links exist: node[i] -> node[i+1]. To reach node[i-1] from
node[i] you must restart the walk from head.
```

This one-directional constraint drives every design decision in the
implementation: appending to the tail is cheap because we cache a `tail`
pointer, but removing the *last* node is expensive because finding the
node just before it requires a full walk from `head` (there is no `prev`
pointer to shortcut with — that gap is exactly what motivates the doubly
linked list in the next lesson).

## Complexity

| Operation                     | Time | Space |
| ------------------------------ | ---- | ----- |
| `pushFront`                    | O(1) | O(1)  |
| `pushBack` (with cached tail)   | O(1) | O(1)  |
| `popFront`                     | O(1) | O(1)  |
| `popBack` (no `prev` pointer)   | O(n) | O(1)  |
| `get(index)` / `insertAt` / `removeAt` | O(n) | O(1) |
| `toArray` / iteration           | O(n) | O(n)  |

## Walkthrough

`02-singly-linked-list.ts` imports `ListNode<T>` from lesson 01 and wraps it
in `SinglyLinkedList<T>`, which tracks `head`, `tail`, and `length` as
private fields. `pushFront` and `pushBack` are O(1) thanks to the cached
`tail`; `popBack` has to walk from `head` to find the second-to-last node
before it can drop the last one, which is called out explicitly as the
list's weak spot. `get`, `insertAt`, and `removeAt` all walk from `head` by
index. The class also implements `[Symbol.iterator]`, so any
`SinglyLinkedList` can be used directly in a `for...of` loop or spread into
an array.

Three LeetCode solutions build directly on `ListNode<T>`:

- `removeDuplicatesFromSortedList` solves **83. Remove Duplicates from
  Sorted List** by comparing each node to its neighbor and splicing
  duplicates out.
- `removeElements` solves **203. Remove Linked List Elements** using a
  dummy head node to uniformly handle deletions at the front of the list.
- `addTwoNumbers` solves **2. Add Two Numbers**, walking two lists in
  lockstep while tracking a carry digit.

Finally, `MyLinkedList` implements the exact API required by **707. Design
Linked List** (`get`, `addAtHead`, `addAtTail`, `addAtIndex`,
`deleteAtIndex`) directly on top of `ListNode<T>`, showing the same ideas
in the shape LeetCode's judge expects.

## LeetCode practice

- 707. Design Linked List (Medium)
- 83. Remove Duplicates from Sorted List (Easy)
- 203. Remove Linked List Elements (Easy)
- 2. Add Two Numbers (Medium)

## Key takeaways

- A cached `tail` pointer turns `pushBack` from O(n) into O(1); a cached `head` alone cannot do the same for `popBack`.
- A dummy/sentinel head node removes the special case of "the node to delete is the head" — a pattern worth memorizing.
- Every structural change (`insertAt`, `removeAt`, `popFront`) is a small, local pointer rewire — no shifting of other elements like an array requires.
- The one-directional link is the list's core limitation: anything that needs "the previous node" costs a full re-walk, which motivates the doubly linked list in lesson 03.
- Implementing `[Symbol.iterator]` lets a custom structure interoperate with native `for...of`, spread, and `Array.from`.

Companion code: [`02-singly-linked-list.ts`](./02-singly-linked-list.ts)
