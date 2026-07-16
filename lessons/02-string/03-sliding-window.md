# Sliding Window on Strings

**Objective:** Maintain a variable-size window with two pointers to solve
substring problems in a single O(n) pass instead of checking every
substring.

## Concept

A sliding window keeps a `left` and `right` pointer that both only move
forward. `right` expands the window to include new characters; when the
window violates some constraint (a repeated character, too many distinct
characters, not enough of a target character), `left` shrinks it from the
front. Because both pointers only move forward and never backtrack, the
total work is O(n) even though it *feels* like a nested loop.

```
s = "a b c a b c b b"
window growing while all-unique:
 [a b c]a b c b b        left=0 right=2   window="abc", ok
  a[b c a]b c b b        left=1 right=3   'a' repeats c(0) -> shrink: left jumps to 1
  a b[c a b]c b b        left=2 right=4   window="cab", ok
        ...
```

For **minimum window substring** style problems, the window instead grows
until it *satisfies* a requirement (contains all needed characters), then
shrinks from the left as far as possible while still satisfying it,
recording the smallest valid window seen:

```
s = "ADOBECODEBANC", t = "ABC"
grow right until window contains A,B,C:
 [A D O B E C]O D E B A N C   -> valid, length 6, try shrinking left
  A[D O B E C]O D E B A N C   -> still valid ('A' needed again later), length 5
  ...continue scanning...
  ...eventually find "BANC" (length 4) as the minimum
```

## Complexity

| Operation                                      | Time | Space |
|-------------------------------------------------|------|-------|
| Sliding window, fixed alphabet counts            | O(n) | O(Σ)  |
| Longest Substring Without Repeating (3)          | O(n) | O(min(n, Σ)) |
| Minimum Window Substring (76)                    | O(n) | O(Σ)  |
| Longest Repeating Character Replacement (424)    | O(n) | O(Σ)  |
| Permutation in String (567)                      | O(n) | O(Σ)  |

`Σ` is the alphabet size (e.g. 26 for lowercase letters, 128 for ASCII) —
constant relative to `n`, so window-count storage is effectively O(1).

## Walkthrough

`03-sliding-window.ts` implements four variable/fixed window patterns:

- `lengthOfLongestSubstring` solves **3. Longest Substring Without
  Repeating Characters** using a `Map<string, number>` of last-seen indices
  to jump `left` forward directly instead of shrinking one step at a time.
- `minWindow` solves **76. Minimum Window Substring** with a "need" count
  map and a `formed` counter tracking how many distinct required characters
  are currently satisfied.
- `characterReplacement` solves **424. Longest Repeating Character
  Replacement** by tracking the count of the most frequent character in the
  window and shrinking whenever replacements needed exceed `k`.
- The exercise implements **567. Permutation in String** with a
  fixed-size window and frequency-array comparison.

## LeetCode practice

- 3. Longest Substring Without Repeating Characters (Medium)
- 76. Minimum Window Substring (Hard)
- 424. Longest Repeating Character Replacement (Medium)
- 567. Permutation in String (Medium)

## Key takeaways

- Both window pointers only move forward, so total work is O(n) even though
  the pattern looks like nested loops.
- Use a map/array of counts to answer "does the window still satisfy the
  constraint?" in O(1) instead of rescanning the window.
- "Shrink while valid" (minimum window) and "grow while valid, shrink on
  violation" (longest substring) are the two core shapes of this technique.
- Fixed-size windows (permutation-in-string) can compare frequency arrays
  incrementally instead of rebuilding them every slide.

Companion code: [`03-sliding-window.ts`](./03-sliding-window.ts)
