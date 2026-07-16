# Min-Stack & Multi-Stack Designs

**Objective:** Design stacks that answer extra questions (current minimum, per-value frequency) in O(1) by keeping auxiliary stacks in sync with the main one.

## Concept

The trick behind all of these designs is the same: don't recompute the
extra piece of information — maintain a **parallel stack** that already
has the answer at its top.

```
push(-2)        push(0)         push(-3)        pop()
stack:  [-2]    stack:  [-2,0]  stack: [-2,0,-3] stack:  [-2,0]
min  :  [-2]    min  :  [-2,-2] min  : [-2,-2,-3] min  :  [-2,-2]
         ^top            ^top            ^top             ^top
       getMin()=-2     getMin()=-2     getMin()=-3      getMin()=-2
```

`minStack` grows and shrinks in exact lockstep with `stack`, so
`minStack`'s top is always "the minimum seen so far, restricted to what's
still on the stack" — popping the main stack automatically "forgets" the
right minimum too.

A **multi-stack** design takes this further: instead of one auxiliary
stack, keep a whole *collection* of stacks, keyed by some property, and
route each push/pop to the right one. `FreqStack` below groups values by
how many times they've been pushed — `group.get(3)` is a stack of every
value currently at frequency 3 — so popping the most frequent element is
just "pop from the highest-keyed group."

## Complexity

| Design | Operation | Time | Space |
|--------|-----------|------|-------|
| `MinStack` (155) | `push`/`pop`/`top`/`getMin` | O(1) each | O(n) |
| `CustomStack` (1381) | `push`/`pop` | O(1) each | O(maxSize) |
| `CustomStack` (1381) | `increment(k, val)` | O(k) | O(1) extra |
| `FreqStack` (895) | `push`/`pop` | O(1) amortized each | O(n) |

## Walkthrough

`06-min-stack-multi-stack.ts` implements three designs.

`MinStack` (**LeetCode 155**) pairs the main `stack` with a `minStack`
where `minStack[i] = min(stack[0..i])`. Each `push` computes
`Math.min(val, currentMin)` from the previous top of `minStack`
(defaulting to `val` itself when empty) and pushes that; each `pop`
removes from both arrays together, so `getMin()` is always just
`minStack`'s top.

`CustomStack` (**LeetCode 1381**) is a bounded array-backed stack: `push`
is a no-op once `maxSize` is reached, and `pop` returns `-1` on empty
instead of throwing. `increment(k, val)` adds `val` to the bottom `k`
elements directly by index — the one operation in this lesson that
*requires* array-style random access rather than the push/pop-only
`IStack<T>` contract.

`FreqStack` (**LeetCode 895**) is the multi-stack proper: a `freq` map
tracks each value's push count, and `group` maps a frequency to a
`Stack<number>` (reused from lesson 01) holding every value currently at
that frequency, in push order. `push` increments frequency, updates
`maxFreq`, and pushes onto the matching group; `pop` always pops from
`group.get(maxFreq)`, which correctly returns the most frequent element
and — since each group is itself a stack — breaks frequency ties in
favor of the most recently pushed value.

## LeetCode practice

- 155. Min Stack (Easy)
- 1381. Design a Stack With Increment Operation (Medium)
- 895. Maximum Frequency Stack (Hard)

## Key takeaways

- Keep an auxiliary stack in lockstep with the main one to answer a
  running-aggregate query (min, max, frequency) in O(1) instead of
  rescanning.
- A "multi-stack" is just a map from some key to individual stacks,
  routing push/pop to the group matching the current key.
- Random-index operations (like `CustomStack.increment`) are a signal to
  drop the `IStack<T>` abstraction and use a plain array directly.
- LIFO order inside each frequency group is what makes `FreqStack`'s tie
  -breaking rule ("most recently pushed wins") fall out for free.

Companion code: [`06-min-stack-multi-stack.ts`](./06-min-stack-multi-stack.ts)
