# Two-Sum Family & Complement Patterns

**Objective:** Solve "does a partner value exist?" problems in one pass by looking up each element's complement in a Map/Set instead of nested loops.

## Concept

The complement pattern: while scanning a collection once, for each value
`v` compute what partner value would satisfy the condition (usually
`target - v`), and check whether that partner has already been seen. A
`Map` (or `Set`, when you only need presence, not an index/count) turns
"has a partner appeared yet?" into an O(1) lookup, collapsing an O(n^2)
nested loop into a single O(n) pass.

```
nums = [2, 7, 11, 15], target = 9

i=0: v=2   complement=7   seen={}         -> not found, remember 2 -> idx 0
i=1: v=7   complement=2   seen={2:0}      -> found! 2 was seen at index 0

seen map grows left to right:
  index:      0      1
  value:      2      7
  seen map: {2->0} {2->0, 7->1}
                     ^ complement of 7 is 2, already in map -> answer [0, 1]
```

The same idea generalizes: **3Sum** fixes one element and turns the
remaining two into a two-sum-to-`(-fixed)` subproblem solved with a `Set`.
**4Sum II** splits four arrays into two pair-sum halves and looks up
negated sums in a `Map<sum, count>`. Design problems like **Two Sum III**
just wrap the same complement check behind `add`/`find` methods.

## Complexity

| Approach                              | Time        | Space      |
| --------------------------------------- | ----------- | ---------- |
| Two Sum: brute-force nested loop         | O(n^2)      | O(1)        |
| Two Sum: Map complement lookup           | O(n)        | O(n)        |
| Two Sum III: `add`                        | O(1)        | O(n) total  |
| Two Sum III: `find`                       | O(n) (scans distinct values) | O(1) extra |
| 3Sum: sort + fix one + Set two-sum        | O(n^2)      | O(n)        |
| 4Sum II: two pair-sum Maps                | O(n^2)      | O(n^2) worst case |

## Walkthrough

`twoSumIndices` is the canonical complement lookup (LeetCode 1).
`TwoSumDataStructure` (LeetCode 170) wraps a `Map<value, count>` behind
`add`/`find`, handling the edge case where the complement equals the value
itself (requires count > 1). `threeSum` (LeetCode 15) sorts the input,
fixes `sorted[i]` while skipping duplicates, then reuses the complement
idea with a `Set` to find pairs summing to `-sorted[i]`, skipping duplicate
`j` positions to avoid duplicate triplets. `fourSumCount` (LeetCode 454)
precomputes every `nums1[i] + nums2[j]` sum into a `Map<sum, count>`, then
for each `nums3[k] + nums4[l]` looks up how many pair-sums equal its
negation.

`uniqueTwoSumPairs` and `countPairsWithSum` (exercises) apply the same
complement check to two related but distinct questions: "what are the
unique value pairs?" (needs a `Set` of already-emitted pairs to dedupe) and
"how many index pairs exist?" (needs only a running frequency `Map`, no
pair generation at all).

## LeetCode practice

1. **1. Two Sum** (Easy) — the base complement pattern.
2. **170. Two Sum III - Data structure design** (Easy) — complement pattern behind add/find.
3. **15. 3Sum** (Medium) — fix one element, complement-search the rest.
4. **454. 4Sum II** (Medium) — complement search across precomputed pair sums.

## Key takeaways

- The complement pattern replaces an O(n^2) nested loop with one O(n) pass plus a Map/Set.
- Use a `Set` when you only need presence; use a `Map` when you need an index, count, or other payload.
- Sorting first (3Sum) enables duplicate-skipping, which a pure hash approach on unsorted data can't do as cleanly.
- Splitting a k-sum problem into two halves (4Sum II) trades doubled space for a quadratic-instead-of-quartic runtime.
- Always decide up front whether you need unique pairs/values or a raw count — it changes whether you need a Set at all.

Companion code: [`05-two-sum-family.ts`](./05-two-sum-family.ts)
