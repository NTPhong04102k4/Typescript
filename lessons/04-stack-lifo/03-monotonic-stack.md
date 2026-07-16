# Monotonic Stack Pattern

**Objective:** Learn how a stack that is kept strictly increasing or decreasing finds "next greater/smaller" relationships in a single linear pass.

## Concept

A **monotonic stack** only ever holds elements in sorted order (say,
decreasing from bottom to top). Whenever a new element would break that
order, everything on top that is smaller gets popped off *first* — and
each pop is a signal: "this new element is the answer for whatever I just
popped."

```
values: [73, 74, 75, 71, 69, 72, 76, 73]   (dailyTemperatures)

i=0  push 73          stack(bottom→top): [73]
i=1  74 > 73 → pop 73, answer[0] = 1-0 = 1
     push 74          stack: [74]
i=2  75 > 74 → pop 74, answer[1] = 2-1 = 1
     push 75          stack: [75]
i=3  71 < 75 → push   stack: [75, 71]
i=4  69 < 71 → push   stack: [75, 71, 69]
i=5  72 > 69 → pop 69, answer[4] = 5-4 = 1
     72 > 71 → pop 71, answer[3] = 5-3 = 2
     72 < 75 → push   stack: [75, 72]
...
```

Each element is pushed once and popped at most once, so even though there
is a `while` loop inside the `for` loop, the total number of pop
operations across the whole run is bounded by `n` — giving O(n) overall
despite looking like it could be O(n²).

## Complexity

| Operation / Problem | Time | Space |
|----------------------|------|-------|
| Push/pop per element | O(1) amortized | O(1) |
| Full pass (n elements) | O(n) — each element pushed & popped at most once | O(n) for the stack |
| `nextGreaterElement` (496) | O(n + m) | O(n) |
| `dailyTemperatures` (739) | O(n) | O(n) |
| `trap` (42) | O(n) | O(n) |

## Walkthrough

`03-monotonic-stack.ts` reuses `Stack<T>` from lesson 01 for all three
solutions.

`nextGreaterElement` (**LeetCode 496**) keeps a stack of values from
`nums2` in decreasing order. When the current number beats the stack's
top, that top has just found its next-greater value — pop it and record
`nextGreater.set(popped, current)` — then the final answer is a lookup
into that map for each value in `nums1`.

`dailyTemperatures` (**LeetCode 739**) is the same pattern over
*indices*: the stack holds indices whose temperatures are decreasing.
When a warmer day arrives, every colder day popped off gets its answer
filled in as `i - idx` (days waited).

`trap` (**LeetCode 42**) extends the pattern: each time a popped index's
bar is shorter than both the current bar and whatever is now exposed
underneath it on the stack, that gap can hold
`min(leftHeight, rightHeight) - poppedHeight` units of water across
`distance` columns — computed directly from `stack.peek()` as the left
wall and the current index as the right wall.

## LeetCode practice

- 496. Next Greater Element I (Easy)
- 739. Daily Temperatures (Medium)
- 42. Trapping Rain Water (Hard)

## Key takeaways

- Monotonic stack = stack kept sorted; a violation triggers a burst of
  pops, each one an answer for the popped element.
- Despite the nested loop, total work is O(n) because each element is
  pushed and popped at most once (amortized analysis).
- The pattern generalizes from "next greater value" (496) to "next
  greater index / distance" (739) to "bounded area between walls" (42).
- Always decide up front whether the stack holds *values* or *indices* —
  indices are strictly more powerful since the value is always
  recoverable via the original array.

Companion code: [`03-monotonic-stack.ts`](./03-monotonic-stack.ts)
