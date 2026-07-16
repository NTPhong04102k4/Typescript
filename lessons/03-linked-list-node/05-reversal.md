# Reversal Techniques (Iterative & Recursive)

**Objective:** Reverse a linked list's pointers in place, both iteratively and recursively, and generalize the technique to sub-ranges and groups.

## Concept

Reversing a linked list means flipping every `next` pointer so it points to
the *previous* node instead of the next one. No node data moves — only
pointers are rewired. The iterative version walks the list once, keeping
three references (`prev`, `current`, `next`) so the link can be flipped
without losing the rest of the chain:

```
Before (one step of the walk):
prev        current      next-node
 |             |             |
 v             v             v
+---+   +---+   +---+
| 1 |-->| 2 |-->| 3 |--> ...
+---+   +---+   +---+

Step: save `next`, then point current.next backward at prev.

+---+   +---+   +---+
| 1 |<--| 2 |   | 3 |--> ...
+---+   +---+   +---+
 ^        ^        ^
prev   current   next (advances to here for the next iteration)

After the whole walk: every arrow points the opposite direction, and the
old tail is the new head.
```

The recursive version reverses everything *after* the current node first
(via the call stack), then makes the current node the new tail:
`head.next.next = head; head.next = null;`. The deepest call bottoms out
at the original tail, which becomes the new head returned all the way back
up.

The same three-pointer rewiring generalizes: reverse only a sub-range
(`left`..`right`), or reverse the list in fixed-size groups of `k`,
re-linking each reversed chunk to the next.

## Complexity

| Operation                          | Time | Space (extra)      |
| ------------------------------------ | ---- | ------------------- |
| `reverseIterative`                  | O(n) | O(1)                 |
| `reverseRecursive`                   | O(n) | O(n) (call stack)     |
| `reverseBetween` (sub-range)         | O(n) | O(1)                 |
| `reverseKGroup` / `swapPairs`        | O(n) | O(n/k) / O(n) call stack |

## Walkthrough

`05-reversal.ts` implements `reverseIterative<T>` and `reverseRecursive<T>`,
both solving **206. Reverse Linked List** — the iterative version rewires
`prev`/`current`/`next` in a single loop; the recursive version reverses
the tail first and fixes up the current node's link on the way back up the
call stack. `reverseBetween` solves **92. Reverse Linked List II** using a
dummy head and the "repeatedly move the next node to the front of the
sub-range" pattern, so only pointers inside `[left, right]` move.
`reverseKGroup` solves **25. Reverse Nodes in k-Group** recursively: count
`k` nodes ahead, recursively reverse everything after that boundary, then
reverse the current `k`-node group and attach it to the (already reversed)
rest. `swapPairs` solves **24. Swap Nodes in Pairs** with the same
divide-and-conquer shape specialized to groups of 2.

Two exercises close the file: `reverseFirstK` reverses just a prefix and
reconnects it to the untouched remainder, and `isPalindromeViaReversal`
combines lesson 04's `findMiddleFastSlow` with this lesson's
`reverseIterative` to solve **234. Palindrome Linked List** without
allocating an array — split at the middle, reverse the second half, and
compare outward from both ends.

## LeetCode practice

- 206. Reverse Linked List (Easy)
- 92. Reverse Linked List II (Medium)
- 24. Swap Nodes in Pairs (Medium)
- 25. Reverse Nodes in k-Group (Hard)

## Key takeaways

- Reversal never moves data — it only rewires `next` pointers, so it is always O(1) extra space iteratively.
- The recursive version trades that O(1) space for O(n) call-stack space, in exchange for code that mirrors the problem's self-similar structure.
- `reverseBetween`'s "move next node to the front of the range" pattern generalizes cleanly to `reverseKGroup`'s per-group reversal.
- Divide-and-conquer group reversal (`reverseKGroup`) recurses on "everything after this group" first, then attaches the already-reversed rest to the freshly reversed group.
- Combining fast/slow (lesson 04) with reversal (this lesson) solves palindrome-checking in O(1) extra space instead of copying the list into an array.

Companion code: [`05-reversal.ts`](./05-reversal.ts)
