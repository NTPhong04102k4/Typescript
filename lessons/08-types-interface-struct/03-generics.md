# Generics for reusable DSA structures

**Objective:** Write one `Stack<T>`/`Queue<T>`/`Pair<A, B>` implementation that works for any element type, instead of duplicating code per type or falling back to `any`.

## Concept

A **generic** is a type-level placeholder, filled in at the call site. It
lets a single implementation of `Stack` serve `Stack<number>`,
`Stack<string>`, or `Stack<TreeNode>` without losing type safety (`any`
would compile but silently allow bugs like pushing a string into a number
stack).

```
class Stack<T> {              Stack<number>        Stack<string>
  push(item: T): void          +-------+             +-------+
  pop(): T | undefined         |   3   |             | "c"   |
}                               |   2   |             | "b"   |
                                |   1   |             | "a"   |
                                +-------+             +-------+
                                 T = number            T = string
```

Two refinements matter for DSA code:

- **Bounded generics** (`<T extends HasLength>`) restrict T to shapes that
  support the operation the generic function needs — `longest` can compare
  `.length` on strings, arrays, or any custom struct.
- **F-bounded polymorphism** (`<T extends Comparable<T>>`) lets a type
  refer to itself in its own constraint — `maxOf` works on any `T` that
  knows how to compare itself to another `T`.

## Complexity

| Operation | Time | Note |
| --- | --- | --- |
| `Stack.push` / `Stack.pop` (array-backed) | O(1) amortized | same as a plain array `push`/`pop` |
| `Queue.enqueue` (array-backed) | O(1) amortized | plain array `push` |
| `Queue.dequeue` (array-backed, `Array.shift`) | O(n) | every remaining element is re-indexed; topic 05 fixes this with a circular buffer |
| `mapStack`, `filterStack` | O(n) | one pass over the stack's snapshot |
| `maxOf` | O(n) | one pass, one `compareTo` call per element |

## Walkthrough

`03-generics.ts` defines `Stack<T>` and `Queue<T>` (array-backed, with a
`toArray()` escape hatch used by the generic helpers), and `Pair<A, B>`
with a type-flipping `swap()`.

`HasLength` + `longest<T extends HasLength>` show a bounded generic;
`mapStack<T, U>` shows a generic *algorithm* over a generic *structure*,
producing a `Stack<U>` from a `Stack<T>`.

`Comparable<T>` + `maxOf<T extends Comparable<T>>` show F-bounded
polymorphism; `Money implements Comparable<Money>` is a concrete example
comparing by `.cents`.

The exercises add `filterStack` (keep only matching items, same order) and
`firstOrDefault` (first element or a fallback for an empty array).

## LeetCode practice

- 155. Min Stack (Medium) — extends exactly this `Stack<T>` shape with an auxiliary min-tracking stack.
- 232. Implement Queue using Stacks (Easy) — composes two `Stack<T>` instances to build a `Queue<T>`-like interface.
- 215. Kth Largest Element in an Array (Medium) — a generic max/top-k selection, the same shape as `maxOf` generalized to "k-th" instead of "largest."

## Key takeaways

- Generics avoid duplicating `Stack`/`Queue`/`Pair` per element type without giving up compile-time checking (`any` would not catch misuse).
- Bounded generics (`extends HasLength`) let a function accept "anything with this shape," not just one concrete type.
- F-bounded polymorphism (`extends Comparable<T>`) is the standard pattern for "types that can compare themselves."
- `Queue.dequeue` backed by `Array.shift` is O(n) — fine for lessons, but topic 05 replaces it with a circular buffer for real O(1) dequeue.
- Generic algorithms (`mapStack`, `filterStack`) operating over generic structures are what make a "mini DSA library" (lesson 06) actually reusable.

Companion code: [`03-generics.ts`](./03-generics.ts)
