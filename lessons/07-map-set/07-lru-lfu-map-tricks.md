# LRU/LFU-Adjacent Map Tricks

**Objective:** Exploit `Map`'s guaranteed insertion-order iteration to build O(1) cache-eviction structures (LRU, LFU, a randomized O(1) set), and learn two reusable `Map`-based helper patterns (memoize, get-or-compute).

## Concept

A JS `Map` remembers insertion order, and **re-inserting an existing key
moves it to the end of that order** (delete it, then set it again). That one
fact is enough to build a least-recently-used cache: touch a key on
`get`/`put` by deleting and re-setting it, and the *first* key in iteration
order — `map.keys().next().value` — is always the coldest one, ready to
evict in O(1).

```
LRUCache(capacity = 2)

put(1,1)        put(2,2)        get(1)          put(3,3)
Map: {1:1}      Map: {1:1,2:2}  delete(1),      evicts front (2),
                                set(1,1) again  then inserts 3
                                Map: {2:2,1:1}  Map: {1:1,3:3}
                                        ^ 1 moved to the back
                                          (most-recently-used)
                front (LRU) --------------------> back (MRU)
```

LFU needs one more level of bucketing: which key is *least frequently*
used, breaking ties by recency. `LFUCache` keeps three maps working
together — `valueOf` (key -> value), `freqOf` (key -> access count), and
`keysByFreq` (frequency -> `Set` of keys at that frequency). A `Set`'s
insertion order breaks ties toward the least-recently-used key within a
frequency bucket, and a running `minFreq` means eviction never has to scan
for the smallest frequency.

`RandomizedSet` applies a different map trick: pairing a `Map<value,
index>` with a plain array turns "remove from the middle of an array" into
an O(1) operation — swap the target with the last element, update the
swapped element's index in the map, then pop.

Finally, two generic helpers turn "look it up, or else compute and store
it" into a one-line call: `memoize` wraps any single-argument function in a
`Map`-backed cache, and `getOrCompute` does the same thing for one key of an
existing `Map`, which is exactly the "get-or-else-set" step that grouping
(lesson 06) and frequency counting (lesson 04) do inline.

## Complexity

| Structure / operation                | Time      | Space |
| ------------------------------------- | --------- | ----- |
| `LRUCache.get` / `.put`                | O(1)      | O(capacity) |
| `LFUCache.get` / `.put`                | O(1)      | O(capacity) |
| `RandomizedSet.insert` / `.remove` / `.getRandom` | O(1) | O(n) |
| `memoize`d call (cache hit)             | O(1)      | O(distinct args seen) |
| `memoize`d call (cache miss)            | O(cost of `fn`) | — |
| `getOrCompute`                          | O(1) avg + O(cost of `factory` on miss) | — |

## Walkthrough

`LRUCache<K, V>` wraps a single `Map<K, V>` as `store`. `get` deletes and
re-sets the key on a hit (marking it most-recently-used); `put` deletes an
existing key before re-setting it, or evicts `store.keys().next().value`
(the least-recently-used key) once `store.size` reaches `capacity`.

`LFUCache<K, V>` layers `valueOf`, `freqOf`, and `keysByFreq` behind a
private `bumpFrequency` method: it removes the key from its current
frequency bucket (advancing `minFreq` if that bucket is now empty), then
adds it to the `freq + 1` bucket. `get` calls `bumpFrequency` on every hit;
`put` evicts from `keysByFreq.get(minFreq)` when the cache is full, always
taking the *first* key in that bucket's `Set` (the oldest at that
frequency).

`RandomizedSet` keeps `indexOf: Map<number, number>` alongside a `values`
array. `remove` swaps the target with the last element, updates
`indexOf` for the swapped value, then pops — no shifting required.

`memoizeStub`/`memoize` (exercise) close over a `Map<Arg, Result>` and
return a wrapped function that checks the cache before calling the
original. `getOrComputeStub`/`getOrCompute` (exercise) generalize the
"has it? no — compute, store, return" dance for any `Map` and any key,
independent of memoization.

## LeetCode practice

1. **146. LRU Cache** (Medium) — `Map` re-insertion order as an LRU list, implemented above as `LRUCache`.
2. **460. LFU Cache** (Hard) — three cooperating maps for O(1) frequency-based eviction, implemented above as `LFUCache`.
3. **380. Insert Delete GetRandom O(1)** (Medium) — `Map<value, index>` + swap-to-end array removal, implemented above as `RandomizedSet`.

## Key takeaways

- A `Map`'s insertion order is not incidental — re-inserting a key (delete then set) moves it to the end, which is exactly the primitive an LRU cache needs.
- LFU needs one extra layer of bucketing (frequency -> `Set` of keys) on top of LRU's single-map trick; `minFreq` avoids ever scanning for the minimum.
- Swap-with-last-element is the standard trick for O(1) removal from the middle of an array when order doesn't matter, and a companion `Map<value, index>` is what makes finding the target O(1) too.
- `memoize` and `getOrCompute` are the same underlying idea — "look up or else compute and store" — applied respectively to an entire function's results and to one key of an existing `Map`.
- None of this needs a hand-rolled doubly-linked list: native `Map`'s ordering guarantees do the LRU bookkeeping for you.

Companion code: [`07-lru-lfu-map-tricks.ts`](./07-lru-lfu-map-tricks.ts)
