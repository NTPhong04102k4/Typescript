# Doubly Linked List Implementation

**Objective:** Add a `prev` pointer to the node struct to get O(1) tail removal and bidirectional traversal, and use it to solve node-with-extra-pointer LeetCode problems.

## Concept

The singly linked list's weak spot was `popBack`: without a `prev` pointer,
finding the node before the tail costs a full walk from `head`. A **doubly
linked list** node adds a second pointer, `prev`, so every node knows both
its neighbors:

```
head                                        tail
 |                                            |
 v                                            v
     +------+   +------+   +------+   +------+
null<-| 1    |<->| 2    |<->| 3    |<->| 4    |->null
     +------+   +------+   +------+   +------+
     v  ^ n     v  ^ n     v  ^ n     v  ^ n
     prev|next  prev|next  prev|next  prev|next

Each node: { prev, value, next } — a bidirectional chain.
```

Because every node can be unlinked using only a reference to *itself* (relink
`node.prev.next` and `node.next.prev`, no search required), operations that
were O(n) in the singly linked list — removing the last node, or removing an
arbitrary known node — become O(1). This is exactly the property the LRU
cache in lesson 07 depends on: a `Map` gives O(1) lookup of *which* node to
remove, and the doubly linked list gives O(1) removal of that node once
found.

`get(index)` can also be smarter than the singly linked version: since both
ends are reachable, it walks from whichever end is closer to the target
index.

## Complexity

| Operation                              | Time     | Space |
| --------------------------------------- | -------- | ----- |
| `pushFront` / `pushBack`                | O(1)     | O(1)  |
| `popFront` / `popBack`                  | O(1)     | O(1)  |
| `get(index)` (walks from the nearer end) | O(n)     | O(1)  |
| `insertAt` / `removeAt` (locate + relink) | O(n)   | O(1)  |
| Remove an already-known node (`spliceOut`) | O(1)   | O(1)  |
| `toArray` / `reverseToArray`             | O(n)     | O(n)  |

## Walkthrough

`03-doubly-linked-list.ts` defines `DoublyListNode<T>` (value, `prev`,
`next`) and wraps it in `DoublyLinkedList<T>`. `pushFront`/`pushBack` and
`popFront`/`popBack` are all O(1) by directly rewiring `head`/`tail`. The
private `nodeAt` helper picks the shorter side to walk from, based on
whether `index` is in the first or second half of the list, and backs
`get`, `insertAt`, and `removeAt`. `reverseToArray` walks from `tail` via
`prev` to demonstrate that traversal now works in both directions.

Three LeetCode solutions use a node shape with an extra pointer, the same
idea as `prev`:

- `flattenMultilevelList` solves **430. Flatten a Multilevel Doubly Linked
  List** by splicing each node's `child` sub-list in between it and its
  `next`, rewiring `prev`/`next` at both splice points.
- `copyRandomList` solves **138. Copy List with Random Pointer** using a
  `Map<RandomListNode, RandomListNode>` from original nodes to their clones
  so `random` pointers can be rewired in a second pass.
- `BrowserHistory` solves **1472. Design Browser History** by reusing
  `DoublyListNode<string>` directly: `visit` appends and truncates forward
  history, `back`/`forward` just walk `prev`/`next`.

The standalone `spliceOut` function is the O(1)-removal trick called out
above, and `isPalindromeDoublyList` is a bidirectional two-pointer check
that needs no extra array.

## LeetCode practice

- 430. Flatten a Multilevel Doubly Linked List (Medium)
- 138. Copy List with Random Pointer (Medium)
- 1472. Design Browser History (Medium)

## Key takeaways

- A `prev` pointer turns tail removal and "remove this exact node" from O(n) into O(1) — the core trade a doubly linked list makes for one extra pointer per node.
- `get(index)` can walk from whichever end is nearer, roughly halving the average traversal distance versus a singly linked list.
- Splicing a node out only requires relinking its two neighbors — no search needed if you already hold the node reference, which is exactly how the LRU cache in lesson 07 achieves O(1) eviction.
- Multi-pointer node shapes (`child` in problem 430, `random` in problem 138) are natural extensions of the same struct-with-pointers idea from lesson 01.
- Bidirectional traversal enables two-pointer tricks (like palindrome checking) directly on the list, without copying into an array first.

Companion code: [`03-doubly-linked-list.ts`](./03-doubly-linked-list.ts)
