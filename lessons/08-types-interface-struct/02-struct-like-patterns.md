# Struct-like patterns: readonly, tuples, records

**Objective:** Model fixed-shape, low-behavior data — the way DSA code represents points, edges, and frequency tables — using `readonly`, tuples, and `Record<K, V>`.

## Concept

A **struct** is a bag of fields with no real behavior. TypeScript gives
three complementary tools for modeling one precisely:

- **`readonly`** marks a field (or a whole array/tuple) as non-reassignable
  after creation. It is a compile-time guard only — erased at runtime, so it
  costs nothing and prevents nothing at runtime, but it stops accidental
  mutation from compiling.
- **Tuples** (`readonly [A, B]`, or labeled `[from: number, to: number]`)
  are fixed-length, positional structs — every slot has a known type and
  meaning, unlike a same-typed array of arbitrary length.
- **`Record<K, V>`** is a struct-like map from a *known, finite* key set to
  a value type — the compiler checks every key is present and no unknown
  key sneaks in.

```
Tuple (fixed slots, positional):        Record<Grade, number> (fixed keys):
+-------+-------+--------+              { A: 90, B: 80, C: 70, D: 60, F: 0 }
| from  |  to   | weight |                 ^ every key required, no extras
+-------+-------+--------+                 v structurally checked at compile time
  0       1        2
```

## Complexity

| Operation | Time | Space | Note |
| --- | --- | --- | --- |
| Read a tuple slot by index | O(1) | O(1) | same as a regular array — tuples are arrays at runtime |
| Read a `readonly` array element | O(1) | O(1) | identical to a mutable array; `readonly` is erased at compile time |
| Traverse a `readonly` array (n items) | O(n) | O(1) | no different from `number[]` |
| `Record<K, V>` key lookup | O(1) avg | O(1) | backed by a plain object; same hash-lookup cost as any object property access |
| Build a `Record<string, number>` frequency map over n chars | O(n) | O(k) | k = number of distinct keys |

## Walkthrough

`02-struct-like-patterns.ts` starts with `ImmutablePoint` (`readonly x`,
`readonly y`) and `translate`, which returns a *new* point instead of
mutating — the idiomatic way to "change" a readonly struct.

`Pair<A, B>` is a `readonly [A, B]` tuple with `swap`, showing a
positional 2-slot struct. `WeightedEdge` is a labeled 3-slot tuple
(`[from, to, weight]`) read by `edgeWeight` — the same shape used for graph
edges in topic 10.

`Grade` and `GradeThresholds = Record<Grade, number>` model a fixed-key
lookup table; `defaultThresholds` and `gradeFor` show it being read.
`sumReadonly` demonstrates that `readonly number[]` costs nothing extra at
runtime compared to `number[]`.

The exercises build `letterFrequency` (a `Record<string, number>` counter,
the same pattern used throughout topic 07 Map/Set) and `minAndMax` (a
`readonly [number, number]` tuple built in one pass).

## LeetCode practice

- 1. Two Sum (Easy) — the canonical solution returns a fixed 2-slot tuple `[number, number]`, exactly like `Pair<number, number>` here.
- 242. Valid Anagram (Easy) — solved with a `Record<string, number>` frequency table, the same shape as `letterFrequency`.
- 973. K Closest Points to Origin (Medium) — points are naturally modeled as 2-tuples or small readonly structs before sorting/selecting.

## Key takeaways

- `readonly` is a compile-time-only guard: zero runtime cost, zero change to memory layout or access speed.
- Tuples give positional structs fixed length and per-slot types; labeled tuple elements (`from:`, `to:`, `weight:`) add documentation without changing runtime shape.
- `Record<K, V>` is the right tool when the key set is known and finite; reach for `Map<K, V>` (topic 07) when keys are dynamic or need insertion-order iteration guarantees.
- Index access on tuples and `readonly` arrays is O(1), identical to plain arrays — the safety is purely a compile-time property.
- "Immutable update" in TypeScript almost always means "build and return a new value," not "mutate in place."

Companion code: [`02-struct-like-patterns.ts`](./02-struct-like-patterns.ts)
