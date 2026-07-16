# Merge & Sort Linked Lists

**Objective:** Merge sorted lists (two, k, or in-between) and sort an unsorted list, all using O(1)-per-node pointer splicing instead of copying into arrays.

## Concept

Merging two sorted lists is a pointer-splicing walk: keep a `tail` pointer
into the result, and at each step attach whichever of the two current
nodes has the smaller value, then advance that list's pointer. No new
nodes are allocated — the existing nodes are simply re-linked in sorted
order:

```
l1: 1 -> 4 -> 5 -> null
l2: 1 -> 3 -> 4 -> null

merge step: compare heads (1 vs 1) -> take l1's node, advance l1
result:  1 -> null
              ^ tail

next step: compare (4 vs 1) -> take l2's node, advance l2
result:  1 -> 1 -> null
                   ^ tail
... continues until one list is exhausted, then the remaining tail of the
other list is attached as-is (already sorted).
```

Merge sort on a linked list reuses this merge step as its combine phase:
split the list in half (using the same fast/slow idea from lesson 04, but
also tracking the node *before* the middle so the first half can be cut),
recursively sort each half, then merge the two sorted halves back
together. Because merging only rewires pointers, linked-list merge sort
needs no auxiliary array the way array merge sort does.

Merging **k** sorted lists extends the same idea: repeatedly merge lists in
pairs, halving the number of lists each round, until one list remains —
O(N log k) instead of the O(N·k) of merging one list at a time.

## Complexity

| Operation                                | Time         | Space         |
| ------------------------------------------ | ------------ | ------------- |
| `mergeTwoSortedLists`                      | O(n + m)     | O(1)          |
| `sortList` (merge sort)                    | O(n log n)   | O(log n) (call stack) |
| `mergeKLists` (pairwise divide & conquer)   | O(N log k)   | O(log k) (call stack) |
| `mergeInBetween`                           | O(n)         | O(1)          |

## Walkthrough

`06-merge-sort-lists.ts` implements `mergeTwoSortedLists`, solving
**21. Merge Two Sorted Lists** with the dummy-head splicing walk described
above. `sortList` solves **148. Sort List** by splitting the list with the
private `splitAtMiddle` helper (fast/slow, but also tracking the node
before the middle so the first half can be `null`-terminated), recursing on
each half, and combining with `mergeTwoSortedLists`. `mergeKLists` solves
**23. Merge k Sorted Lists** by repeatedly pairing up lists and merging
each pair, halving the list count every round instead of folding one list
in at a time. `mergeInBetween` solves **1669. Merge In Between Linked
Lists** by walking to the node just before index `a` and the node just
after index `b`, splicing `list2` between them.

Two exercises round out the file: `insertionSortList` solves **147.
Insertion Sort List** by repeatedly removing the next node from the input
and inserting it into its sorted position in the (initially empty) result
list. `interleaveLists` merges two lists node-by-node regardless of sort
order — a useful warm-up variant distinct from the sorted merge above.

## LeetCode practice

- 21. Merge Two Sorted Lists (Easy)
- 148. Sort List (Medium)
- 1669. Merge In Between Linked Lists (Medium)
- 23. Merge k Sorted Lists (Hard)

## Key takeaways

- Merging sorted lists is pure pointer splicing — O(1) extra space, no data copying, unlike merging sorted arrays.
- Linked-list merge sort needs no auxiliary array for the merge step, which is one advantage lists have over arrays for this particular algorithm.
- Splitting a list for merge sort needs the node *before* the middle, not just the middle itself, so the first half can be properly terminated with `null`.
- Merging k lists pairwise (halving the count each round) beats folding them in one at a time: O(N log k) versus O(N·k).
- "Splice list B into list A between two positions" (1669) is the same pointer-rewiring idea as `insertAt`/`removeAt` from lesson 02, just with a whole sub-list instead of one node.

Companion code: [`06-merge-sort-lists.ts`](./06-merge-sort-lists.ts)
