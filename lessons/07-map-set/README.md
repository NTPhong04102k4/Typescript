# 07 · Map & Set

Hash-based structures give amortized O(1) lookup, insert, and delete, which
turns a huge class of brute-force O(n^2) problems into single-pass O(n)
solutions. This topic starts from how a hash table actually buckets and
resolves collisions, contrasts JS `Map`/`Set` with plain objects and TS
`Record<>`, and then drills the recurring interview patterns built on top:
frequency counting, complement lookups, grouping, and cache-eviction tricks.
Work through the lessons in order — later ones assume the vocabulary
(buckets, load factor, complement) introduced early on.

Lessons:
- 01 — Hash table fundamentals, ASCII bucket diagram
- 02 — JS Map vs Object vs `Record<>` in TS (hidden-class link)
- 03 — Set operations & use cases
- 04 — Frequency counting patterns
- 05 — Two-sum family & complement patterns
- 06 — Grouping patterns (anagrams, categorize)
- 07 — LRU/LFU-adjacent map tricks
- 08 — LeetCode practice set: Map/Set
