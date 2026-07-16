# Fenwick Tree (Binary Indexed Tree)

**Objective:** Maintain prefix sums over a mutable array with O(log n) point update and O(log n) prefix query, using one array and the low-bit trick `i & -i`.

## Concept

A Fenwick tree, or Binary Indexed Tree (BIT), is a leaner alternative to a
segment tree when you only need **prefix sums** (and therefore range sums,
via subtraction). It uses a single 1-indexed array where each index is
responsible for a run of elements determined by its lowest set bit.

The low-bit of `i` is `i & -i`: two's complement makes `-i` the bitwise
complement plus one, so `i & -i` isolates the rightmost 1-bit. Index `i`
stores the sum of the `i & -i` original elements ending at `i`.

```
1-indexed responsibilities (arrows show which range each slot covers):

  index:   1   2   3   4   5   6   7   8
  binary: 001 010 011 100 101 110 111 1000
  low-bit: 1   2   1   4   1   2   1   8

  tree[1] = a1
  tree[2] = a1+a2
  tree[3] = a3
  tree[4] = a1+a2+a3+a4
  tree[5] = a5
  tree[6] = a5+a6
  tree[7] = a7
  tree[8] = a1..a8

  prefixSum(6):  6 -> 4 -> 0   adds tree[6] + tree[4]   (strip low bit)
  add(3, d):     3 -> 4 -> 8   updates tree[3],4,8      (add low bit)
```

**Query** (`prefixSum`) walks *down*: start at `i`, add `tree[i]`, then strip
the low bit (`i -= i & -i`) until `i` hits 0. **Update** (`add`) walks *up*:
start at `i`, add the delta, then add the low bit (`i += i & -i`) until `i`
passes `n`. Each walk visits only one index per set bit — O(log n).

## Complexity

| Operation             | Time      | Space |
|-----------------------|-----------|-------|
| `add` (point update)  | O(log n)  | O(1)  |
| `prefixSum` / `rangeSum` | O(log n) | O(1) |
| `fromArray` (build)   | O(n log n)| O(n)  |
| tree storage          | —         | O(n)  |

## Walkthrough

[`11-fenwick-tree-bit.ts`](./11-fenwick-tree-bit.ts) is 1-indexed
internally (slot 0 is a dummy so `i & -i` behaves), while every public
method takes 0-indexed positions — `add` converts with `index + 1`.
`prefixSum(index)` sums `[0..index]`, and `rangeSum(from, to)` is just
`prefixSum(to) - prefixSum(from - 1)`. `set(index, value)` computes the
delta against the current value and forwards to `add`.

The `countInversions` exercise shows the BIT's second classic use: scanning
right to left and querying "how many smaller values have I already seen"
counts inversions in O(n log n). The `NumArray` class solves LeetCode 307
the same way lesson 10's segment tree does, but with less memory.

## LeetCode practice

- **307. Range Sum Query - Mutable** (Medium) — a Fenwick tree solves it in
  less code and memory than a segment tree, since only prefix/range sums are
  needed. See the `NumArray` class in the companion code.

## Key takeaways

- `i & -i` isolates the lowest set bit; that single trick drives both the
  update walk (add the low bit) and the query walk (strip the low bit).
- A Fenwick tree is the tool of choice for mutable prefix/range *sums*: less
  memory and simpler code than a segment tree — but it can't do arbitrary
  aggregates like min/max, which need a segment tree.
- Keep the array 1-indexed (dummy slot 0) so the low-bit arithmetic is
  clean, and convert 0-indexed callers at the boundary.
- Counting inversions is a Fenwick tree in disguise: query smaller-so-far
  while scanning, then insert.

Companion code: [`11-fenwick-tree-bit.ts`](./11-fenwick-tree-bit.ts)
