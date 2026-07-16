# Fast & Slow Pointers (Cycle Detection)

**Objective:** Use two pointers moving at different speeds through the same list to detect cycles, find their start, and locate the middle — all in a single pass.

## Concept

A **cycle** happens when some node's `next` points back to an earlier node
instead of `null`, so a naive traversal never terminates. Floyd's
tortoise-and-hare algorithm detects this with two pointers that start at
`head`: `slow` advances one node per step, `fast` advances two. If there is
no cycle, `fast` reaches `null` first. If there is a cycle, `fast` — moving
twice as fast — is guaranteed to lap `slow` and land on the exact same node:

```
No cycle: fast simply reaches null first.

head
 |
 v
+---+   +---+   +---+   +------+
| 1 |-->| 2 |-->| 3 |-->| null |
+---+   +---+   +---+   +------+

Cycle: fast (2 steps/tick) laps slow (1 step/tick) inside the loop.

head
 |
 v
+---+   +---+   +---+
| 1 |-->| 2 |-->| 3 |
+---+   +---+   +-+-+
                  ^ |
                  | v
                +-+-+   +---+
                | 5 |<--| 4 |
                +---+   +---+

tick 0: slow=1 fast=1
tick 1: slow=2 fast=3
tick 2: slow=3 fast=5
tick 3: slow=4 fast=4   <-- meeting point (inside the cycle, not necessarily
                            the cycle's start node)
```

Once `slow` and `fast` meet, resetting one pointer to `head` and advancing
*both* pointers one step at a time makes them meet again exactly at the
cycle's start node — a consequence of the distance from `head` to the
cycle start being congruent (mod cycle length) to the distance from the
meeting point to the cycle start.

The same two-speed idea, decoupled from `next` pointers entirely, detects
cycles in *any* deterministic sequence — for example the digit-squaring
sequence in **202. Happy Number**, where "next" means "apply the
digit-square-sum function" instead of "follow a pointer."

## Complexity

| Operation                                | Time | Space |
| ------------------------------------------ | ---- | ----- |
| `hasCycle`                                 | O(n) | O(1)  |
| `detectCycleStart`                         | O(n) | O(1)  |
| `findMiddleFastSlow`                       | O(n) | O(1)  |
| `isHappy` (cycle detection over a function) | O(log n) per step, bounded overall | O(1) |

## Walkthrough

`04-fast-slow-pointers.ts` reuses `ListNode<T>` from lesson 01. `hasCycle`
solves **141. Linked List Cycle**: `slow`/`fast` race until they collide
(cycle found) or `fast` falls off the end (no cycle). `detectCycleStart`
solves **142. Linked List Cycle II** by extending `hasCycle` with the
reset-and-walk-together phase described above. `findMiddleFastSlow` revisits
**876. Middle of the Linked List** — the same problem lesson 01 solved by
counting the length first — but now finds the middle in a single pass,
since `slow` has covered exactly half the distance `fast` has by the time
`fast` reaches the end. `isHappy` solves **202. Happy Number** by running
the tortoise-and-hare race over repeated digit-square-sums instead of
`next` pointers, terminating either at `1` (happy) or at a repeating cycle
(not happy).

`buildCyclicList` is a test-only helper that builds a node chain and wires
its tail back to an earlier node to construct cycles for the run block.

## LeetCode practice

- 141. Linked List Cycle (Easy)
- 142. Linked List Cycle II (Medium)
- 202. Happy Number (Easy)
- 876. Middle of the Linked List (Easy)

## Key takeaways

- Two pointers at different speeds detect a cycle in O(1) space, with no visited-node set required.
- The meeting point is *inside* the cycle but usually is not the cycle's start; finding the start needs the reset-and-walk-together second phase.
- The same "half the steps of a faster pointer" idea finds the middle of a list in one pass instead of two (length-count, then walk).
- Fast/slow pointers generalize beyond linked lists to any deterministic "what comes next" function, as `isHappy` shows.
- A pointer that gets a head start of `n` steps before both pointers move together is the same family of technique — it is what makes "Nth node from the end" solvable in one pass.

Companion code: [`04-fast-slow-pointers.ts`](./04-fast-slow-pointers.ts)
