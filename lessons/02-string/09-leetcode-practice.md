# LeetCode Practice Set: String

**Objective:** Apply every technique from this topic — two pointers,
hashing, stack parsing, digit-by-digit simulation — to a graded set of
real String problems, Easy through Hard.

## Concept

This lesson is a capstone: no new technique is introduced. Instead, seven
problems are solved end to end, each reusing a pattern from lessons
01–08 (hashing for frequency counts, two pointers for word reversal, stack
parsing for nested/valid structures) or extending it to a new context
(digit-by-digit string arithmetic, sliding-window hashing over a fixed
window).

```
grade-school multiplication (43. Multiply Strings), same idea as by-hand math:

      1 2 3
    x   4 5
    -------
      6 1 5   (123 * 5)
    4 9 2     (123 * 4, shifted one place left)
    -------
    5 5 3 5

  each digit pair (i, j) contributes to result position (i + j) and
  (i + j + 1), carrying into the more significant position — this is
  exactly how multiply() below accumulates into a shared result array.
```

## Complexity

| Problem                                        | Time      | Space  |
|--------------------------------------------------|-----------|--------|
| 383. Ransom Note                                  | O(n + m)  | O(Σ)   |
| 415. Add Strings                                  | O(max(n,m)) | O(max(n,m)) |
| 151. Reverse Words in a String                    | O(n)      | O(n)   |
| 8. String to Integer (atoi)                       | O(n)      | O(1)   |
| 43. Multiply Strings                              | O(n · m)  | O(n + m) |
| 187. Repeated DNA Sequences                        | O(n)      | O(n)   |
| 32. Longest Valid Parentheses                      | O(n)      | O(n)   |

## Walkthrough

`09-leetcode-practice.ts` implements every problem as a standalone
exported function:

- `canConstruct` (383, Easy) — frequency count of `magazine`, decremented
  per character of `ransomNote`.
- `addStrings` (415, Easy) — simulates elementary-school addition from the
  last digit of each string backward, tracking carry.
- `reverseWords` (151, Medium) — trims, splits on runs of whitespace, and
  reverses word order.
- `myAtoi` (8, Medium) — hand-parses optional whitespace, sign, and digits,
  clamping to the 32-bit signed integer range as it accumulates.
- `multiply` (43, Medium) — grade-school digit-by-digit multiplication
  into a shared result array, as diagrammed above.
- `findRepeatedDnaSequences` (187, Medium) — slides a fixed 10-character
  window across the string, using a `Set` to flag sequences seen more
  than once.
- `longestValidParentheses` (32, Hard) — a stack of indices seeded with
  `-1`, tracking the index *before* the start of the current valid run.

## LeetCode practice

- 383. Ransom Note (Easy)
- 415. Add Strings (Easy)
- 151. Reverse Words in a String (Medium)
- 8. String to Integer (atoi) (Medium)
- 43. Multiply Strings (Medium)
- 187. Repeated DNA Sequences (Medium)
- 32. Longest Valid Parentheses (Hard)

## Key takeaways

- Most "hard" string problems decompose into the patterns from earlier
  lessons: hashing for counts, two pointers/stacks for structure, careful
  index bookkeeping for digit-by-digit simulation.
- String-as-number problems (Add Strings, Multiply Strings, atoi) avoid
  native number overflow/precision issues by working directly on
  characters/digits.
- A stack seeded with a sentinel index (`-1` in Longest Valid
  Parentheses) is a common trick to correctly measure "length since last
  invalid position" without special-casing the start of the string.
- Fixed-window hashing (Repeated DNA Sequences) is the same sliding-window
  idea from lesson 03, applied with a `Set` instead of a count map.

Companion code: [`09-leetcode-practice.ts`](./09-leetcode-practice.ts)
