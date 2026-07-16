# Heap Fundamentals

**Objective:** Understand how a binary heap represents a complete binary tree using a single flat array, with no pointers at all.

## Concept

A heap is a **complete binary tree**: every level is fully filled except
possibly the last, which fills left to right. That completeness guarantee
is exactly what lets us store the tree in a plain array instead of nodes
with left/right pointers — the position of every child is a formula away
from its parent's index.

For a 0-indexed array, node `i` has:

```
left child  index = 2*i + 1
right child index = 2*i + 2
parent      index = floor((i - 1) / 2)
```

Tree view of `[1, 3, 2, 7, 4, 5, 9]` next to its backing array:

```
Tree (values):                Array (index : value):

              1                index: 0  1  2  3  4  5  6
            /   \               val : 1  3  2  7  4  5  9
           3     2
          / \   / \
         7   4 5   9

Index math for node i=1 (value 3):
  left  = 2*1+1 = 3  -> arr[3] = 7
  right = 2*1+2 = 4  -> arr[4] = 4
  parent = floor((1-1)/2) = 0 -> arr[0] = 1
```

This array is a valid **min-heap**: every parent is <= both of its
children (1<=3, 1<=2, 3<=7, 3<=4, 2<=5, 2<=9). It is NOT sorted — only the
parent/child relationship is guaranteed, siblings can be in any order.

Because the tree is complete, its height is always `floor(log2(n))`, which
is why heap operations that walk a root-to-leaf (or leaf-to-root) path cost
O(log n) regardless of which element you touch.

## Complexity

| Operation                          | Time     | Space |
|-------------------------------------|----------|-------|
| `parentIndex` / `leftChildIndex` / `rightChildIndex` | O(1) | O(1)  |
| `isMinHeap` / `isMaxHeap` (validate whole array)      | O(n) | O(1)  |
| `levelsOf` (group into tree rows)                     | O(n) | O(n)  |
| Access root                                            | O(1) | O(1)  |

## Walkthrough

`parentIndex`, `leftChildIndex`, and `rightChildIndex` in
[`01-heap-fundamentals.ts`](./01-heap-fundamentals.ts) implement the index
formulas above. `levelsOf` slices a flat array into the rows you'd see if
you drew the tree level by level (level 0 has 1 node, level 1 has 2, level
2 has 4, ...), which is how the ASCII diagrams in this topic are built.
`isMinHeap` walks every index and checks the parent-<=-children invariant
against its two potential children, returning false on the first
violation. The `isMaxHeapStub` exercise asks you to flip that single
comparison; `isMaxHeap` is the worked solution.

## LeetCode practice

This lesson is foundational — the LeetCode problems that exercise these
ideas directly appear starting in lesson 05 (Top-K) and lesson 08
(practice set). Two problems worth previewing here since they only need
the array/index model, no heap operations yet:

- **1046. Last Stone Weight** (Easy) — solved with a max-heap in lesson 08.
- **215. Kth Largest Element in an Array** (Medium) — solved with a
  min-heap in lesson 05.

## Key takeaways

- A binary heap is a complete binary tree stored as a flat array — no
  pointers needed.
- Index math (`2i+1`, `2i+2`, `floor((i-1)/2)`) replaces child/parent
  pointers.
- Completeness guarantees height `O(log n)`, which bounds every heap
  operation you'll meet in this topic.
- A heap is only *partially* ordered: parent <= children, but siblings and
  subtrees can be in any relative order — it is not a sorted array.
- Validating the heap property is an O(n) full-array scan; reading the
  root is O(1).

Companion code: [`01-heap-fundamentals.ts`](./01-heap-fundamentals.ts)
