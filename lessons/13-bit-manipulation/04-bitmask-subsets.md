# Bitmask Subsets

**Objective:** Represent a set of up to ~31 elements as a single integer, enumerate all `2^n` subsets by counting through the masks, and iterate the submasks of a mask with the `(sub - 1) & mask` recurrence.

## Concept

A set over `n` elements maps onto an `n`-bit integer: **bit `i` is set exactly
when element `i` is a member**. This turns set operations into arithmetic — union
is `|`, intersection is `&`, membership is `(set >> i) & 1`.

To **enumerate every subset**, count an integer `mask` from `0` to `2^n - 1`.
Each value *is* a subset:

```
 items = [a, b, c]      (n = 3, so 2^3 = 8 masks)

 mask  bits   subset
   0   000    {}
   1   001    {a}
   2   010    {b}
   3   011    {a, b}
   4   100    {c}
   5   101    {a, c}
   6   110    {b, c}
   7   111    {a, b, c}
```

To **iterate the submasks** of a fixed `mask` (every subset of the bits already
set in `mask`), the idiom `sub = (sub - 1) & mask` walks them in descending order
without visiting anything outside `mask`:

```
 mask = 101
 sub = 101 -> 100 -> 001 -> (0, stop)
```

This is the backbone of subset-sum and set-partition DP, where you split a set
into a submask and its complement.

## Complexity

| Operation | Time | Space |
|-----------|------|-------|
| `allSubsets` (n elements) | O(n · 2^n) | O(n · 2^n) |
| `submasks` (of a mask with k set bits) | O(2^k) | O(2^k) |
| `addToSet` / `inSet` | O(1) | O(1) |
| `setToIndices` (highest set bit h) | O(h) | O(h) |

## Walkthrough

[`04-bitmask-subsets.ts`](./04-bitmask-subsets.ts) computes `total = 1 << n` and
loops `mask` from `0` to `total - 1`. For each mask it builds the subset by
testing every bit with `(mask >> i) & 1` and pushing `items[i]` when set — so the
result comes out in the exact mask order shown in the table above.

`submasks` runs the `(sub - 1) & mask` recurrence starting from `sub = mask` down
to (but not including) `0`, collecting each non-empty submask. `addToSet` and
`inSet` are the set-as-integer primitives (`set | (1 << i)` and `(set >> i) & 1`),
and the exercise `setToIndices` walks bits upward until the shifted value is `0`,
recovering the sorted element list from a mask.

## LeetCode practice

- **78. Subsets** (Medium) — enumerate all `2^n` masks (see lesson 06).
- **1178. Number of Valid Words for Each Puzzle** (Hard) — words and puzzles encoded as bitmasks; iterate submasks of each puzzle.
- **698. Partition to K Equal Sum Subsets** (Medium) — visited-set bitmask DP built on submask iteration.

## Key takeaways

- A set over ≤31 elements fits in one integer: bit `i` set ⇔ element `i` present.
- Counting `mask` from `0` to `2^n - 1` enumerates every subset, in a predictable order.
- `sub = (sub - 1) & mask` iterates all submasks of `mask` in descending order without straying outside it.
- Set operations become bit operations: union `|`, intersection `&`, add `| (1 << i)`, test `(set >> i) & 1`.

Companion code: [`04-bitmask-subsets.ts`](./04-bitmask-subsets.ts)
