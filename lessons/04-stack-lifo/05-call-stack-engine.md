# Stack & the Call Stack

**Objective:** See that function calls in JS are managed by a real stack of call frames, and that recursion can always be re-expressed with an explicit `Stack<T>`.

See also: [00-engine-internals/02-engine-pipeline.md](../00-engine-internals/02-engine-pipeline.md)

## Concept

Every function call pushes a **call frame** (return address, local
variables, arguments) onto the engine's call stack; returning pops it.
Recursive calls make this directly visible: each nested call's frame sits
on top of its caller's frame until it returns.

```
factorialRecursive(5)                 unwind (each return multiplies
                                       and pops its frame):
┌─────────────────────┐ <- top
│ factorialRecursive(1)│               return 1            → pop
├─────────────────────┤
│ factorialRecursive(2)│               return 2 * 1 = 2     → pop
├─────────────────────┤
│ factorialRecursive(3)│               return 3 * 2 = 6     → pop
├─────────────────────┤
│ factorialRecursive(4)│               return 4 * 6 = 24    → pop
├─────────────────────┤
│ factorialRecursive(5)│               return 5 * 24 = 120  → pop
└─────────────────────┘ <- bottom (called from top-level code)
```

The frames grow downward-in-time (deepest call on top) during the
"descending" phase, then unwind top-to-bottom as each call returns —
exactly LIFO. Recurse too deep (no base case, or just very large input)
and the engine throws `RangeError: Maximum call stack size exceeded`
because this stack, like any stack, has finite capacity.

## Complexity

| Operation | Time | Space |
|-----------|------|-------|
| Function call (push frame) | O(1) | O(1) per frame |
| Function return (pop frame) | O(1) | O(1) |
| Recursion depth `d` | — | O(d) call stack space |
| `decodeString` (394) | O(n · maxRepeat) to build output | O(n) stack + output |
| `validateStackSequences` (946) | O(n) | O(n) |

## Walkthrough

`05-call-stack-engine.ts` first defines `factorialRecursive`, an ordinary
recursive function — each call is a real frame on the JS engine's call
stack. `factorialWithExplicitStack` recomputes the same value using
`Stack<number>` from lesson 01, split into the same two phases the engine
performs implicitly: a "descending" `while` loop pushes `n, n-1, ..., 2`
(mirroring frames being pushed before a base case is hit), then an
"unwinding" `while` loop pops and multiplies them into `result` — and
because pop returns values in the reverse order they were pushed, the
multiplications happen in exactly the order the real recursive calls
would return (`2 * 1`, then `* 3`, then `* 4`, then `* 5`).

`decodeString` (**LeetCode 394**) uses the same push-on-enter,
pop-on-return shape for nested `k[...]` groups: a `[` suspends the
current partial string and repeat count (push), and a matching `]`
resumes the enclosing context by folding the completed inner string back
in (pop) — structurally identical to a recursive descent parser, but
written iteratively with an explicit stack instead of relying on the call
stack.

`validateStackSequences` (**LeetCode 946**) checks whether a `pushed`/
`popped` pair of sequences is achievable by any valid stack, by literally
simulating one: replay pushes in order, and greedily pop whenever the top
matches the next expected value in `popped`.

## LeetCode practice

- 394. Decode String (Medium)
- 946. Validate Stack Sequences (Medium)

## Key takeaways

- Every function call is a push; every return is a pop — the call stack
  is a real, size-limited stack, not just a metaphor.
- Any recursive algorithm can be rewritten iteratively with an explicit
  `Stack<T>`, trading implicit call frames for explicit data.
- Deep unbounded recursion risks `RangeError: Maximum call stack size
  exceeded` — an explicit stack on the heap doesn't have that same fixed
  limit (bounded by available memory instead).
- Nested-bracket parsing (394) and call-stack simulation (946) are both
  "replay the push/pop discipline by hand" exercises — the same skill
  needed to reason about recursion depth and correctness.

Companion code: [`05-call-stack-engine.ts`](./05-call-stack-engine.ts)
