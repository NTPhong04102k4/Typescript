# String Building Perf (Concat vs Array-Join, Engine Notes)

**Objective:** Choose the right string-building strategy — repeated `+=`,
array + `join`, or in-place index writes — based on how the string will be
used and how engines actually implement concatenation.

## Concept

Because strings are immutable, `result += piece` cannot literally grow a
buffer in place. Naively, that suggests every `+=` is an O(n) copy, making a
loop of n concatenations O(n^2). In practice, V8 (and most modern engines)
optimize repeated concatenation using **rope-like "cons strings"**: `a + b`
can create a lightweight node pointing at `a` and `b` instead of copying
both immediately. The copy is deferred until something actually needs the
flattened characters (e.g. `charAt`, sending it over a boundary, regex).
This makes many `+=` loops fast in practice — but it's an engine-specific
optimization, not a language guarantee, and heavy random-access reads on a
cons string can force expensive flattening.

The **portable, guaranteed-efficient** pattern is: push pieces into an
array, then call `.join("")` once at the end. This is always O(n) total,
independent of engine internals, and is the idiomatic choice when building
strings from many pieces (e.g. serializers, log formatters).

```
naive concat loop:            array + join:
result = ""                   parts = []
for piece of pieces:           for piece of pieces:
  result += piece                 parts.push(piece)
                                result = parts.join("")

  cons-string chain (conceptual):     array-join (conceptual):
  "abc" = concat("ab","c")            parts: ["a","b","c"]
             /      \                 join once -> "abc"
          "ab"      "c"
          /   \
        "a"   "b"
```

When you need to build a string of *known final length* (e.g. run-length
decoding, string compression), writing into a pre-sized array of
characters and joining once avoids both the cons-string uncertainty and
repeated reallocation — this is the pattern used by `443. String
Compression` and `394. Decode String` (see lesson 08).

## Complexity

| Strategy                                        | Time (n pieces, total length L) | Space |
|--------------------------------------------------|----------------------------------|-------|
| `result += piece` in a loop (naive, worst case)   | O(L^2) worst case, often O(L) in practice (cons strings) | O(L) |
| `parts.push(piece)` then `parts.join("")`         | O(L)                             | O(L)  |
| Template literals in a loop                       | same as `+=`                    | O(L)  |
| Pre-sized array + single join                     | O(L)                             | O(L)  |

## Walkthrough

`05-string-building-perf.ts` contrasts the strategies and applies them to
two real problems:

- `buildStringNaiveConcat` builds output with `+=` in a loop — correct, but
  relies on engine-specific cons-string optimization for its practical
  speed.
- `buildStringArrayJoin` builds the same output with `push` + `join`, the
  strategy that is fast independent of engine internals.
- `convert` solves **6. Zigzag Conversion** by building one array-backed
  string buffer per row, then joining all rows at the end.
- `compress` solves **443. String Compression** by writing run-length
  pairs directly into the input array in place, returning the new length.
- The exercise implements **38. Count and Say** by building each term
  as an array of run-length chunks and joining once per term.

## LeetCode practice

- 6. Zigzag Conversion (Medium)
- 443. String Compression (Medium)
- 38. Count and Say (Medium)

## Key takeaways

- Immutability means every concatenation conceptually allocates; array +
  `join` is the portable O(n) pattern regardless of engine tricks.
- V8's cons strings make many `+=` loops fast in practice, but that is an
  implementation detail, not a spec guarantee — don't rely on it for
  performance-critical code across engines.
- When the final length is knowable, writing directly into a
  pre-allocated array (or in place, as in String Compression) avoids
  extra intermediate allocations entirely.
- Building output row-by-row or chunk-by-chunk (Zigzag, Count and Say)
  and joining once per chunk keeps each step O(1) amortized.

Companion code: [`05-string-building-perf.ts`](./05-string-building-perf.ts)
