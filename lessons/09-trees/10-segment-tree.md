# Segment Tree: Range Queries with Point Updates

**Objective:** Answer range aggregate queries (sum, min, max) over a mutable array in O(log n) per query and per update, using a single array-backed binary tree.

## Concept

A segment tree stores an aggregate for every *segment* of the array. The
root covers the whole array `[0, n-1]`; each internal node splits its range
in half and delegates to two children; each leaf covers one element. A
parent's value is `combine(left, right)` — for a sum tree that's `left +
right`, for a min tree it's `Math.min(left, right)`.

Like a binary heap, the tree lives in a flat array: the node at index `i`
has children at `2i+1` and `2i+2`. No pointers, no `TreeNode`.

```
values = [2, 1, 5, 3, 4]   (leaf ranges shown as [lo,hi])

                     [0,4]=15
                    /        \
              [0,2]=8         [3,4]=7
              /     \          /    \
        [0,1]=3   [2,2]=5  [3,3]=3 [4,4]=4
        /    \
   [0,0]=2 [1,1]=1

query(1,3)  -> combine of the shaded pieces:
    [1,1]=1  (partial)  +  [2,2]=5  +  [3,3]=3   = 9
```

A query walks down from the root. At each node one of three things happens:

- **No overlap** with `[from, to]` -> return the `identity` (0 for sum,
  `+Infinity` for min) so the branch contributes nothing.
- **Total overlap** (node's range fully inside the query) -> return the
  node's stored aggregate without descending further.
- **Partial overlap** -> recurse into both children and `combine` results.

A point update recurses to the single leaf, rewrites it, and re-combines
each ancestor on the way back up. Both operations touch only O(log n) nodes.

## Complexity

| Operation           | Time      | Space |
|---------------------|-----------|-------|
| `build`             | O(n)      | O(n)  |
| `update` (point)    | O(log n)  | O(1)  |
| `query` (range)     | O(log n)  | O(1)  |
| tree storage        | —         | O(n)  |

## Walkthrough

[`10-segment-tree.ts`](./10-segment-tree.ts) defines a single `SegmentTree`
class parameterized by a `combine` function and its `identity` element, so
the *same* code powers sum, min, and max trees — `buildSumTree`,
`buildMinTree`, and the `rangeMax` exercise just supply different
`(combine, identity)` pairs. Internally it allocates `4n` slots (a safe
upper bound for a non-perfect tree) and recurses with explicit `[lo, hi]`
ranges plus child indices `2i+1` / `2i+2`.

`query(from, to)` implements the three-way overlap test above; `update(pos,
value)` rewrites one leaf and re-combines its ancestors. The `NumArray`
wrapper adapts this to LeetCode 307's method names.

## LeetCode practice

- **307. Range Sum Query - Mutable** (Medium) — the canonical segment-tree
  problem: `update(index, val)` plus `sumRange(left, right)`, both needed in
  O(log n). See the `NumArray` class in the companion code.

## Key takeaways

- A segment tree generalizes prefix sums to *any* associative aggregate
  (sum, min, max, gcd) while still allowing O(log n) updates — plain prefix
  sums force O(n) rebuilds on every update.
- The three-way overlap test (no / total / partial) is the heart of every
  segment-tree query; the `identity` element is what makes the "no overlap"
  branch harmless.
- Store the tree in a flat `4n` array with children at `2i+1` / `2i+2` — no
  node objects required.
- The `combine`/`identity` pair is the only thing that changes between a sum
  tree, a min tree, and a max tree.

Companion code: [`10-segment-tree.ts`](./10-segment-tree.ts)
