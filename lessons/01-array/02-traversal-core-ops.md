# Traversal & Core Ops (push/pop/shift/unshift complexity)

**Objective:** Learn why appending at the end of an array is cheap while inserting/removing at the front (or middle) is expensive.

## Concept

Because an array is one contiguous block (lesson 1), adding or removing an
element anywhere except the very end forces every following element to
move, so the block stays contiguous and correctly indexed.

```
push(6) — append at the end, nothing else moves:

before: [ 1 | 2 | 3 | 4 | 5 ]
after:  [ 1 | 2 | 3 | 4 | 5 | 6 ]              O(1) amortized

unshift(0) — insert at the front, EVERY element shifts right by one:

before: [ 1 | 2 | 3 | 4 | 5 ]
           v   v   v   v   v
after:  [ 0 | 1 | 2 | 3 | 4 | 5 ]              O(n)

shift() — remove the front, EVERY remaining element shifts left by one:

before: [ 1 | 2 | 3 | 4 | 5 ]
           v   v   v   v
after:  [ 2 | 3 | 4 | 5 ]                      O(n)
```

`push`/`pop` touch a fixed number of slots at the tail, so they're O(1)
(amortized, since the engine occasionally reallocates a bigger backing
buffer). `shift`/`unshift`, and insertion/removal at any interior index,
are O(n) because every element after the target index must be copied to a
new slot.

## Complexity

| Operation                      | Time            | Space |
|----------------------------------|------------------|-------|
| `appendEnd` (push)                | O(1) amortized   | O(1)  |
| `removeEnd` (pop)                 | O(1)             | O(1)  |
| `manualUnshift` (insert at front)  | O(n)             | O(1)  |
| `manualShift` (remove from front)  | O(n)             | O(1)  |
| `insertAt` (insert at index)      | O(n)             | O(1)  |
| `removeAt` (remove at index)      | O(n)             | O(1)  |

## Walkthrough

`02-traversal-core-ops.ts` implements each operation manually so the
shifting cost is visible in code, not hidden behind a built-in:

- `appendEnd` / `removeEnd` wrap `push`/`pop` to show the O(1) tail
  operations as a baseline.
- `manualUnshift` grows the array by one slot and walks backward from the
  new last index down to 1, copying each element one position to the
  right, before writing the new value at index 0 — the loop body is the
  O(n) cost `unshift` hides from you.
- `manualShift` does the mirror image: it saves index 0, walks forward
  copying each element one position left, then shrinks the array by one.
- `insertAt` and `removeAt` (exercise solutions) generalize the same
  shifting pattern to an arbitrary index, which is exactly what
  `Array.prototype.splice` does internally.
- `removeElement` implements LeetCode 27 with a read/write two-pointer
  scan: it overwrites in place in a single O(n) pass instead of shifting
  after every removal, which is the efficient way to do bulk removal.

## LeetCode practice

- 27. Remove Element (Easy)
- 66. Plus One (Easy)
- 1299. Replace Elements with Greatest Element on Right Side (Easy)

## Key takeaways

- `push`/`pop` are O(1) amortized because they only touch the tail.
- `shift`/`unshift` are O(n) because every other element must be
  re-indexed to preserve contiguity.
- Inserting/removing at an arbitrary index is O(n) for the same reason —
  the cost scales with the number of elements after the target index.
- When you need many front-removals, consider a different structure
  (see the Queue topic) rather than repeated `shift`.

Companion code: [`02-traversal-core-ops.ts`](./02-traversal-core-ops.ts)
