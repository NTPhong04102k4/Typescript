# Node Fundamentals: struct-like type in TS

**Objective:** Model a linked-list node as a struct-like TypeScript class and use it to build the smallest possible node chains by hand.

## Concept

An array stores elements in one contiguous memory block, so the engine can
compute `arr[i]`'s address directly. A **linked list** instead stores each
element inside its own **node**, and each node holds a pointer (reference)
to the next node. There is no contiguous block — the "list" is really a
chain of independently allocated objects held together by references.

A node is a **struct-like** type: a small bag of fields with no real
behavior of its own. In TypeScript we model it as a class with two public
fields — `value` (the payload) and `next` (a reference to the following
node, or `null` when there is none):

```
Single node:
+-------+------+
| value | next |  -->  another ListNode<T>, or null
+-------+------+

Chain of three nodes (head = first node):

head
 |
 v
+---+---+   +---+---+   +---+---+
| 1 | *-+-->| 2 | *-+-->| 3 |null|
+---+---+   +---+---+   +---+---+
 val next    val next    val next
```

A class (not a plain object literal or interface) is used because linked
structures rely on **reference identity** — `next` must point to the exact
same object in memory, not a structurally-equal copy. `new ListNode(1)` and
`new ListNode(1)` are different nodes even though their `value` fields are
equal; only the pointer stored in `next` decides connectivity.

## Complexity

| Operation                          | Time | Space |
| ----------------------------------- | ---- | ----- |
| Create a node                       | O(1) | O(1)  |
| Read `head.value`                    | O(1) | O(1)  |
| Traverse to the node at index `i`    | O(i) | O(1)  |
| Traverse the whole list (length n)   | O(n) | O(1)  |
| Random access by index (no shortcut) | O(n) | O(1)  |

## Walkthrough

`01-node-fundamentals.ts` defines `ListNode<T>`, the building block reused
by every later lesson in this topic. Two helpers, `arrayToList` and
`listToArray`, convert between plain arrays and node chains so the rest of
the file (and later lessons) can build test fixtures without repetitive
`new ListNode(...)` chains.

Three LeetCode solutions show the struct in action:

- `deleteNode` solves **237. Delete Node in a Linked List** by copying the
  next node's `value` into the current node and skipping over it — a classic
  trick for when you only have a reference to the node to delete, not the
  head.
- `getDecimalValueOfBinaryNumber` solves **1290. Convert Binary Number in a
  Linked List to Integer** by folding `value = value * 2 + node.value` while
  walking `next` pointers.
- `middleNode` solves **876. Middle of the Linked List** by first counting
  the length, then walking `Math.floor(length / 2)` steps from `head` — a
  fundamentals-only approach (the two-pointer version comes in lesson 04).

Two exercises, `countNodes` and `getLastNode`, close out the file with
worked solutions that just walk `next` until it becomes `null`.

## LeetCode practice

- 876. Middle of the Linked List (Easy)
- 1290. Convert Binary Number in a Linked List to Integer (Easy)
- 237. Delete Node in a Linked List (Easy)

## Key takeaways

- A node is a struct: fields only, identity matters more than structural equality.
- `next: ListNode<T> | null` is the entire connectivity mechanism of a linked list — there is no implicit adjacency like in an array.
- Traversal is always O(n) in the worst case because there is no random-access shortcut.
- Helpers like `arrayToList`/`listToArray` make node chains as easy to build and inspect as arrays, which keeps later lessons focused on the pointer logic.
- Deleting "the current node" without a head reference only works because you can overwrite its value and repoint `next` — pure pointer manipulation, no search required.

Companion code: [`01-node-fundamentals.ts`](./01-node-fundamentals.ts)
