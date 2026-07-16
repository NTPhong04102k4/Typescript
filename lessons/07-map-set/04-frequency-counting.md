# Frequency Counting Patterns

**Objective:** Use a `Map<value, count>` to answer "how many times does X appear?" in a single O(n) pass, replacing nested-loop comparisons.

## Concept

Frequency counting is the single most common hash-map pattern in interview
problems: build a `Map` (or fixed-size array, for a bounded alphabet) from
value to occurrence count in one pass, then answer comparisons, lookups, or
rankings against that map in O(1) each.

```
s = "aabbbc"

index: 0 1 2 3 4 5
char:  a a b b b c

frequency map after one pass:
  a -> 2
  b -> 3
  c -> 1

  ┌───┬───┐
  │ a │ 2 │
  ├───┼───┤
  │ b │ 3 │
  ├───┼───┤
  │ c │ 1 │
  └───┴───┘
```

A common extension is the **sliding-window frequency comparison**: keep a
running frequency map for a fixed-size window over a string/array, updating
it by one add + one remove as the window slides, instead of recomputing
from scratch — turning an O(n·k) brute force into O(n).

## Complexity

| Operation                                | Time      | Space     |
| ------------------------------------------ | --------- | --------- |
| Build frequency map over n items            | O(n)      | O(k) distinct keys |
| Lookup a count                              | O(1) avg  | —          |
| Sliding-window frequency update (add+remove) | O(1) avg per slide | O(k) |
| Full window-vs-window comparison (bounded alphabet) | O(alphabet size) | O(k) |
| Bucket-sort by frequency (values ≤ n)        | O(n)      | O(n)       |

## Walkthrough

`buildFrequencyMap` is the shared primitive: one pass, one `Map`. `isAnagram`
(LeetCode 242) builds a frequency map of `s`, then decrements it while
scanning `t` — any missing/zero count means not an anagram.
`firstUniqueCharIndex` (LeetCode 387) counts once, then re-scans to find the
first character whose count is exactly 1.

`findAnagramsIndices` (LeetCode 438) is the sliding-window version: `need`
is `p`'s frequency map, `window` tracks the current substring of length
`p.length`, updated by one add and one remove per step, and
`frequenciesMatch` compares `window` against `need` (cheap since the
alphabet is bounded). `topKFrequent` (LeetCode 347) avoids sorting the
frequency map by bucket-sorting values into `buckets[count]` — since a
count can never exceed `nums.length`, this runs in O(n) instead of
O(n log n).

`mostFrequentElement` and `frequencyEntriesDescending` are exercises that
build on `buildFrequencyMap` to answer "which is most common" and "rank all
counts," respectively.

## LeetCode practice

1. **242. Valid Anagram** (Easy) — frequency map built then decremented.
2. **387. First Unique Character in a String** (Easy) — count once, scan for count === 1.
3. **438. Find All Anagrams in a String** (Medium) — sliding-window frequency comparison.
4. **347. Top K Frequent Elements** (Medium) — bucket sort by frequency for O(n).

## Key takeaways

- `Map<value, count>` turns "compare all pairs" problems into a single O(n) pass.
- Sliding-window frequency comparisons update incrementally (one add, one remove) instead of recomputing per window.
- When counts are bounded by input length, bucket sort by frequency beats sorting the frequency map.
- Decrementing a frequency map while scanning a second sequence is a fast way to check "same multiset of elements."
- Frequency counting is a building block for grouping (lesson 06) and cache-eviction tricks (lesson 07).

Companion code: [`04-frequency-counting.ts`](./04-frequency-counting.ts)
