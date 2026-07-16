# LeetCode Practice Set: Map/Set

**Objective:** Apply everything from this topic — frequency maps, complement lookups, bidirectional maps, prefix-sum counting, and sliding-window frequency comparison — to a fresh set of Map/Set problems spanning Easy to Hard.

## Concept

This lesson is deliberately concept-light: it's a drill set, not a new
pattern. Each problem below reuses a technique from an earlier lesson in
this topic but applies it to a scenario you haven't seen yet, which is the
real test of whether the pattern actually stuck.

```
pattern                         -> where it first appeared -> where it's drilled here
frequency map (value -> count)  -> lesson 04               -> canConstructRansomNote
bidirectional Map pair           -> lesson 02 (isIsomorphic) -> wordPattern
Map<key, count> over a range     -> lesson 05 (complement)   -> findErrorNums
Set to detect a cycle            -> lesson 03 (membership)   -> isHappy
Map<prefixSum, count>            -> new: prefix-sum counting -> subarraySumEqualsK
two frequency Maps + window      -> lesson 04 (438)          -> minWindowSubstring
```

The one genuinely new idea here is **prefix-sum counting**
(`subarraySumEqualsK`): instead of mapping a value to how many times it was
seen, map a *running sum* to how many times that sum has occurred as a
prefix. "Does some subarray sum to k?" becomes "has `prefixSum - k` occurred
as an earlier prefix sum?" — the same complement lookup from lesson 05,
just applied to running sums instead of raw values.

## Complexity

| Problem                                     | Time      | Space   |
| --------------------------------------------- | --------- | ------- |
| 383. Ransom Note                              | O(n + m)  | O(1) (bounded alphabet) |
| 290. Word Pattern                             | O(n)      | O(n)     |
| 645. Set Mismatch                             | O(n)      | O(n)     |
| 202. Happy Number                             | O(log n) per step, bounded total steps | O(log n) |
| 560. Subarray Sum Equals K                    | O(n)      | O(n)     |
| 76. Minimum Window Substring                  | O(n + m)  | O(1) (bounded alphabet) |
| 442. Find All Duplicates in an Array (exercise) | O(n)      | O(n)     |
| 1189. Maximum Number of Balloons (exercise)     | O(n)      | O(1) (fixed 5-letter alphabet) |

## Walkthrough

`canConstructRansomNote` (LeetCode 383) builds a frequency map of
`magazine`, then decrements it while scanning `ransomNote`; a missing or
already-exhausted character means the note can't be built. `wordPattern`
(LeetCode 290) mirrors `isIsomorphic`'s two-Map trick from lesson 02, but
maps single characters to whole words instead of characters to characters.

`findErrorNums` (LeetCode 645) counts occurrences of every value in `nums`
into a `Map<number, number>`, then walks `1..n` once: whichever value has
count 2 is the duplicate, whichever has count 0 is the missing one.
`isHappy` (LeetCode 202) repeatedly replaces `n` with the sum of the
squares of its digits (via the local `sumOfSquaredDigits` helper), using a
`Set` to detect the cycle that non-happy numbers always fall into.

`subarraySumEqualsK` (LeetCode 560) is the new pattern: a `Map<prefixSum,
count>` seeded with `{0: 1}` (the empty prefix) lets every element ask "how
many earlier prefixes equal `prefixSum - k`?" in O(1), accumulating that
into the answer before recording the current prefix sum. `minWindowSubstring`
(LeetCode 76) reuses the sliding-window frequency comparison from
`findAnagramsIndices` (lesson 04) but with a variable-length window: `need`
is built once from `t`, `windowCounts` grows as `right` advances, and the
window only shrinks (`left` advances) while a `satisfied` counter shows
every required character still meets its needed count.

`findAllDuplicatesStub`/`findAllDuplicates` (exercise, LeetCode 442) is a
frequency-map variant of `findErrorNums` for the case where *multiple*
duplicates can exist. `maxNumberOfBalloonsStub`/`maxNumberOfBalloons`
(exercise, LeetCode 1189) counts how many times "balloon" can be spelled
from `text`'s letters by comparing available counts against the per-letter
requirement (`l` and `o` need two each), taking the minimum ratio across
all five required letters.

## LeetCode practice

1. **383. Ransom Note** (Easy) — frequency map built then decremented.
2. **290. Word Pattern** (Easy) — bidirectional Map, char <-> word.
3. **645. Set Mismatch** (Easy) — frequency map over a known value range finds a duplicate and a gap.
4. **202. Happy Number** (Easy) — Set detects a cycle in a bounded sequence.
5. **560. Subarray Sum Equals K** (Medium) — prefix-sum complement counting.
6. **76. Minimum Window Substring** (Hard) — two frequency maps, variable-length sliding window.

## Key takeaways

- The same handful of Map/Set primitives — frequency counting, bidirectional mapping, complement lookup, cycle detection via Set, sliding-window comparison — cover a surprisingly wide range of problems once you recognize the shape.
- Prefix-sum counting is complement lookup in disguise: track running sums in a Map instead of raw values, and ask for `prefixSum - k` instead of `target - value`.
- A `Set` is the natural tool for cycle detection in any bounded, deterministic sequence (Happy Number, but also linked-list cycle detection later in the curriculum).
- Sliding-window problems with a variable-length window (Minimum Window Substring) need one extra piece of bookkeeping beyond a fixed-length window (lesson 04): a counter for "how many distinct requirements are currently satisfied," so you know exactly when it's safe to shrink.
- When a problem restricts values to a known range (like 1..n in Set Mismatch), a Map keyed by that range often out-performs a general hash-based approach only in constants, not asymptotically — but it makes the reasoning about "what's missing" much simpler.

Companion code: [`08-leetcode-practice.ts`](./08-leetcode-practice.ts)
