# Capstone: benchmarking Array vs Map vs Set with bytecode notes

**Objective:** Tie together lessons 01-05 into one practical question —
"array, `Map`, or `Set`?" — by comparing their real access paths at the
engine level and writing correctness-focused benchmark helpers to probe it.

## Concept

An array index read and a `Map`/`Set` lookup are both described as "O(1)"
in interview answers, but they reach the value through completely
different machinery:

```
Array:  arr[i]
        packed backing store (lesson 04)
        [v0][v1][v2][v3][v4] ...
              ^
              i * elementSize  -->  direct pointer arithmetic, no hashing

Map/Set: map.get(k)  /  set.has(v)
        OrderedHashTable (V8's internal structure for JS Map/Set)
        buckets: [ -> ][ -> ][ -> ][ -> ]
                    |
                    hash(k) mod bucketCount --> probe bucket --> compare keys
        + a parallel insertion-order linked list (so iteration order
          matches insertion order, per spec)
```

An array read is direct offset arithmetic: no hashing, no equality checks,
no boxing beyond whatever the array's elements kind already costs (lesson
04). A `Map`/`Set` lookup must first **hash** the key (numbers, strings,
and objects hash differently — objects hash by identity), then probe a
bucket and compare keys for equality, then optionally walk the
insertion-order linked list on iteration. That is still O(1) *amortized*,
but with a materially larger constant than a packed-array read — the same
"same Big-O, different constant" story as packed-vs-holey arrays (lesson
04) and monomorphic-vs-megamorphic property access (lesson 05).

The other place these structures diverge is the **linear-scan trap**:
`array.includes(x)` / `array.indexOf(x)` are O(n) — no index exists to
skip ahead — while `set.has(x)` stays O(1) average regardless of size.
Reaching for an array when you actually need repeated membership tests is
one of the most common accidental-O(n²) bugs in interview code.

Finally, note where a plain object's **dictionary mode** (lesson 05) fits:
once an object loses its hidden class (e.g. after a `delete`), V8 falls
back to a per-object hash table that is conceptually the same idea as
`Map`'s `OrderedHashTable` — but `Map`/`Set` are hash tables *by design*
from the start, with no hidden-class fast path to fall out of, and no risk
of accidentally being megamorphic.

## Complexity

| Operation                                   | Time              | Notes                                                              |
|----------------------------------------------|-------------------|----------------------------------------------------------------------|
| Array indexed read `arr[i]`                   | O(1), tiny constant | direct offset into a packed backing store — see lesson 04           |
| Array `includes` / `indexOf` (membership)     | O(n)              | no index to skip ahead; must scan                                    |
| `Map.get` / `Map.set` / `Map.has`             | O(1) average      | hash + bucket probe in an `OrderedHashTable`, larger constant than an array read |
| `Set.has` / `Set.add`                         | O(1) average      | same `OrderedHashTable` mechanism, keys only                         |
| Plain-object dictionary-mode property get     | O(1) average      | lesson 05's post-`delete` fallback; conceptually the same idea as a `Map`, larger constant than a hidden-class hit |
| Worst case for any hash table (adversarial/degenerate hashing) | O(n) | not a practical concern for `number`/`string` keys in normal code |

## Walkthrough

`06-benchmarking-array-map-set.ts` builds three parallel lookup structures
over the same `0..n-1` key space with `buildSequentialArray`,
`buildLookupMap`, and `buildLookupSet`, so every comparison is apples to
apples. `sumViaArrayIndex`, `sumViaMapGet`, and `countViaSetHas` are the
three access paths from the diagram above, each doing real, checkable
work (summing looked-up values, or counting membership hits) rather than
a no-op loop, so `console.assert` can confirm they actually agree before
`timeIt` (the same `performance.now()` helper from lessons 04/05) times
them.

`arrayIncludesIsLinear` and `setHasIsConstant` demonstrate the
linear-scan trap directly: `hasViaArrayIncludes` and `hasViaSetHas` answer
the identical membership question over identical data, so the only
difference measured is O(n) scanning vs O(1) hashing.

The LeetCode solutions were picked because each one is a canonical
"which structure should I reach for" decision: `twoSum` needs a
value-to-index `Map` (not a linear array scan) to hit O(n); `containsDuplicate`
and `arrayIntersection` need a `Set` for O(1) membership; and
`lengthOfLongestSubstring` needs a `Map` to remember *where* a character
last occurred, not just *whether* it occurred.

## LeetCode practice

1. Two Sum (Easy) — value-to-index `Map` turns an O(n²) nested-loop scan into O(n)
2. 217. Contains Duplicate (Easy) — `Set` membership makes duplicate detection O(n) instead of O(n²)
3. 349. Intersection of Two Arrays (Easy) — two `Set`s turn intersection into O(n + m) instead of O(n × m)
4. 3. Longest Substring Without Repeating Characters (Medium) — a `Map` of char → last-seen-index drives an O(n) sliding window

## Key takeaways

- "O(1)" for array reads and "O(1) average" for `Map`/`Set` lookups hide a
  real constant-factor gap: direct offset arithmetic (lesson 04) vs
  hash-then-probe through an `OrderedHashTable`.
- Reach for a `Map`/`Set` the moment membership testing or key-based
  lookup happens more than once per element — `array.includes` inside a
  loop is the classic accidental-O(n²) smell.
- `Map`/`Set` and dictionary-mode objects (lesson 05) are the same idea —
  a real hash table — but `Map`/`Set` are hash tables from birth, with no
  hidden-class fast path to lose.
- None of this changes the Big-O answer you'd give in an interview; it
  changes which O(n) or O(1) solution is actually faster in production,
  which is the whole point of this topic (lesson 01).

Companion code: [`06-benchmarking-array-map-set.ts`](./06-benchmarking-array-map-set.ts)
