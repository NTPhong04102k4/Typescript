# Pattern Matching Intuition (KMP) with ASCII Trace

**Objective:** Search for a pattern inside a text in O(n + m) time by
precomputing a failure function that avoids re-scanning already-matched
characters.

## Concept

Naive substring search re-tries every text position from scratch, giving
O(n·m) worst case (e.g. searching "aaaa...aab" for "aaab"). The
**Knuth-Morris-Pratt** algorithm precomputes, for the pattern itself, the
length of the longest proper prefix of `pattern[0..i]` that is also a
suffix of `pattern[0..i]`. This is the **failure function** (a.k.a. the
"partial match" or "LPS" table).

When a mismatch occurs at pattern position `j`, instead of restarting the
text pointer, KMP jumps `j` back to `failure[j-1]` — the longest prefix
already known to match — because that prefix is guaranteed to already
align with the text.

```
pattern = "a b a b c"
index    =  0 1 2 3 4

failure function trace:
i=0: "a"        -> lps[0] = 0                (no proper prefix)
i=1: "ab"       -> lps[1] = 0                ('b' != 'a')
i=2: "aba"      -> lps[2] = 1                ("a" prefix == "a" suffix)
i=3: "abab"     -> lps[3] = 2                ("ab" prefix == "ab" suffix)
i=4: "ababc"    -> lps[4] = 0                ('c' breaks the chain)

failure table:  [0, 0, 1, 2, 0]
```

Matching trace of pattern `"abab"` against text `"ababaabab"`:

```
text:    a b a b a a b a b
pattern: a b a b
         ^ ^ ^ ^              i=0..3 all match -> found at index 0
                     (slide pattern using failure[] instead of restarting)
text:    a b a b a a b a b
pattern:         a b a b
                 ^ ^ ^ ^      found again at index 5
```

## Complexity

| Operation                                | Time      | Space |
|--------------------------------------------|-----------|-------|
| Build failure function (length m pattern)  | O(m)      | O(m)  |
| KMP search (text length n, pattern length m) | O(n + m) | O(m)  |
| Naive substring search (worst case)        | O(n·m)    | O(1)  |

## Walkthrough

`06-pattern-matching-kmp.ts` builds KMP from the ground up:

- `buildFailureFunction` computes the LPS table for a pattern, exactly as
  traced above.
- `kmpSearch` uses that table to find every occurrence of a pattern in a
  text in one O(n + m) pass, returning all match start indices.
- `strStr` solves **28. Find the Index of the First Occurrence in a
  String** by returning the first index from `kmpSearch` (or -1).
- `longestHappyPrefix` solves **1392. Longest Happy Prefix** by reading the
  answer directly off the failure function of the string itself (the
  longest prefix that is also a suffix, excluding the whole string).
- The exercise implements **459. Repeated Substring Pattern** using the
  classic failure-function divisibility trick.

## LeetCode practice

- 28. Find the Index of the First Occurrence in a String (Easy)
- 459. Repeated Substring Pattern (Easy)
- 1392. Longest Happy Prefix (Hard)

## Key takeaways

- The failure function encodes "if this character mismatches, how much of
  my own prefix can I reuse instead of restarting?"
- KMP never moves the text pointer backward, which is what guarantees
  O(n + m) instead of O(n·m).
- The failure function of a string, evaluated at its last position, is
  exactly the "longest proper prefix that is also a suffix" — reusable for
  several problems beyond substring search (1392, 459).
- For `459. Repeated Substring Pattern`: if `n % (n - failure[n-1]) === 0`
  and `failure[n-1] > 0`, the string is built from repeating that shorter
  unit.

Companion code: [`06-pattern-matching-kmp.ts`](./06-pattern-matching-kmp.ts)
