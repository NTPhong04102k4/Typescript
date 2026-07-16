# K-Way Merge Using a Heap

**Objective:** Merge k already-sorted sequences into one sorted output in O(N log k) by keeping only one "frontier" element per sequence in a heap.

## Concept

Merging two sorted lists needs one comparison per step. Merging **k**
sorted lists naively (compare all k heads every step) costs O(k) per
output element, or O(N*k) overall for N total elements. A min-heap cuts
that to O(log k) per step: keep exactly one candidate per sequence (its
current front) in the heap, pop the smallest, advance that sequence, and
push its new front.

```
Merge k Sorted Lists: [1,4,5]  [1,3,4]  [2,6]

heap seeded with each list's head:      {1(A), 1(B), 2(C)}   (A,B,C tag the source list)

pop 1(A) -> output [1]        push A.next=4  -> heap {1(B), 2(C), 4(A)}
pop 1(B) -> output [1,1]      push B.next=3  -> heap {2(C), 3(B), 4(A)}
pop 2(C) -> output [1,1,2]    push C.next=6  -> heap {3(B), 4(A), 6(C)}
pop 3(B) -> output [1,1,2,3]  push B.next=4  -> heap {4(A), 4(B), 6(C)}
...continue until the heap is empty...
output: [1, 1, 2, 3, 4, 4, 5, 6]
```

The heap never holds more than k elements at once — one per still-active
sequence — which is exactly what bounds each pop/push at O(log k)
regardless of how large the sequences themselves are. The same idea works
whether the "sequences" are linked lists, plain arrays, or (as in the
sorted-matrix problem) the rows of a matrix.

## Complexity

| Operation                                             | Time            | Space |
|---------------------------------------------------------|-----------------|-------|
| `mergeKLists` (k lists, N nodes total)                   | O(N log k)      | O(k) heap |
| `kthSmallest` matrix (n x n matrix)                      | O(k log n)      | O(n) heap |
| `mergeKSortedArrays` (k arrays, N elements total)        | O(N log k)      | O(k) heap |
| Naive "concatenate then sort"                            | O(N log N)      | O(N) |

## Walkthrough

[`06-k-way-merge.ts`](./06-k-way-merge.ts) defines a minimal `ListNode`
plus `arrayToList`/`listToArray` helpers for testing. `mergeKLists` pushes
every list's head into a `MinHeap<ListNode>` (imported from
[`./02-min-max-heap.ts`](./02-min-max-heap.ts)) keyed by `.val`, then
repeatedly pops the smallest node, appends it to a dummy-headed output
list, and pushes `node.next` back in if the source list isn't exhausted
yet. `kthSmallest` treats each matrix row as a sorted sequence: it seeds
the heap with `[value, row, col]` triples for column 0 of every row (up to
k rows, since you'll never need more), then pops-and-advances k times,
returning the k-th popped value. `mergeKSortedArraysStub` is the exercise:
adapt the same `[value, sourceIndex, elementIndex]` triple pattern to
plain number arrays instead of linked lists or matrix rows.

## LeetCode practice

- **23. Merge k Sorted Lists** (Hard)
- **378. Kth Smallest Element in a Sorted Matrix** (Medium)
- **295. Find Median from Data Stream** (Hard) — a related two-heap
  streaming technique, covered next in lesson 07.

## Key takeaways

- K-way merge keeps only one "frontier" candidate per sequence in the
  heap, bounding heap size at k regardless of total input size.
- Each pop/push is O(log k), so merging N total elements costs
  O(N log k) -- far better than sorting everything from scratch.
- The pattern is the same whether sequences are linked lists, arrays, or
  matrix rows: seed with the first element of each, then pop-and-advance.
- Tracking `[value, sourceIndex, positionIndex]` in the heap is what lets
  you know which sequence to advance after popping.

Companion code: [`06-k-way-merge.ts`](./06-k-way-merge.ts)
