# Stack Fundamentals & LIFO

**Objective:** Understand the Last-In-First-Out (LIFO) principle and the minimal push/pop/peek contract every stack implementation shares.

## Concept

A stack only allows access at one end, called the **top**. You can add
(`push`) or remove (`pop`) an element there, and look at it without
removing it (`peek`). The element that was pushed most recently is always
the first one to come off — Last In, First Out.

```
push(1)      push(2)      push(3)       pop() -> 3     pop() -> 2
  ┌───┐        ┌───┐        ┌───┐          ┌───┐          ┌───┐
  │   │        │ 2 │ <-top  │ 3 │ <-top    │ 2 │ <-top    │   │
  ├───┤        ├───┤        ├───┤          ├───┤          ├───┤
  │   │        │ 1 │        │ 2 │          │ 1 │          │ 1 │ <-top
  ├───┤        ├───┤        ├───┤          ├───┤          ├───┤
  │   │        │   │        │ 1 │          │   │          │   │
  └───┘        └───┘        └───┘          └───┘          └───┘
```

Every operation only ever touches the top element — you cannot reach into
the middle without first popping everything above it. That restriction is
exactly what makes stacks useful: it models "undo the most recent thing"
(function calls, undo/redo, matching brackets) far more precisely than a
general-purpose array would.

## Complexity

| Operation | Time | Space |
|-----------|------|-------|
| `push`    | O(1) amortized | O(1) per element |
| `pop`     | O(1) | O(1) |
| `peek`    | O(1) | O(1) |
| `isEmpty` | O(1) | O(1) |
| `size`    | O(1) | O(1) |
| Overall storage for `n` elements | — | O(n) |

## Walkthrough

`01-stack-fundamentals.ts` defines the `IStack<T>` interface — the
contract (`push`, `pop`, `peek`, `isEmpty`, `size`) that every stack
variant in this topic implements — and `Stack<T>`, the simplest
array-backed implementation. Under the hood it wraps a private `T[]` and
treats the *end* of the array as the top, so `push`/`pop` reuse the
engine's already-optimized array operations.

`isValid` solves **LeetCode 20** by pushing opening brackets and, on a
closing bracket, checking that it matches whatever is on top of the
stack — if the stack is empty or the top doesn't match, the string is
invalid immediately.

The exercise, `reverseStringWithStack`, pushes every character then pops
them all off — since pop always returns the most-recently-pushed
character, that unwinding order is the reverse of the input.

## LeetCode practice

- 20. Valid Parentheses (Easy)
- 1047. Remove All Adjacent Duplicates In String (Easy)
- 682. Baseball Game (Easy)

## Key takeaways

- A stack exposes only one access point (the top); everything else is
  hidden, which is the source of its LIFO guarantee.
- Array-backed stacks get O(1) amortized push/pop for free because they
  operate on the end of the underlying array.
- Bracket/nesting validation is the canonical "hello world" of stacks:
  push on open, match-and-pop on close.
- Reversal-by-stack is a useful mental model for how recursion unwinds
  (previewed further in lesson 05).

Companion code: [`01-stack-fundamentals.ts`](./01-stack-fundamentals.ts)
