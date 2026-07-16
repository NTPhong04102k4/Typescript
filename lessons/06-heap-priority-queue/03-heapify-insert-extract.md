# Heapify, Insert, Extract-Min/Max

**Objective:** Build a valid heap from an arbitrary array in O(n), and see insert/extract as thin wrappers over sift-up/sift-down on that array.

## Concept

Lesson 02 built a heap by pushing elements one at a time (O(n log n) total,
since each push can sift up through the full height). **Heapify** does
better: start from the last node that has children and sift *down* from
there, working backward to the root.

```
Raw array:            [9, 4, 7, 1, 8, 2, 3]
Tree view:                    9
                             / \
                            4   7
                           /\   /\
                          1  8 2  3

Heapify walks i = floor(n/2)-1 down to 0, sifting DOWN at each i:

i=2 (value 7): children 2,3 -> smaller child 2 wins -> swap(7,2)
i=1 (value 4): children 1,8 -> smaller child 1 wins -> swap(4,1)
i=0 (value 9): children 1,2 -> smaller child 1 wins -> swap(9,1), then
               continue sifting the swapped-in 9 down at its new spot

Result (a valid min-heap, root = global minimum):
        1
       / \
      4   2
     /\   /\
    9  8 7  3
```

Why start at `floor(n/2) - 1`? Every index beyond that is a leaf (no
children), and a lone leaf already trivially satisfies the heap property.
Sifting down from the bottom-most internal nodes upward means each
subtree is already a valid heap by the time its parent is processed —
that's what makes the whole pass O(n) instead of O(n log n): most nodes
are near the bottom and only sift down a short distance.

**Insert** = append + sift-up (same as `push` in lesson 02).
**Extract-min/max** = read the root, move the last element into its place,
shrink the array, then sift-down from the root — exactly what `pop` did.
The terms "insert" and "extract" describe the *operation on the array*;
`push`/`pop` are just the class method names for the same thing.

## Complexity

| Operation                              | Time         | Space |
|------------------------------------------|--------------|-------|
| `heapify` (bottom-up build)               | O(n)         | O(1) extra |
| Naive build via n pushes (lesson 02)      | O(n log n)   | O(1) extra |
| `heapInsert`                              | O(log n)     | O(1) |
| `heapExtractRoot`                         | O(log n)     | O(1) |
| `heapSort` (heapify + n extracts)         | O(n log n)   | O(1) extra (in-place) |
| `isHeap` (validate)                       | O(n)         | O(1) |

## Walkthrough

[`03-heapify-insert-extract.ts`](./03-heapify-insert-extract.ts) factors
sift-down and sift-up out as standalone `siftDown`/`siftUp` functions that
operate directly on a raw array (rather than being hidden inside a class),
so you can see them reused three ways: `heapify` calls `siftDown` from
every internal node backward to the root; `heapInsert` appends then calls
`siftUp`; `heapExtractRoot` swaps the root with the last element, shrinks
the array, and calls `siftDown` once from the root. `heapSort` chains all
of this together: heapify into a max-heap, then repeatedly swap the root
to the end of the shrinking array — the classic in-place heap sort. The
file imports `MinHeap` from [`./02-min-max-heap.ts`](./02-min-max-heap.ts)
and cross-checks in the `run` section that `MinHeap.pop()` and
`heapExtractRoot` agree on the same array, showing the class method and
the raw-array function are the same algorithm. The `isHeapStub` exercise
generalizes lesson 01's numeric-only checkers to any comparator.

## LeetCode practice

- **215. Kth Largest Element in an Array** (Medium) — can be solved by
  heapifying the whole array into a max-heap and extracting k times.
- **347. Top K Frequent Elements** (Medium) — bucket/heapify frequencies,
  then extract the top k (lesson 05 uses the size-k min-heap variant).
- **23. Merge k Sorted Lists** (Hard) — repeated extract-min over list
  heads, the core of lesson 06's k-way merge.

## Key takeaways

- Bottom-up heapify is O(n), not O(n log n), because most nodes are near
  the bottom and sift down only a short distance.
- Insert and extract are just sift-up and sift-down applied at the array's
  edges (append / root-swap-and-shrink).
- `heapSort` is nothing more than "heapify once, extract-max n times."
- Raw-array heap functions and the `MinHeap`/`MaxHeap` classes are the same
  algorithm at different levels of abstraction — the class just hides the
  array.
- Validating a heap and reading its root are cheap (O(n) and O(1)); the
  expensive part is always maintaining the property across mutation.

Companion code: [`03-heapify-insert-extract.ts`](./03-heapify-insert-extract.ts)
