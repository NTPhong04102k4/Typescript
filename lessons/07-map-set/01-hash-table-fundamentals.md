# Hash Table Fundamentals

**Objective:** Understand how a hash table maps keys to array buckets, why collisions happen, and how chaining resolves them.

## Concept

A hash table is an array (`buckets`) plus a hash function that turns a key
into an index. Insert, lookup, and delete all start with the same step:
hash the key, jump straight to that bucket, and only then do the (usually
tiny) work of comparing keys inside it. That jump is what makes hashing
O(1) on average instead of O(n) like scanning an array.

Two keys can hash to the same index — a **collision**. Separate chaining
handles this by storing a small list of `[key, value]` pairs per bucket, so
a collision only costs an extra linear scan within that one bucket, not the
whole table.

```
bucketCount = 4
hash("apple")  -> 1
hash("cherry") -> 1   (collision with "apple")
hash("date")   -> 3

index:   0        1                      2        3
       [ ]   [("apple",1) -> ("cherry",3)]  [ ]   [("date",7)]
              ^ chained list inside one bucket

lookup("cherry"):
  1. hash("cherry") = 1        -> jump straight to bucket 1
  2. scan chain: "apple"? no -> "cherry"? yes -> return 3
```

When the table fills up (`size / bucketCount` — the **load factor** —
crosses a threshold, commonly 0.75), chains get long and lookups degrade
toward O(n). The fix is **resizing**: allocate a bigger bucket array and
rehash every entry into it, which restores short chains at the cost of one
expensive O(n) rehash pass.

## Complexity

| Operation                | Average   | Worst case (heavy collisions) |
| ------------------------ | --------- | ------------------------------ |
| `set` / insert            | O(1)      | O(n)                            |
| `get` / lookup             | O(1)      | O(n)                            |
| `delete`                  | O(1)      | O(n)                            |
| Resize (amortized per op) | O(1)      | O(n) for the single resize pass |
| Space                      | O(n)      | O(n)                             |

Worst case happens when every key hashes to the same bucket (a bad hash
function or adversarial input), turning the table into one long linked
list.

## Walkthrough

`hashStringToBucket` computes a polynomial rolling hash and reduces it into
`[0, bucketCount)` with `%`. `SimpleHashTable<V>` wraps an array of chains
(`buckets: Entry<V>[][]`) and implements `set`, `get`, `has`, and `delete` by
hashing the key once and then scanning only the matching bucket's chain.
`loadFactor` and `bucketSizes()` expose the internal state so you can watch
collisions accumulate; `set` calls the private `resize` method once
`loadFactor` exceeds 0.75, doubling the bucket count and rehashing every
entry. The run block inserts enough keys to force a resize and checks every
value still resolves correctly afterward.

`largestBucketSize` (exercise) reads `bucketSizes()` to find the worst-case
chain length. `anagramsHashDifferently` (exercise) shows that a positional
hash is order-sensitive: `"act"` and `"cat"` share the same characters but
land in different buckets.

## LeetCode practice

1. **1. Two Sum** (Easy) — the canonical hash-map lookup problem.
2. **242. Valid Anagram** (Easy) — character frequency via hashing.
3. **705. Design HashSet** (Easy) — implement the structure this lesson covers.
4. **706. Design HashMap** (Easy) — implement chaining/bucketing directly.

## Key takeaways

- Hashing trades a little memory for O(1) average-time access by turning a key into a direct array index.
- Collisions are inevitable (pigeonhole principle); chaining resolves them by keeping a small list per bucket.
- Load factor (`size / bucketCount`) predicts chain length — resize before it gets too high.
- Worst-case degrades to O(n) only when many keys collide into the same bucket; a good hash function makes this rare.
- Native `Map`/`Set` implement all of this (plus much more tuning) so you rarely hand-roll a hash table in practice.

Companion code: [`01-hash-table-fundamentals.ts`](./01-hash-table-fundamentals.ts)
