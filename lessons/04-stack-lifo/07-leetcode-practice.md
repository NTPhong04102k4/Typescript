# LeetCode Practice Set: Stack

**Objective:** Consolidate every stack pattern from this topic — matching, monotonic scanning, and histogram reduction — across six problems from Easy to Hard.

## Concept

This lesson doesn't introduce a new technique; it's a review set spanning
the ones already covered:

```
Easy    →  cancel-on-match (1047), direct-index scoring (682)
Medium  →  push/pop path segments (71), monotonic collision (735)
Hard    →  monotonic-stack histogram (84), reduced row-by-row (85)
```

The last two are worth dwelling on: **Maximal Rectangle (85)** is solved
by running **Largest Rectangle in Histogram (84)** once per row, treating
each row as the base of a histogram whose bar heights are "how many
consecutive `1`s end here, going up." Reusing a stack-based solution as a
subroutine inside a larger one is itself a pattern worth recognizing.

## Complexity

| # | Problem | Difficulty | Time | Space |
|---|---------|------------|------|-------|
| 1047 | Remove All Adjacent Duplicates In String | Easy | O(n) | O(n) |
| 682 | Baseball Game | Easy | O(n) | O(n) |
| 71 | Simplify Path | Medium | O(n) | O(n) |
| 735 | Asteroid Collision | Medium | O(n) | O(n) |
| 84 | Largest Rectangle in Histogram | Hard | O(n) | O(n) |
| 85 | Maximal Rectangle | Hard | O(rows · cols) | O(cols) |

## Walkthrough

`07-leetcode-practice.ts` implements all six as exported functions.

`removeDuplicates` (**1047**) reuses `Stack<string>` from lesson 01:
push a character unless it matches the current top, in which case they
cancel out via `pop`; `stack.toArray().join('')` reconstructs the answer.

`calPoints` (**682**) uses a plain `number[]` directly, since `'+'` needs
the top *two* scores by index — a case where dropping down to a raw
array is simpler than going through `IStack<T>`.

`simplifyPath` (**71**) reuses `Stack<string>`: real segments are pushed,
`..` pops (if anything is there to pop), and `.`/empty segments are
skipped; `stack.toArray().join('/')` rebuilds the canonical path.

`asteroidCollision` (**735**) reuses `Stack<number>`: a negative
(left-moving) asteroid keeps destroying smaller positive asteroids on top
of the stack in a `while` loop until it is absorbed, survives, or
mutually annihilates with an equal-sized one.

`largestRectangleArea` (**84**) keeps a monotonic increasing stack of
indices (via `Stack<number>`); a sentinel height of `0` appended at the
end flushes every remaining bar so no rectangle is missed.
`maximalRectangle` (**85**) calls it once per row of an evolving
`heights` array, where each column's height grows by 1 on a `'1'` and
resets to 0 on a `'0'`.

## LeetCode practice

- 1047. Remove All Adjacent Duplicates In String (Easy)
- 682. Baseball Game (Easy)
- 71. Simplify Path (Medium)
- 735. Asteroid Collision (Medium)
- 84. Largest Rectangle in Histogram (Hard)
- 85. Maximal Rectangle (Hard)

## Key takeaways

- "Cancel on match" (1047), "direct-index combine" (682), and "push
  real segments, pop on `..`" (71) are all variations of the same
  single-pass, stack-tracks-what-survives idea.
- Random-index access (682) is a legitimate reason to use a raw array
  instead of `IStack<T>` — don't force the abstraction where it doesn't
  fit.
- Monotonic stacks solve more than "next greater element": collision
  simulation (735) and histogram area (84) are the same shrinking-stack
  shape applied to different questions.
- A stack-based solution can be a subroutine: 85 is just 84 run once per
  row of a shrinking/growing histogram.

Companion code: [`07-leetcode-practice.ts`](./07-leetcode-practice.ts)
