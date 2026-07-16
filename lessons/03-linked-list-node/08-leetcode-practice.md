# LeetCode Practice Set: Linked List

**Objective:** Apply everything from lessons 01–07 — raw pointer walks, fast/slow pointers, reversal, merging, and the node+map combo — to a fresh set of problems, Easy through Hard.

## Concept

This lesson has no new pointer technique of its own; it is a workout that
mixes and matches the ones already covered. Each problem below reuses a
building block from an earlier lesson rather than introducing a new idea:

- **Two pointers racing at different speeds/starts** (lesson 04) shows up
  in both `getIntersectionNode` (two pointers that swap heads so they
  cover equal total distance) and `removeNthFromEnd` (a pointer given an
  `n`-step head start).
- **In-place pointer rewiring** (lessons 02/05) drives `partitionList`
  (splice nodes into two chains, then join them) and `rotateRight`
  (temporarily make the list circular, then cut it at a new point).
- **Reversal + fast/slow together** (lessons 04/05) solves `reorderList`,
  the same "split, reverse second half, weave together" combination
  lesson 05 used for palindrome checking, applied to interleaving instead
  of comparing.
- **A dummy head absorbing an edge case at the real head** (lessons 02/06)
  reappears in `deleteDuplicatesAll`, which must be able to delete the
  very first node of the list.
- **Node + map for O(1) structure** (lesson 07) is pushed further by
  `AllOne`, which needs O(1) `getMaxKey`/`getMinKey` in addition to O(1)
  `inc`/`dec` — solved with a doubly linked list of *count buckets* (each
  holding the set of keys sharing that count) instead of one node per key.

## Complexity

| Problem                                          | Time       | Space       |
| -------------------------------------------------- | ---------- | ----------- |
| 160. Intersection of Two Linked Lists (Easy)        | O(n + m)   | O(1)        |
| 19. Remove Nth Node From End of List (Medium)       | O(n)       | O(1)        |
| 86. Partition List (Medium)                         | O(n)       | O(1)        |
| 143. Reorder List (Medium)                          | O(n)       | O(1)        |
| 61. Rotate List (Medium)                            | O(n)       | O(1)        |
| 82. Remove Duplicates from Sorted List II (Medium)  | O(n)       | O(1)        |
| 432. All O`one Data Structure (Hard)                | O(1) per op | O(n) (n = distinct keys) |

## Walkthrough

`08-leetcode-practice.ts` solves **160. Intersection of Two Linked Lists**
with `getIntersectionNode`: walk both lists, and when a pointer reaches the
end, switch it to the *other* list's head. Both pointers then travel the
same total distance (`lenA + lenB`) before either meeting at the
intersection node or reaching `null` together if the lists never
intersect. `removeNthFromEnd` solves **19. Remove Nth Node From End of
List** with a dummy head and a `fast` pointer given an `n`-step head
start, so `slow` lands on the node just before the one to delete when
`fast` runs out.

`partitionList` solves **86. Partition List** by building two separate
chains (`< x` and `>= x`) while walking the input once, then joining the
first chain's tail to the second chain's head. `reorderList` solves **143.
Reorder List** by finding the middle (lesson 04's `findMiddleFastSlow`),
reversing the second half (lesson 05's `reverseIterative`), and weaving
the two halves together node-by-node. `rotateRight` solves **61. Rotate
List** by linking the tail back to the head (making it circular), walking
to the new tail (`length - k % length` steps from the old head), and
cutting the circle there. `deleteDuplicatesAll` solves **82. Remove
Duplicates from Sorted List II** with a dummy head: whenever `current`'s
value repeats in the next node, skip *all* nodes sharing that value
instead of keeping one, unlike lesson 02's `removeDuplicatesFromSortedList`
(83), which keeps a single copy.

`AllOne` solves **432. All O\`one Data Structure**, the hardest problem in
the set: a doubly linked list of buckets (each bucket holding a `count`
and the `Set` of keys with that count), kept sorted by ascending count
from `head` to `tail`, plus a `Map<key, bucket>` for O(1) lookup.
`inc`/`dec` move a key to the neighboring bucket (creating it if it
doesn't already exist, removing the old bucket if it becomes empty); the
list stays sorted because a key only ever needs to move one bucket over.
`getMaxKey`/`getMinKey` just read a key out of the `tail`/`head` bucket.

## LeetCode practice

- 160. Intersection of Two Linked Lists (Easy)
- 19. Remove Nth Node From End of List (Medium)
- 86. Partition List (Medium)
- 143. Reorder List (Medium)
- 61. Rotate List (Medium)
- 82. Remove Duplicates from Sorted List II (Medium)
- 432. All O`one Data Structure (Hard)

## Key takeaways

- Most "new" linked-list problems are really a familiar pattern (two pointers, dummy head, split-and-rejoin) wearing a different problem statement.
- Swapping which list a pointer continues into after reaching `null` (160) is the same "equalize total distance" idea as giving a pointer a head start (19) — both cancel out a length difference without computing it up front.
- Splitting into multiple chains and re-joining them (86) generalizes past two chains to as many partitions as needed.
- Making a list temporarily circular (61) is a clean way to express "wrap around" without special-casing the wraparound point until the very last step.
- Node + map scales beyond single-key lookup (lesson 07's LRU cache) to bucket-based structures (432) that need order statistics like max/min in O(1) as well.

Companion code: [`08-leetcode-practice.ts`](./08-leetcode-practice.ts)
