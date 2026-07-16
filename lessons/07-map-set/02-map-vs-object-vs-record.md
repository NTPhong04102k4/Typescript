# JS Map vs Object vs TS `Record<>`

**Objective:** Choose the right dictionary structure by understanding what `Map`, plain objects, and `Record<>` actually are at runtime.

## Concept

`Map` is a genuine hash table built into the engine: any value can be a
key, insertion order is preserved during iteration, and `.size` is O(1).
A plain object used as a dictionary is a *reused* general-purpose structure:
string/symbol keys only (numbers get coerced to strings), plus a prototype
chain you have to route around (`Object.create(null)` or `hasOwnProperty`).
`Record<K, V>` is not a runtime structure at all — it is a **TypeScript
compile-time type** meaning "an object whose keys are `K` and values are
`V`". It erases completely at compile time; the runtime value is a plain
object either way.

```
Map<string, number>                    Object / Record<string, number>
┌─────────────────────────┐            ┌─────────────────────────┐
│ own hash table           │            │ hidden class + property  │
│ (OrderedHashMap)          │            │ storage, shared with all │
│                          │            │ objects of the same      │
│ key: any type            │            │ "shape"                  │
│ iteration = insertion     │            │                          │
│  order, always            │            │ key: string | symbol only │
│ .size is O(1)             │            │ prototype chain lookup    │
└─────────────────────────┘            │ on miss                  │
                                        └─────────────────────────┘

Fixed, known keys (a "struct"):         Dynamic, unknown-at-compile-time keys:
  { id: number; name: string }            Map<string, number>
  -> stable hidden class, fast             -> no hidden-class churn,
     property access via inline cache         built for frequent add/delete
```

If an object's key set is fixed and known ahead of time (a struct-like
shape, e.g. `Record<'I' | 'V' | 'X', number>`), V8 assigns it a stable
hidden class and property access gets inline-cached — very fast. If keys
are added and removed dynamically (`obj[dynamicKey] = value` in a loop),
V8 falls back to a slower "dictionary mode" representation because the
object's shape keeps changing. `Map` sidesteps this entirely — it was
designed for exactly the dynamic-key-set case and never depends on hidden
classes for its own storage.

See also: [00-engine-internals/05-hidden-classes-inline-caches.md](../00-engine-internals/05-hidden-classes-inline-caches.md)

## Complexity

| Operation                     | Map (average)  | Object/Record (average)          |
| ------------------------------ | -------------- | ---------------------------------- |
| Get / set (fixed shape)         | O(1)            | O(1), fastest via inline cache      |
| Get / set (churning keys)       | O(1)            | O(1) average, but dictionary-mode overhead |
| Delete                          | O(1)            | O(1), but can trigger shape change  |
| Iterate in insertion order      | O(n), guaranteed | O(n), guaranteed for string keys since ES2015, but numeric-like keys iterate first in ascending order |
| `.size` / key count             | O(1) (`.size`) | O(n) (`Object.keys(obj).length`)    |

## Walkthrough

`ROMAN_VALUES` is a `Record<'I'|'V'|...,number>` — a fixed, compile-time-known
lookup table, used by `romanToInteger` (LeetCode 13) to convert Roman
numerals. `twoSumViaMap` (LeetCode 1) uses a `Map<number, number>` because
the set of seen values is unknown ahead of time and grows one entry at a
time. `isIsomorphic` (LeetCode 205) uses two `Map<string, string>` instances
for a bidirectional character mapping. `lengthOfLongestSubstring`
(LeetCode 3) uses `Map<string, number>` to track the last-seen index of each
character, letting the sliding window's left edge jump directly instead of
stepping one character at a time.

`benchmarkMapVsObjectChurn` times inserting and deleting many dynamic
string keys into a `Map` versus a plain object, illustrating the
dictionary-mode cost described above. `mapToRecord` and `recordToMap`
(exercises) convert between the two representations — useful since
`JSON.stringify` does not serialize `Map` directly.

## LeetCode practice

1. **1. Two Sum** (Easy) — dynamic key set favors `Map`.
2. **13. Roman to Integer** (Easy) — fixed key set favors `Record<>`.
3. **205. Isomorphic Strings** (Easy) — two `Map` instances for a bidirectional lookup.
4. **3. Longest Substring Without Repeating Characters** (Medium) — `Map` tracking last-seen index.

## Key takeaways

- `Map` is a real hash table with any-type keys, guaranteed insertion-order iteration, and O(1) `.size`.
- Plain objects/`Record<>` are best for fixed, compile-time-known shapes — V8 rewards stable shapes with inline caches.
- `Record<K, V>` is a TypeScript-only type; it has no runtime representation beyond a plain object.
- Prefer `Map` when keys are added/removed dynamically at runtime; prefer object/`Record` for struct-like, known-key data.
- Numeric-like string keys on objects iterate in ascending numeric order first, which can surprise you — `Map` never reorders.

Companion code: [`02-map-vs-object-vs-record.ts`](./02-map-vs-object-vs-record.ts)
