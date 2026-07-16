# Grouping Patterns (Anagrams, Categorize)

**Objective:** Bucket items into groups by a derived key using a `Map<key, item[]>`, turning "which items belong together?" into an O(n) pass.

## Concept

Grouping generalizes frequency counting: instead of mapping a key to a
*count*, map it to a *list* of the items that produced that key. The key
function is what defines "belong together" — sorted characters for
anagrams, parity for even/odd, string length, first letter, anything.

```
strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
keyFn(s) = sorted characters of s

"eat" -> key "aet"   "tea" -> key "aet"   "tan" -> key "ant"
"ate" -> key "aet"   "nat" -> key "ant"   "bat" -> key "abt"

Map<string, string[]>
┌───────┬──────────────────────┐
│ "aet" │ ["eat","tea","ate"]   │
├───────┼──────────────────────┤
│ "ant" │ ["tan","nat"]         │
├───────┼──────────────────────┤
│ "abt" │ ["bat"]               │
└───────┴──────────────────────┘
```

Each item is processed once: compute its key, then either push onto an
existing bucket or start a new one. That single pass replaces an O(n^2)
"compare every pair" approach (e.g. checking whether each string is an
anagram of every other string).

## Complexity

| Operation                                  | Time   | Space  |
| --------------------------------------------- | ------ | ------ |
| Group n items by key (key computed in O(k))    | O(n·k) | O(n)    |
| Lookup/append to a bucket                      | O(1) avg | —      |
| Intersect frequency maps across m words of length k | O(m·k) | O(k)  |
| Find largest/smallest group                     | O(number of groups) | O(1) |

`k` is the cost of computing the key (e.g. sorting a string of length k is
O(k log k), dominating the per-item cost in `groupAnagrams`).

## Walkthrough

`groupBy<T, K>` is the shared primitive: it takes items and a `keyFn`, and
returns a `Map<K, T[]>`. `groupAnagrams` (LeetCode 49) calls it with
`keyFn = s => sorted characters of s`. `findCommonCharacters`
(LeetCode 1002) takes a different angle on "categorize": it builds a
per-word frequency map via the local `charFrequency` helper and
intersects them by taking the minimum count per character across all
words. `hasUniqueOccurrences` (LeetCode 1207) groups values by frequency
implicitly — it builds a count map, then checks whether the *set* of
counts is exactly as large as the *map* of counts (a collision there means
two values share a count). `sortCharactersByFrequency` (LeetCode 451)
groups characters by count and emits each group together, highest-count
group first.

`partitionEvenOdd` and `largestGroupSize` (exercises) build directly on
`groupBy`: the first supplies a `parity` key function and reshapes the
result into a friendlier `{ even, odd }` object; the second scans any
`groupBy` result to find the biggest bucket.

## LeetCode practice

1. **49. Group Anagrams** (Medium) — the canonical grouping-by-derived-key problem.
2. **1002. Find Common Characters** (Easy) — categorize by intersecting frequency maps.
3. **1207. Unique Number of Occurrences** (Easy) — group by count, then check the counts themselves for uniqueness.
4. **451. Sort Characters By Frequency** (Medium) — group by count, emit groups in descending order.

## Key takeaways

- `Map<key, item[]>` is the generic tool for "which items go together?" — define the key function, then one pass.
- The choice of key function *is* the grouping rule (sorted chars = anagrams, parity = even/odd, etc.).
- Intersecting multiple frequency maps (min per key) answers "what's common to all of these?" in one pass per input.
- A `Set` built from a `Map`'s values can detect count collisions cheaply (`1207`'s trick).
- Grouping composes with frequency counting (lesson 04) and set operations (lesson 03) — many problems combine both.

Companion code: [`06-grouping-patterns.ts`](./06-grouping-patterns.ts)
