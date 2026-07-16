# Implementing Stack: Array-Backed vs Node-Backed

**Objective:** Compare two correct ways to implement the `IStack<T>` contract and understand the real trade-offs between them.

## Concept

Both implementations satisfy the exact same interface, but store elements
completely differently.

```
Array-backed (ArrayStack<T>)              Node-backed (NodeStack<T>)

 index: 0   1   2   3                     head
       ┌───┬───┬───┬───┐                   │
       │ 1 │ 2 │ 3 │ 4 │ <- top is         ▼
       └───┴───┴───┴───┘    items[len-1]  ┌───┐    ┌───┐    ┌───┐    ┌───┐
                                          │ 4 │───►│ 3 │───►│ 2 │───►│ 1 │───► null
       contiguous memory,                 └───┘    └───┘    └───┘    └───┘
       may reallocate & copy              each node: heap-allocated,
       when capacity is exceeded          value + next pointer
```

`ArrayStack<T>` treats the end of a `T[]` as the top. JS/V8 arrays grow by
reallocating to a larger backing store once capacity is exceeded, so
`push` is O(1) *amortized*, not O(1) worst-case — most pushes are cheap,
but occasionally one triggers a copy.

`NodeStack<T>` keeps a `head` pointer to a linked chain of nodes. `push`
allocates one new node and repoints `head`; `pop` just reads `head.value`
and moves `head` to `head.next`. There's never a bulk copy, so every
single operation is genuinely O(1) — at the cost of an extra pointer per
element and worse cache locality (nodes can be scattered across the
heap, whereas an array is one contiguous block).

## Complexity

| Operation | ArrayStack (time) | NodeStack (time) | Space (either) |
|-----------|-------------------|-------------------|-----------------|
| `push`    | O(1) amortized    | O(1) worst-case    | O(1) per element |
| `pop`     | O(1)              | O(1)               | O(1) |
| `peek`    | O(1)              | O(1)               | O(1) |
| `isEmpty` | O(1)              | O(1)               | O(1) |
| `size`    | O(1)              | O(1) (tracked counter) | O(1) |
| Overall for `n` elements | — | — | O(n), array is more compact (no per-node pointer overhead) |

## Walkthrough

`02-implementing-stack.ts` imports `IStack<T>` from lesson 01 and provides
two implementations of it: `ArrayStack<T>` (array-backed, same strategy as
lesson 01's `Stack<T>`) and `NodeStack<T>` (backed by a private
`StackNode<T>` chain reachable only through a `head` pointer and a
`count` field for O(1) `size()`).

The run block pushes the same sequence onto both and pops everything off,
asserting the resulting order is identical — proving the two
implementations are behaviorally interchangeable despite the different
backing storage.

`MyStackUsingQueues` solves **LeetCode 225** with a single JS array acting
as a queue: after every `push`, the queue is rotated so the newest element
sits at the front, which makes `shift()` behave like a stack `pop()`.
`MyQueueUsingStacks` solves the mirror problem, **LeetCode 232** — a FIFO
queue built from two `ArrayStack<number>` instances (an "in" stack and an
"out" stack), included here to sharpen the contrast between LIFO and FIFO
composition.

The exercise, `isPalindrome`, pushes every character of a string onto an
`IStack<string>` and then pops while re-scanning the string from the
front: the first pop always yields the *last* character, so comparing
pops against the original string front-to-back is exactly the classic
`s[i] === s[n-1-i]` palindrome check, expressed purely in terms of the
stack interface.

## LeetCode practice

- 225. Implement Stack using Queues (Easy)
- 232. Implement Queue using Stacks (Easy)

## Key takeaways

- `IStack<T>` is a contract, not an implementation — array-backed and
  node-backed stacks are drop-in replacements for each other.
- Array-backed stacks trade occasional resize-and-copy pauses for better
  memory density and cache locality.
- Node-backed stacks trade per-element pointer overhead for uniformly
  O(1) operations with no resizing.
- "Implement X using Y" problems (225, 232) are a good sanity check that
  you understand LIFO vs FIFO at the semantic level, independent of the
  concrete backing store.

Companion code: [`02-implementing-stack.ts`](./02-implementing-stack.ts)
