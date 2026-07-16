# Set Operations & Use Cases

**Objective:** Use `Set` for membership checks, deduplication, and the classic union/intersection/difference operations in O(1)-average time.

## Concept

A `Set` is a `Map` that only cares about keys — it stores unique values and
answers "have I seen this?" in O(1) average time. That single capability
unlocks three recurring patterns: deduplication, fast membership testing
inside a loop (replacing an O(n) `.includes()` scan), and classic
set-algebra (union, intersection, difference).

```
A = {1, 2, 3}        B = {2, 3, 4}

union(A, B)          = {1, 2, 3, 4}   every element in A or B
intersection(A, B)   = {2, 3}         every element in both
difference(A, B)     = {1}            in A, not in B
symmetricDiff(A, B)  = {1, 4}         in exactly one of A, B

   A only     both      B only
  ┌──────┐  ┌──────┐  ┌──────┐
  │  1   │  │ 2  3 │  │  4   │
  └──────┘  └──────┘  └──────┘
   diff(A,B)  intersection   diff(B,A)
  └───────── symmetricDifference ─────────┘
```

Internally a `Set` uses the same hash table as `Map` (bucket + chain, as in
lesson 01) — `.has()` hashes the value and checks one bucket, same as
`Map.get()`.

## Complexity

| Operation                          | Average | Worst case (heavy collisions) |
| ----------------------------------- | ------- | ------------------------------ |
| `add` / `has` / `delete`             | O(1)    | O(n)                            |
| `dedupe` (build a Set from n items)  | O(n)    | O(n^2)                          |
| `union` / `difference`               | O(n + m) | O(n · m)                       |
| `intersection` (iterate smaller set) | O(min(n, m)) | O(n · m)                   |
| Space                                | O(n)    | O(n)                             |

## Walkthrough

`dedupe` spreads a `Set` back into an array (order not guaranteed to match
input); `dedupePreservingOrder` uses an explicit `seen` Set alongside a
result array to keep first-occurrence order. `union`, `intersection`, and
`difference` implement classic set algebra directly on `Set<T>`;
`intersection` iterates the smaller set for efficiency. `symmetricDifference`
and `isSubset` are exercises worked out below the stubs.

`intersectionOfArrays` (LeetCode 349) is a one-line application of
`intersection`. `intersectionOfArraysWithCounts` (LeetCode 350) needs a
`Map<number, number>` instead of a `Set`, since duplicates must be counted,
not just detected. `containsDuplicate` (LeetCode 217) compares
`new Set(nums).size` against `nums.length` — if a Set shrank the count,
there was a duplicate. `longestConsecutiveSequence` (LeetCode 128) builds a
`Set` of all values, then only starts counting a run from a number whose
predecessor (`value - 1`) is absent — that guarantees each run is walked
exactly once, giving O(n) overall despite the nested `while`.

## LeetCode practice

1. **217. Contains Duplicate** (Easy) — Set size vs array length.
2. **349. Intersection of Two Arrays** (Easy) — direct set intersection.
3. **350. Intersection of Two Arrays II** (Easy) — counts require a Map, not a Set.
4. **128. Longest Consecutive Sequence** (Medium) — O(n) via Set membership, no sorting.

## Key takeaways

- `Set.has()` is O(1) average — use it to replace `.includes()` inside loops to avoid accidental O(n^2).
- Union, intersection, and difference are all linear in the size of their inputs when built on Sets.
- Iterate the smaller set during intersection to minimize work.
- When duplicates matter (counts, not just presence), reach for `Map<value, count>` instead of `Set`.
- `Longest Consecutive Sequence`'s O(n) trick — only start a run from a value with no predecessor — is a pattern worth memorizing.

Companion code: [`03-set-operations.ts`](./03-set-operations.ts)
