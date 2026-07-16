# Hashing & Anagram Techniques

**Objective:** Use character frequency counts (hashing) to compare strings
structurally — same letters, same counts — in linear time.

## Concept

Two strings are anagrams if they contain exactly the same characters with
exactly the same counts, in any order. Sorting both strings and comparing
is O(n log n); counting characters into a fixed-size array (or `Map`) and
comparing counts is O(n).

```
s = "anagram"   t = "nagaram"

count(s): a:3 n:1 g:1 r:1 m:1
count(t): a:3 n:1 g:1 r:1 m:1
                same counts -> anagram
```

A frequency count also makes a great **grouping key**: sort each word's
letters (or build a 26-length count array) and use that as a hash-map key
to bucket all anagrams of the same word together.

```
["eat","tea","tan","ate","nat","bat"]
sorted-key("eat") = "aet"  -> bucket "aet": [eat, tea, ate]
sorted-key("tan") = "ant"  -> bucket "ant": [tan, nat]
sorted-key("bat") = "abt"  -> bucket "abt": [bat]
```

For substring anagram search, combine this with a **sliding window** (see
lesson 03): maintain a running count array for the current window and
compare it against the target's count array as the window slides — no need
to re-sort on every step.

## Complexity

| Operation                                   | Time | Space |
|-----------------------------------------------|------|-------|
| Valid Anagram via count array (242)           | O(n) | O(Σ)  |
| Valid Anagram via sort                        | O(n log n) | O(n) |
| Group Anagrams via sorted-key map (49)         | O(n · k log k) | O(n · k) |
| Find All Anagrams in a String, sliding (438)   | O(n) | O(Σ)  |

`n` is the number of strings (or string length where noted), `k` is average
string length, `Σ` is the alphabet size.

## Walkthrough

`04-hashing-anagrams.ts` covers three anagram-flavored hashing problems:

- `isAnagram` solves **242. Valid Anagram** with a single 26-length count
  array shared across both strings (increment for `s`, decrement for `t`,
  valid iff everything returns to zero).
- `groupAnagrams` solves **49. Group Anagrams** by computing a canonical
  sorted-letters key per word and bucketing into a `Map<string, string[]>`.
- `findAnagrams` solves **438. Find All Anagrams in a String** using the
  sliding-window + frequency-array comparison technique from lesson 03,
  collecting every valid start index.
- The exercise implements **205. Isomorphic Strings** using two hash maps
  for a bidirectional character mapping.

## LeetCode practice

- 242. Valid Anagram (Easy)
- 49. Group Anagrams (Medium)
- 438. Find All Anagrams in a String (Medium)
- 205. Isomorphic Strings (Easy)

## Key takeaways

- A fixed-size count array is a cheap, allocation-light hash for
  fixed-alphabet problems — faster than sorting for anagram checks.
- A canonical key (sorted letters, or a stringified count array) turns
  "group by structural equivalence" into a plain hash-map grouping problem.
- Sliding-window anagram search reuses the frequency-array comparison
  incrementally instead of recomputing it for every window position.
- Isomorphic-string style problems need a hash map in *both* directions to
  guarantee the mapping is one-to-one, not just one-way.

Companion code: [`04-hashing-anagrams.ts`](./04-hashing-anagrams.ts)
