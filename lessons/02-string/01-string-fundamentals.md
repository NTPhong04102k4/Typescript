# String Fundamentals & Immutability in JS/TS

**Objective:** Understand how JS/TS represent strings in memory and why
immutability shapes every string algorithm you will write.

## Concept

A JS string is a sequence of UTF-16 **code units**, not bytes and not
necessarily "characters." Most common characters fit in one 16-bit code
unit, but characters outside the Basic Multilingual Plane (many emoji, some
CJK extensions) are encoded as a **surrogate pair** — two code units that
together represent one code point.

```
"café"        -> 4 code units: c, a, f, é           (all single-unit)
"a👍b"        -> 4 code units: a, [hi,lo] (👍), b     (👍 is a surrogate pair)
                  index:  0    1    2    3
                  code point view:  a  👍  b   (only 3 code points!)
```

Strings are **immutable**: once created, a string's contents never change.
`s[0] = 'X'` is a no-op (TypeScript even refuses to compile it — string
index signatures are read-only). Every "modification" — `toUpperCase()`,
`slice()`, `+`, template literals — allocates a **new** string. Two
primitive strings with the same contents are `===` equal because JS compares
them by value; two boxed `String` objects (`new String("x")`) are never
`===` equal to each other, because objects compare by reference.

```
primitive:  "hi" === "hi"                -> true   (value comparison)
boxed:      new String("hi") === new String("hi")  -> false (reference comparison)
```

Because of immutability, always reach for `Array.from(s)` or a spread
(`[...s]`) instead of `s.split('')` when you need code-point-safe iteration
— `split('')` slices by UTF-16 code unit and can tear a surrogate pair in
half.

## Complexity

| Operation                         | Time  | Space |
|-----------------------------------|-------|-------|
| Access `s[i]` / `charCodeAt(i)`   | O(1)  | O(1)  |
| `s.length`                        | O(1)  | O(1)  |
| Concatenation `a + b`             | O(n)  | O(n)  |
| `slice` / `substring`             | O(k)  | O(k)  |
| `split('')` (code-unit iteration) | O(n)  | O(n)  |
| `Array.from(s)` (code-point safe) | O(n)  | O(n)  |

`n` is the length of the resulting string; `k` is the length of the slice.

## Walkthrough

`01-string-fundamentals.ts` demonstrates these ideas directly:

- `demonstrateBoxedStringIdentity` compares two primitive strings and two
  boxed `String` objects to show value vs. reference equality.
- `codePointsOf` uses `Array.from` to split a string into code points
  safely, and `naiveCodeUnitsOf` uses `split('')` to show where it breaks
  on a surrogate pair (emoji).
- `reverseStringLeetCode344` solves **344. Reverse String** in place with
  the two-pointer swap pattern that later lessons build on.
- The exercises implement **14. Longest Common Prefix** and
  **58. Length of Last Word**.

## LeetCode practice

- 344. Reverse String (Easy)
- 14. Longest Common Prefix (Easy)
- 58. Length of Last Word (Easy)

## Key takeaways

- Strings are immutable UTF-16 code-unit sequences; every "mutation" creates
  a new string.
- Prefer `Array.from`/spread over `split('')` when correctness across
  surrogate pairs (emoji, some CJK) matters.
- Primitive strings compare by value (`===`); boxed `String` objects compare
  by reference — avoid `new String(...)` in real code.
- In-place two-pointer swaps (as in Reverse String) avoid extra allocations
  when the problem gives you a mutable character array.

Companion code: [`01-string-fundamentals.ts`](./01-string-fundamentals.ts)
